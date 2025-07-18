import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AppContext } from "./../AppContext";

export default function Services() {
    const [services, setServices] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [saves, setSaves] = useState([]);
    const [arrangement, setarrangement] = useState(false);
    const [saveActive, setSaveActive] = useState(false);
    const [saveDisabled, setsaveDisable] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        id: null
    });

    const getCookie = (name) => {
        const cookies = document.cookie.split('; ');
        for (let i = 0; i < cookies.length; i++) {
            const [key, value] = cookies[i].split('=');
            if (key === name) return decodeURIComponent(value);
        }
        return null;
    };


    const checkout = (product) => {
        console.log(product);
    };
    const { count, setCount } = useContext(AppContext);
    useEffect(() => {
        axios.get('http://192.168.1.100:5000/api/shop?at=' + getCookie('at'))
            .then((response) => {
                setCount({ count: response.data.products.length });


                setServices(response.data.products);
            })
            .catch((error) => {
                console.error('Error fetching services:', error);
            });
    }, []);

    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(number);
    };

    const saveSubmit = async (target, id, e) => {
        e.preventDefault(); // منع إعادة تحميل الصفحة
        setsaveDisable(!saveDisabled);

        try {
            // إرسال البيانات إلى خادم API
            const response = await fetch("http://192.168.1.100:5000/api/action?type=save&target=" + target + "&client_id=" + getCookie('client_id') + "&id=" + id + "&at=" + getCookie('at') + "&ky=" + getCookie('ky'), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                if (data.status == true) {
                    console.log(data.message.code);
                    if (data.message.code == 300) {
                        document.getElementById(id).classList.add('active');
                        setsaveDisable(saveDisabled);
                    } if (data.message.code == 301) {
                        document.getElementById(id).classList.remove('active');
                        setsaveDisable(saveDisabled);
                    }
                } else {

                }
            } else {


            }
        } catch (err) {
            console.error("خطأ:", err);

        }
    };

    const basketSubmet = async (target, id, e) => {
        e.preventDefault();
        const response = await fetch("http://192.168.1.100:5000/api/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ type: 'basket.add.product', verify: { client_id: getCookie('client_id'), at: getCookie('at'), ky: getCookie('ky') }, data: { title: target, product_id: id } }),
        });

        const data = await response.json();

        if (response.ok) {
            if (data.status == true) {
                // Success
            } else {
                // Failed
            }
        } else {
            // Failure
        }
    };

    return (
        // <div>
        //     <div className='product-text'>قطع الغيار الرائجة</div>
        //     <ul>
        //         {services.map((service) => (
        //             <li key={service.uid}>
        //                 <h2>{service.nam}</h2>
        //                 <p>{service.description}</p>
        //                 <p>السعر: {service.price} تجربة</p>
        //             </li>
        //         ))}
        //     </ul>
        // </div>
        <div className={`products ${arrangement === true ? 'vertical' : 'horizontal'}`}>
            {services.map((service) => (
                <div className='sh-product'>
                    <div className='flwd'>
                        <div className='flex fwid h-center'>

                            <Link to={`/product/${service.title}`} className='preventDefault'>
                                <img src={`/img/${service.image}.jpg`} className='product-img'></img>
                            </Link>
                        </div>
                        <div className='space-20'></div>
                        <div className='product-disc'>

                            <div className='flex'>
                                <Link to={`/product/${service.title}`} className='preventDefault'>
                                    <div className='product-title'><div className='ml-text'>{service.title}</div>
                                        <div className='tooltip'>
                                            {service.title}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className='flex'>
                                <div className='product-type'>
                                    السعر
                                    <div className='space-10'></div><div className='flex'>
                                        <div className='product-price'>{formatNumber(service.price)} ج.م
                                        </div>
                                    </div>
                                </div>
                                {/* <div className='space-10'></div>
                                <div className='solid-v-2'></div>
                                <div className='space-10'></div>
                                <div className='product-type'>
                                    الكمية
                                    <div className='space-10'></div><div className='flex'>
                                        <div className='product-quantity'>{service.quantity} قطع
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                            <div>
                                {service.total_ratings ? (
                                    <div className='LayoutProduct-rating'>
                                        <div className='LayoutProduct-ratingText'>{service.total_ratings ? (service.average_rating) : ('0.0')}</div>

                                        <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 1.99 ? ('icon-ratingAct') : ('icon-rating')) : ('icon-rating')}>
                                            <rect className="transparent" width="18" height="18" />
                                            <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 2.99 ? ('icon-ratingAct') : ('icon-rating')) : ('icon-rating')}>
                                            <rect className="transparent" width="18" height="18" />
                                            <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 3.99 ? ('icon-ratingAct') : ('icon-rating')) : ('icon-rating')}>
                                            <rect className="transparent" width="18" height="18" />
                                            <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 4.99 ? ('icon-ratingAct') : ('icon-rating')) : ('icon-rating')}>
                                            <rect className="transparent" width="18" height="18" />
                                            <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating === 5 ? ('icon-ratingAct') : ('icon-rating')) : ('icon-rating')}>
                                            <rect className="transparent" width="18" height="18" />
                                            <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                                        </svg>
                                    </div>
                                ) : (
                                    <div className='rating-norat'>
                                        كن أول مشتري
                                    </div>
                                )}
                            </div>

                            <div className='dspace-10'></div>


                            {/* <div className='product-type keywords'>
                                الكلمات المفتاحية
                                <div className='space-10'></div>
                                {keywords.map((keyword) => (

                                    <div className='flex'>
                                        <div className='product-section'>{keyword.keyword}</div>
                                        <div className='space-10'></div>
                                    </div>
                                ))}

                                <div className='space-10'></div>
                            </div> */}

                        </div>
                    </div>
                    {!service.is_saved ? (
                        <div className='flex fwid h-center'>
                            <form onSubmit={(e) => basketSubmet(service.title, service.id, e)}>

                                <button type='submet' className='icon cans-pd'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className='icon'>
                                        <rect className="transparent" width="18" height="18" />
                                        <g>
                                            <path d="M17.07,2.89c-0.64-0.14-1.28,0.26-1.43,0.9l-1.26,5.59H3.62L2.36,3.79c-0.15-0.64-0.78-1.04-1.43-0.9
		c-0.64,0.15-1.05,0.78-0.9,1.43l1.47,6.52c0.12,0.54,0.61,0.93,1.16,0.93h12.67c0.56,0,1.04-0.39,1.16-0.93l1.47-6.52
		C18.12,3.68,17.71,3.04,17.07,2.89z"/>
                                            <path d="M4.35,13.74c-0.86,0-1.56,0.7-1.56,1.56c0,0.86,0.7,1.56,1.56,1.56c0.86,0,1.56-0.7,1.56-1.56
		C5.91,14.44,5.21,13.74,4.35,13.74z"/>
                                            <path d="M13.65,13.74c-0.86,0-1.56,0.7-1.56,1.56c0,0.86,0.7,1.56,1.56,1.56c0.86,0,1.56-0.7,1.56-1.56
		C15.21,14.44,14.51,13.74,13.65,13.74z"/>
                                            <path d="M9,8.34L9,8.34c0.5,0,0.9-0.4,0.9-0.9v-1.8h1.8c0.5,0,0.9-0.4,0.9-0.9v0c0-0.5-0.4-0.9-0.9-0.9H9.9v-1.8
		c0-0.5-0.4-0.9-0.9-0.9h0c-0.5,0-0.9,0.4-0.9,0.9v1.8H6.3c-0.5,0-0.9,0.4-0.9,0.9v0c0,0.5,0.4,0.9,0.9,0.9h1.8v1.8
		C8.1,7.94,8.5,8.34,9,8.34z"/>
                                        </g>
                                    </svg>
                                    <div className='tooltip'>
                                        إضافة إلي السلة
                                    </div>
                                </button>
                            </form>

                            <div className='space-10'></div>

                            {arrangement === true ? (
                                <div className='uspace-10'></div>
                            ) : (
                                <div className='solid-v-2'></div>
                            )}
                            <div className='space-10'></div>
                            <form onSubmit={(e) => saveSubmit(service.title, service.id, e)}>
                                <button type='submit' className={`icon cans-pd ${service.is_saved ? ' active' : ''}`} id={service.id}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className='icon'>
                                        <rect className='transparent' width="18" height="18" />
                                        <path d="M15.44,0H2.56C1.84,0,1.27,0.58,1.27,1.29v15.42c0,1.07,1.23,1.67,2.08,1.02l4.87-3.76c0.46-0.36,1.11-0.36,1.58,0
            l4.87,3.76c0.85,0.66,2.08,0.05,2.08-1.02V1.29C16.73,0.58,16.16,0,15.44,0z M14.74,3.67c0,0.6-0.49,1.09-1.09,1.09H4.36
            c-0.6,0-1.09-0.49-1.09-1.09V3.35c0-0.6,0.49-1.09,1.09-1.09h9.28c0.6,0,1.09,0.49,1.09,1.09V3.67z"/>

                                    </svg>
                                    <div className='tooltip'>
                                        حفظ
                                    </div>
                                </button>
                            </form>
                            {/* <div className='space-10'></div>
                                    <div className='solid-v-2'></div>
                                    <div className='space-10'></div>
                                    <button type='button' className='icon cans-pd' title='إبلاغ'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className='icon'>
                                            <rect className="transparent" width="18" height="18" />
                                            <path d="M17.25,1.34c-0.31-0.19-0.69-0.2-1.01-0.03c-0.04,0.02-4.5,2.26-6.5,0.19h0C6.7-1.63,1.29,1.06,0.83,1.3
	C0.76,1.33,0.7,1.37,0.64,1.42C0.59,1.46,0.54,1.5,0.51,1.55C0.35,1.73,0.26,1.96,0.26,2.22c0,0,0,0,0,0s0,0,0,0s0,0,0,0v14.75
	c0,0.57,0.46,1.03,1.03,1.03s1.03-0.46,1.03-1.03v-4.11c1.28-0.52,4.4-1.55,5.95,0.05c3.05,3.15,8.68,0.32,8.92,0.2
	c0.34-0.18,0.56-0.53,0.56-0.92V2.22C17.74,1.86,17.56,1.53,17.25,1.34z"/>
                                        </svg>
                                    </button> */}
                        </div>
                    ) : ''
                    }
                </div>
            ))}
        </div>

    );
}
