//#region Server Setup
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const brotli = require("crypto");

const { v4: client_id } = require('uuid');

const app = express();
app.disable('x-powered-by');
const ADDRESS = '192.168.1.3';
const PORT = 5000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
//#endregion

//#region Connect Database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // أدخل كلمة مرور MySQL الخاصة بك
    database: 'test',
});
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to Database');
    }
});
//#endregion

//#region Encryption Systems


const Testkey = '9dc8357be0d879d69d0a49ca9a8c6da5b226259aab5ad29e34741474163277e6';


const encryptText = (text) => {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return { encryptedData: encrypted, iv: iv.toString("hex"), key: key.toString("hex") };
};

const decryptText = (ed, iv, ky) => {
    const decipher = crypto.createDecipheriv("aes-256-cbc", ky, Buffer.from(iv, "hex"));
    let decrypted = decipher.update(ed, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};

//#endregion

//#region React Systems
app.post('/api/auth', (req, res) => {
    if (req.query.type === 'signin') {
        const { email, password } = req.body;
        if (email && password) {
            const sql = 'SELECT utoken,name,password,email FROM users WHERE email = ?';
            db.query(sql, [email], (err, results) => {
                if (err) {
                    return res.status(500).send(err);
                }

                const user = results[0];
                const clientId = client_id();
                if (bcrypt.compareSync(password, results[0].password)) {
                    const ed = encryptText(email);
                    const sql = 'UPDATE users SET client_id = ?, utoken = ?, uiv = ? , ukey = ?  WHERE email = ?';
                    db.query(sql, [clientId, ed.encryptedData, Buffer.from(ed.iv, "hex"), ed.key, email], (err) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        return res.json([{ status: true, message: { client_id: clientId, at: ed.encryptedData.toString('hex'), ky: ed.key.toString('hex'), name: user.name } }]);

                    });
                } else {
                    return res.json([{ status: false, message: 'invalid data' }]);
                }
            });
        }
    }
    if (req.query.type === 'signup') {
        const { email, password, confirm_password } = req.body;
        if (email && password, confirm_password) {
            const sql = 'SELECT email FROM users WHERE email = ?';
            db.query(sql, [email], (err, results) => {
                if (err) {
                    return res.status(500).send(err);
                }
                if (results.length === 0) {
                    const user = results[0];
                    const saltRounds = 10;
                    if (password === confirm_password) {
                        const ed = encryptText(email);
                        const sql = 'INSERT INTO users (uip,utoken, uiv, ukey, email, password) VALUES (?, ?, ?, ?, ?, ?)';
                        db.query(sql, [req.ip, ed.encryptedData, Buffer.from(ed.iv, "hex", email, password), ed.key, email, bcrypt.hashSync(password, saltRounds)], (err) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            return res.json([{ status: true, message: { test: '' } }]);

                        });
                    } else {
                        return res.json([{ status: false, message: 303 }]);
                    }
                } else {
                    return res.json([{ status: false, message: 304 }]);
                }
            });
        }
    }
});

app.get('/api/search', (req, res) => {
    console.log('[Search]: ' + req.query['q'] + ' : From ' + req.ip);

    const sql = 'SELECT * FROM products WHERE title LIKE ?';
    db.query(sql, [`%${req.query['q']}%`], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        return res.json({ message: results });
    });
});

app.get('/api/shop', (req, res) => {
    const sql = `
    SELECT 
        p.id,
        p.title,
        p.quantity,
        p.image,
        p.price,
        p.type_id,
        t.type AS type_name,
        s.name AS section_name,     -- <<< اسم القسم
        p.mark,
        p.model,
        p.date,
        ROUND(COALESCE(AVG(r.rating), 0), 1) AS average_rating,
        COALESCE(COUNT(r.rating), 0) AS total_ratings,
        CASE WHEN sv.user_id = ? THEN 1 ELSE 0 END AS is_saved
    FROM 
        products p
    LEFT JOIN 
        ratings r ON p.id = r.product_id
    LEFT JOIN
        types t ON p.type_id = t.id
    LEFT JOIN 
        sections s ON t.id_section = s.id    -- <<< ربط القسم
    LEFT JOIN 
        saves sv ON p.id = sv.product_id
    LEFT JOIN 
        users u ON sv.user_id = u.id
    GROUP BY 
        p.id
    ORDER BY 
        average_rating DESC
    LIMIT 20;
`;

    db.query(sql, [111], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        // التحقق من وجود بيانات المنتجات
        if (!results || results.length === 0) {
            return res.status(404).send('No products with ratings found');
        }

        return res.json({ products: results });
    });
});

app.get('/api/test', (req, res) => {

    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [2], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }

        const encryptedData = Buffer.from(result[0].utoken, 'hex'); // Public
        const ivBuffer = Buffer.from(result[0].uiv, 'hex'); // Private
        const key = Buffer.from(result[0].ukey, 'hex'); // Public


        const decrypted = decryptText(encryptedData, ivBuffer, key);
        return res.json({ status: true, message: [{ newEncrypt: decrypted }] })
    });

});

app.get('/api/inbox', (req, res) => {
    const sql = 'SELECT id,uiv,email FROM users WHERE client_id = ? AND utoken = ? AND ukey = ?';
    db.query(sql, [req.query.client_id, req.query.at, req.query.ky], (err, v) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (v.length === 0) {
            return res.status(404).send('CLIENT_ID INCORRECT');
        }

        try {

            const t = Buffer.from(req.query.at, 'hex'); const i = Buffer.from(v[0].uiv, 'hex'); const k = Buffer.from(req.query.ky, 'hex');
            const r = decryptText(t, i, k);

            if (v[0].email === r) {
                const sql = 'SELECT * FROM inbox WHERE user_id = ? ORDER BY id DESC';
                db.query(sql, [v[0].id], (err, inbox) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    return res.json({ status: true, message: inbox })

                });
            }
        } catch (err) {
            res.status(500).send('Data failed.');
        }
    });
});

app.get('/api/product', (req, res) => {
    if (req.query.q != undefined) {
        console.log(req.query.q);
        const sql = `
SELECT 
  p.id AS product_id,
  p.title AS t,
  p.price AS p,
  p.quantity AS q,
  p.image AS i,
  p.type_id AS ty,
  mk.mark AS mn,
  mk.logo_id AS mli,
  ml.model AS mln,
  typ.type AS tys,
 ROUND(COALESCE(AVG(r.rating), 0), 1) AS average_rating,
  COALESCE(COUNT(r.rating), 0) AS total_ratings,


    COUNT(CASE WHEN r.rating = 5 THEN 1 END) AS st_5,
  COUNT(CASE WHEN r.rating = 4 THEN 1 END) AS st_4,
  COUNT(CASE WHEN r.rating = 3 THEN 1 END) AS st_3,
  COUNT(CASE WHEN r.rating = 2 THEN 1 END) AS st_2,
  COUNT(CASE WHEN r.rating = 1 THEN 1 END) AS st_1
FROM 
  products p
LEFT JOIN 
  ratings r ON p.id = r.product_id
INNER JOIN 
  marks mk ON p.mark = mk.id
INNER JOIN 
  models ml ON ml.mark_id = mk.id
INNER JOIN 
  types typ ON p.type_id = typ.id
WHERE 
  p.title = ?
GROUP BY 
  p.id, mk.mark, mk.logo_id, ml.model, typ.type
ORDER BY 
  average_rating DESC;


      `;
        db.query(sql, [req.query.q], (err, service) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (service.length != 0) {
                return res.json({ status: true, message: service });
            } else {
                return res.json({ status: false, message: 304 });
            }
        });
    }
});

app.get('/api/saves', (req, res) => {
    if (req.query.at != undefined) {
        const sql = 'SELECT id FROM users WHERE utoken = ?';
        db.query(sql, [req.query.at], (err, users) => {
            if (err) {
                return res.status(500).send(err);
            }
            var user = { id: users[0].id };

            if (users.length != 0) {
                const sql = 'SELECT * FROM saves WHERE user_id = ?';
                db.query(sql, [user.id], (err, saves) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    if (saves.length != 0) {
                        const productIds = saves.map(save => save.product_id);
                        const sql = 'SELECT * FROM products WHERE id IN (?)';
                        db.query(sql, [productIds], (err, product) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            return res.json({ status: true, message: product })
                        });
                    } else {
                        return res.json({ status: true, message: saves })
                    }
                });
            } else {
                return res.json({ status: true, message: 'Failed to get product' });
            }
        });
    }
});

app.get('/api/orders', (req, res) => {
    if (req.query.at != undefined) {
        const sql = 'SELECT id FROM users WHERE utoken = ?';
        db.query(sql, [req.query.at], (err, users) => {
            if (err) {
                return res.status(500).send(err);
            }
            var user = { id: users[0].id };

            if (users.length != 0) {
                const sql = 'SELECT * FROM orders WHERE user_id = ?';
                db.query(sql, [user.id], (err, orders) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    if (orders.length != 0) {
                        const productIds = orders.map(order => order.product_id);
                        const sql = 'SELECT * FROM products WHERE id IN (?)';
                        db.query(sql, [productIds], (err, product) => {
                            if (err) {
                                return res.status(500).send(err);
                            }

                            const filteredOrders = orders.map(order => ({
                                quantity: order.quantity,
                                price: order.price,
                                date: order.date
                            }));

                            return res.json({ status: true, message: product, iOrder: filteredOrders });
                        });
                    } else {
                        return res.json({ status: true, message: orders })
                    }
                });
            } else {
                return res.json({ status: true, message: 'Failed to get product' });
            }
        });
    }
});

app.get('/api/response', (req, res) => {

    if (req.query.type === 'home.sections') {

        const sql = `
    SELECT 
        s.id,
        s.name ,
        s.image AS img,
        s.date,
        COUNT(t.id) AS total_types
    FROM 
        sections s
    LEFT JOIN 
        types t ON t.id_section = s.id
    GROUP BY 
        s.id, s.name, s.image, s.date
    ORDER BY 
        s.date DESC;
`;
        db.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }

            // التحقق من وجود بيانات المنتجات
            if (!results || results.length === 0) {
                return res.status(404).send('No products with ratings found');
            }

            return res.json({ sections: results });
        });

    }


    if (req.query.type === 'home.bestSelling') {

        const sql = `
        SELECT 
            p.id,
            p.title,
            p.quantity,
            p.image,
            p.price,
            p.type_id,
            t.type AS type_name,
            s.name AS section_name,
            p.mark,
            p.model,
            p.date,
            ROUND(COALESCE(AVG(r.rating), 0), 1) AS average_rating,
            COALESCE(COUNT(r.rating), 0) AS total_ratings
        FROM 
            products p
        LEFT JOIN 
            ratings r ON p.id = r.product_id
        LEFT JOIN
            types t ON p.type_id = t.id
        LEFT JOIN 
        sections s ON t.id_section = p.type_id
        WHERE 
            r.rating IS NOT NULL
        GROUP BY 
            p.id
        ORDER BY 
            average_rating DESC
        LIMIT 20;
    `;

        db.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }

            // التحقق من وجود بيانات المنتجات
            if (!results || results.length === 0) {
                return res.status(404).send('No products with ratings found');
            }

            return res.json({ products: results });
        });

    }

    if (req.query.type === 'basket.products') {
        const { at, ky } = req.query;

        if (!at || !ky) {
            return res.status(400).json({ status: false, message: 'Missing token or key' });
        }

        const getUserSql = `
        SELECT 
            id, utoken, uiv, ukey, email, date, name 
        FROM 
            users 
        WHERE 
            utoken = ? AND ukey = ?
    `;

        db.query(getUserSql, [at, ky], (err, userData) => {
            if (err) return res.status(500).send(err);
            if (!userData?.length) {
                return res.status(404).json({ status: false, message: 'User not found' });
            }

            const user = userData[0];

            let decryptedEmail;
            try {
                const t = Buffer.from(user.utoken, 'hex');
                const i = Buffer.from(user.uiv, 'hex');
                const k = Buffer.from(user.ukey, 'hex');
                decryptedEmail = decryptText(t, i, k);
            } catch (error) {
                return res.status(400).json({ status: false, message: 'Decryption failed' });
            }

            if (user.email !== decryptedEmail) {
                return res.status(401).json({ status: false, message: 'Invalid token' });
            }

            const getBasketProductsSql = `
            SELECT 
    b.id AS basket_id,
    b.product_id,
    b.quantity AS basket_quantity,
    b.date AS basket_date,

    p.id AS product_id,
    p.title,
    p.image,
    p.price,
    p.quantity AS stock,
    p.mark,
    p.model,
    p.type_id AS product_type_id,

    t.type AS type_name,

    s.id AS section_id,
    s.name AS section_name

FROM 
    basket b
INNER JOIN 
    products p ON b.product_id = p.id
LEFT JOIN 
    types t ON p.type_id = t.id
LEFT JOIN 
    sections s ON t.id_section = s.id
WHERE 
    b.user_id = ?
ORDER BY 
    b.id DESC;
        `;

            db.query(getBasketProductsSql, [user.id], (err, basketProducts) => {
                if (err) return res.status(500).send(err);
                if (!basketProducts?.length) {
                    return res.json({ status: false, message: 'No products in basket' });
                }

                // يمكنك لاحقًا تجميع المنتجات حسب السلة إن أردت
                return res.json({
                    status: true,
                    message: {
                        products: basketProducts.map(p => ({
                            id: p.id,
                            title: p.title,
                            image: p.image,
                            price: p.price,
                            price: p.price,
                            type_id: p.type_id,
                            type_name: p.type_name,
                            section_id: p.section_id,
                            section_name: p.section_name,
                            stock: p.stock,
                            mark: p.mark,
                            model: p.model,
                            type_id: p.type_id,
                            quantity_in_basket: p.quantity,
                            basket_id: p.basket_id,
                            basket_date: p.basket_date
                        }))
                    }
                });
            });
        });
    }


    if (req.query.type === 'settings.account') {

        if (req.query.at !== undefined && req.query.ky !== undefined) {
            const sql = 'SELECT utoken, uiv, ukey, email, date, name FROM users WHERE utoken = ? AND ukey = ?';
            db.query(sql, [req.query.at, req.query.ky], (err, data) => {
                if (err) {
                    return res.status(500).send(err);
                }
                const t = Buffer.from(data[0].utoken, 'hex'); const i = Buffer.from(data[0].uiv, 'hex'); const k = Buffer.from(data[0].ukey, 'hex');
                const r = decryptText(t, i, k);

                if (data[0].email === r) {
                    return res.json({ status: true, message: [{ user: [{ name: data[0].name, email: data[0].email, date: data[0].date }] }] })
                } else {
                    return res.json({ status: false, message: 'Error in matching data.' })
                }

            });
        }
    }
});

app.get('/api/action', (req, res) => {

    if (req.query['type'] == 'save' && req.query['target'] != undefined) {
        const sql = 'SELECT id,uiv,email FROM users WHERE client_id = ? AND utoken = ? AND ukey = ?';
        db.query(sql, [req.query.client_id, req.query.at, req.query.ky], (err, v) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (v.length === 0) {
                return res.status(404).send('CLIENT_ID INCORRECT');
            }

            const t = Buffer.from(req.query.at, 'hex'); const i = Buffer.from(v[0].uiv, 'hex'); const k = Buffer.from(req.query.ky, 'hex');
            const r = decryptText(t, i, k);

            if (v[0].email === r) {
                if (v.length != 0) {
                    const user = { id: v[0].id };
                    const sql = 'SELECT id FROM products WHERE title = ? AND id = ?';
                    db.query(sql, [req.query.target, req.query.id], (err, v) => {
                        if (err) {
                            return res.json({ status: false, message: { code: 305 } });
                        }
                        const product = { id: v[0].id };
                        const sql = 'SELECT * FROM saves WHERE user_id = ? AND product_id = ?';
                        db.query(sql, [user.id, product.id], (err, found) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            if (found.length === 0) {
                                const sql = 'INSERT INTO saves (user_id, product_id) VALUES (?,?)';
                                db.query(sql, [user.id, product.id], (err) => {
                                    if (err) {
                                        return res.status(500).send(err);
                                    }

                                    return res.json({ status: true, message: { code: 300 } });
                                });
                            } else {
                                const sql = 'DELETE FROM saves WHERE user_id = ? AND product_id = ?';
                                db.query(sql, [user.id, product.id], (err) => {
                                    if (err) {
                                        return res.status(500).send(err);
                                    }
                                    return res.json({ status: true, message: { code: 301 } });
                                });
                            }
                        });
                    });
                }
            }
        });

    }

    if (req.query['type'] == 'control.marks') {
        const sql = 'SELECT * FROM marks ORDER BY id';
        console.log('get');
        db.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            return res.json({ status: true, message: result })

        });
    }

    if (req.query['type'] == 'control.types') {
        const sql = 'SELECT * FROM types ORDER BY id';
        console.log('get');
        db.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            return res.json({ status: true, message: result })

        });
    }

    if (req.query['type'] == 'control.models') {
        const sql = 'SELECT * FROM models ORDER BY id';
        console.log('get');
        db.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            return res.json({ status: true, message: result })

        });
    }
});

app.post('/api/post', (req, res) => {
    const body = req.body;

    if (body.type == 'shop.filter.products') {
        // تحديد قيم الاستعلام
        let sql = `
        SELECT 
            p.id,
            p.title,
            p.quantity,
            p.image,
            p.price,
            p.type_id,
            p.mark,
            p.model,
            p.date,
            COALESCE(AVG(r.rating), 0) AS average_rating,
            COALESCE(COUNT(r.rating), 0) AS total_ratings
        FROM 
            products p
        LEFT JOIN 
            ratings r ON p.id = r.product_id
        INNER JOIN 
            marks mk ON p.mark = mk.id
        WHERE 1=1
        `;

        let queryParams = [];

        if (body.data.mark) {
            sql += ` AND mk.id = ?`;
            queryParams.push(body.data.mark);
        }

        if (body.data.model) {
            sql += ` AND p.id = ?`;
            queryParams.push(body.data.model);
        }

        if (body.data.type) {
            sql += ` AND p.type_id = ?`;
            queryParams.push(1);
        }

        sql += `
        GROUP BY 
            p.id
        ORDER BY 
            average_rating DESC
        LIMIT 20;
        `;

        // تنفيذ الاستعلام مع المعاملات
        db.query(sql, queryParams, (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }

            // التحقق من وجود بيانات المنتجات
            if (!results || results.length === 0) {
                return res.status(404).send('No products found');
            }

            return res.json({ products: results });
        });
    }


    if (body.type == 'basket.add.product') {
        console.log(body);
        const sql = 'SELECT id,uiv,email FROM users WHERE client_id = ? AND utoken = ? AND ukey = ?';
        db.query(sql, [body.verify.client_id, body.verify.at, body.verify.ky], (err, v) => {
            if (err) {
                return res.status(500).send(err);
            }
            const t = Buffer.from(body.verify.at, 'hex'); const i = Buffer.from(v[0].uiv, 'hex'); const k = Buffer.from(body.verify.ky, 'hex');
            const r = decryptText(t, i, k);

            if (v[0].email === r) {
                if (body.data.title && body.data.product_id) {
                    const sql = 'INSERT INTO basket (user_id,product_id,quantity) VALUES (?,?,?)';
                    db.query(sql, [v[0].id, body.data.product_id, 1], (err) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        return res.json({ status: true, message: 'True' })

                    });
                } else {
                    return res.json({ status: true, message: { code: '303' } })
                }

            } else {
                return res.json({ status: true, message: { code: '304' } })
            }
        });
    }

    if (body.type == 'control.create.product') {
        const sql = 'SELECT id,uiv,email FROM users WHERE utoken = ? AND ukey = ?';
        db.query(sql, [body.verify.at, body.verify.ky], (err, verify) => {
            if (err) {
                return res.status(500).send(err);
            }
            const t = Buffer.from(body.verify.at, 'hex'); const i = Buffer.from(verify[0].uiv, 'hex'); const k = Buffer.from(body.verify.ky, 'hex');
            const r = decryptText(t, i, k);

            if (verify[0].email === r) {
                const sql = 'INSERT INTO products (title,quantity,image,price,type_id,mark,model) VALUES (?,?,?,?,?,?,?)';
                db.query(sql, [body.data.name, body.data.quantity, 1, body.data.price, 1, 1, 1], (err, test) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    return res.json({ status: true, message: 'True' })

                });


            } else {
                return res.json({ status: true, message: { code: '304' } })
            }
        });
    }
    if (body.type == 'control.create.type') {
        const sql = 'SELECT id,uiv,email FROM users WHERE utoken = ? AND ukey = ?';
        db.query(sql, [body.verify.at, body.verify.ky], (err, verify) => {
            if (err) {
                return res.status(500).send(err);
            }
            const t = Buffer.from(body.verify.at, 'hex'); const i = Buffer.from(verify[0].uiv, 'hex'); const k = Buffer.from(body.verify.ky, 'hex');
            const r = decryptText(t, i, k);

            if (verify[0].email === r) {
                const sql = 'INSERT INTO types (type) VALUES (?)';
                db.query(sql, [body.data.type], (err) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    return res.json({ status: true, message: '300' })

                });


            } else {
                return res.json({ status: true, message: { code: '304' } })
            }
        });
    }
    if (body.type == 'control.create.mark') {
        const sql = 'SELECT id,uiv,email FROM users WHERE utoken = ? AND ukey = ?';
        db.query(sql, [body.verify.at, body.verify.ky], (err, verify) => {
            if (err) {
                return res.status(500).send(err);
            }
            const t = Buffer.from(body.verify.at, 'hex'); const i = Buffer.from(verify[0].uiv, 'hex'); const k = Buffer.from(body.verify.ky, 'hex');
            const r = decryptText(t, i, k);

            if (verify[0].email === r) {
                const sql = 'INSERT INTO marks (mark,logo_id) VALUES (?,?)'; //
                db.query(sql, [body.data.mark_name, body.data.logo_id], (err) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    return res.json({ status: true, message: '300' })

                });


            } else {
                return res.json({ status: true, message: { code: '304' } })
            }
        });
    }
    if (body.type == 'control.create.model') {
        const sql = 'SELECT id,uiv,email FROM users WHERE utoken = ? AND ukey = ?';
        db.query(sql, [body.verify.at, body.verify.ky], (err, verify) => {
            if (err) {
                return res.status(500).send(err);
            }
            const t = Buffer.from(body.verify.at, 'hex'); const i = Buffer.from(verify[0].uiv, 'hex'); const k = Buffer.from(body.verify.ky, 'hex');
            const r = decryptText(t, i, k);
            if (verify[0].email === r) {
                if (body.data.mark.length != 0 && body.data.model_name.length != 0) {
                    const sql = 'INSERT INTO models (mark_id,model) VALUES (?,?)';
                    db.query(sql, [body.data.mark, body.data.model_name], (err) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        return res.json({ status: true, message: '300' })

                    });
                } else {
                    return res.json({ status: true, message: { code: '303' } })
                }


            } else {
                return res.json({ status: false, message: { code: '304' } })
            }
        });
    }
});

app.get("/api/authVerify", (req, res) => {
    if (req.query.at) {
        const sql = 'SELECT * FROM users WHERE utoken = ?';
        db.query(sql, [req.query.at], (err, results) => {
            const user = results[0];
            if (err) {
                return res.status(500).send(err);
            }
            if (user != undefined) {

                jwt.verify(req.query.at, user.email, (err) => {
                    if (err) return res.status(403).send("Invalid token");
                    return res.json({ status: true, message: "Access granted", name: results[0].name });
                });

            } else {
                return res.json({ status: false, message: "Invalid token" });
            }
        });
    } else {
        return res.json({ status: false, message: "Invalid token" });
    }
    return res.json({ status: false, message: "Invalid token" });
});
//#endregion

//#region Start Server
app.listen(PORT, () => {
    console.log(`Server is running on ${ADDRESS}:${PORT}`);
});
//#endregion