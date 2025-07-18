import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import headerApp from './appComp/header.js';
import footerApp from './appComp/footer.js';
import { motion } from 'framer-motion';


export default function Product() {
    const [services, setServices] = useState([]);
    const { name_product } = useParams();
    const [saveDisabled, setsaveDisable] = useState(false);

    useState(() => {
    }, []);

    const [service, setService] = useState([]);

    const getCookie = (name) => {
        const cookies = document.cookie.split('; ');
        for (let i = 0; i < cookies.length; i++) {
            const [key, value] = cookies[i].split('=');
            if (key === name) return decodeURIComponent(value);
        }
        return null;
    };

    const formatNumber = (t, number) => {
        if (t === 0) {
            return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(number);
        }
        if (t === 1) {
            return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(number);
        }
    };

    const saveSubmit = async (target, id, e) => {
        e.preventDefault(); // منع إعادة تحميل الصفحة
        setsaveDisable(!saveDisabled);

        try {
            // إرسال البيانات إلى خادم API
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/action?type=save&target=${target}&client_id=${getCookie('client_id')}&id=${id}&at=${getCookie('at')}&ky=${getCookie('at')}`, {
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
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/post`, {
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


    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/product?q=${name_product}`)
            .then((response) => {
                document.title = response.data.message[0].t + ' | Urensh';

                console.log(response.data.message[0]);
                setService(response.data.message[0]);


                // setKeywords(response.data.keywords);
            })
            .catch((error) => {
                console.error('Error fetching services:', error);
            });



        const carousel = document.querySelector('.layoutDisplay-products');
        const productClickers = document.querySelectorAll('.product-title');

        let isMouseDown = false;
        let isTouchActive = false;
        let startX;
        let scrollLeft;
        let isProductClicked = false;
        let velocity = 0;
        let animationFrame;
        productClickers.forEach((productClicker) => {
            productClicker.addEventListener('mousedown', () => {
                isProductClicked = true;
            });
            productClicker.addEventListener('mouseup', () => {

                isProductClicked = false;
            });
            productClicker.addEventListener('mouseleave', () => {
                isProductClicked = false;
            });

            productClicker.addEventListener('touchstart', () => {
                isProductClicked = true;
            });
            productClicker.addEventListener('touchend', () => {
                isProductClicked = false;
            });
        });
        carousel.addEventListener('mousedown', (e) => {
            if (!isProductClicked) {
                velocity = 0;
                cancelAnimationFrame(animationFrame);
                isMouseDown = true;
                carousel.classList.add('active');
                startX = e.pageX;
                scrollLeft = carousel.scrollLeft;
            } else {
                isMouseDown = false;
            }
        });

        carousel.addEventListener('mouseleave', () => {
            if (isMouseDown) {
                carousel.classList.remove('active');
                isMouseDown = false;
            }
        });

        carousel.addEventListener('mouseup', () => {
            if (isMouseDown) {
                carousel.classList.remove('active');
                isMouseDown = false;
                startInertia();
            }
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            e.preventDefault();

            const x = e.pageX;
            const walk = (x - startX);
            velocity = walk;
            startX = x;
            scrollLeft = carousel.scrollLeft;

            carousel.scrollLeft = scrollLeft - walk;
        });

        carousel.addEventListener('touchstart', (e) => {
            if (!isProductClicked) {
                cancelAnimationFrame(animationFrame);
                isTouchActive = true;
                carousel.classList.add('active');
                startX = e.touches[0].pageX;
                scrollLeft = carousel.scrollLeft;
            } else {
                isTouchActive = false;
            }
        });

        carousel.addEventListener('touchend', () => {
            if (isTouchActive) {
                carousel.classList.remove('active');
                isTouchActive = false;
                startInertia();
            }
        });

        carousel.addEventListener('touchmove', (e) => {
            if (!isTouchActive) return;
            e.preventDefault();

            const x = e.touches[0].pageX;
            const walk = (x - startX);
            velocity = walk;
            startX = x;
            scrollLeft = carousel.scrollLeft;

            carousel.scrollLeft = scrollLeft - walk;
        });

        // تأثير القصور الذاتي (Inertia)
        function startInertia() {
            cancelAnimationFrame(animationFrame); // إلغاء أي طلب سابق لـ animation frame

            const inertia = () => {
                if (Math.abs(velocity) > 0.1) { // إذا كانت السرعة كبيرة enough
                    carousel.scrollLeft -= velocity; // تحديث موضع التمرير بناءً على السرعة
                    velocity *= 0.95; // تقليل السرعة تدريجيًا (التخميد)
                    animationFrame = requestAnimationFrame(inertia); // استمرار التأثير
                } else {
                    velocity = 0; // إيقاف التأثير عندما تصبح السرعة صغيرة
                }
            };

            animationFrame = requestAnimationFrame(inertia); // بدء التأثير
        }

        axios.get(`${process.env.REACT_APP_API_URL}/api/response?type=home.bestSelling`)
            .then((response) => {
                setServices(response.data.products);
            })
            .catch((error) => {
                console.error('Error fetching services:', error);
            });
    }, []);


    const ratings = {
        5: service?.st_5 || 0,
        4: service?.st_4 || 0,
        3: service?.st_3 || 0,
        2: service?.st_2 || 0,
        1: service?.st_1 || 0,
    };
    const total = service?.total_ratings || 0;

    const getWidth = (count) => {
        if (total === 0) return '0%';
        const percent = (count / total) * 100;
        return `${percent}%`;
    };

    return <div>
        {headerApp()}
        <div className='productCenter'>
            <div className='flex justify-center items-center h-screen w-full space-x-12 space-x-reverse'>
                <div className='GalleryProduct space-y-8'>
                    <div className='text-2xl text-sec font-semibold'>{service.t}</div>

                    <div className='relative flex justify-center w-[600px] h-[380px] shadow-[0_0_0_2px_rgba(2,0,3,.1)] rounded-2xl'>
                        <img src={`/img/${service.i}.jpg`} className='layoutProduct-image' />
                    </div>
                    <div className='LayoutProduct-gallery'>
                        <div className='LayoutProduct-collect'>
                            <img src={`/img/${service.i}.jpg`} className='layoutProduct-image' />
                        </div>
                    </div>
                </div>
                <div className='LayoutProduct-info'>
                    <div>
                        <div className='grid text-base'>
                            <span className='text-sec/70'>
                                السعر
                            </span>

                            <span className='text-sec text-xl font-semibold'>
                                {formatNumber(0, service.p)} ج.م
                            </span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <div className='dspace-20'></div>
        <div className='flex h-center c-center'>
            <div>
                <div className='flex items-center justify-center text-2xl font-semibold space-x-2 space-x-reverse'>
                    <span className='flex items-center space-x-2 space-x-reverse'>
                        <span>{service.total_ratings ? (service.average_rating).toFixed(2) : ('0.0')}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className={`fill-sec`}>
                            <rect className="transparent" width="18" height="18" />
                            <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
	c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
	c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
	c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                        </svg>
                    </span>
                    <span className='text-xl text-sec font-normal'>•</span>
                    <span>
                        {service.total_ratings ? formatNumber(1, service.total_ratings) : '0'} مراجعة
                    </span>
                </div>
            </div>
            <div className='space-40'></div>
            <div>

                <div className='productCenter-ratingsProgress'>
                    {!service ? (
                        <p></p>
                    ) : (
                        <div className='productCenter-ratingsProgress'>
                            {[5, 4, 3, 2, 1].map((star) => (
                                <div key={star} className='flex items-center'>
                                    <span className='text-xs text-sec font-normal w-4'>{star}</span>
                                    <div className='w-[150px] h-[4px] bg-sec/10 rounded-full'>
                                        <div
                                            className='h-[4px] bg-sec rounded-full transition-all duration-300'
                                            style={{ width: getWidth(ratings[star]) }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
        {/* <div className='productCenter-Comments'>
            <div className='productCenter-Comment'>
                <div className='productCenter-'>

                </div>
            </div>
        </div> */}

        <div className='layoutHome-bestSelling'>
            <div className='layoutDisplay-text'>منتجات مشابهة<div className='uspace-10'></div><Link to={'/shop'} className='layoutDisplay-btn'>عرض الكل<div className='space-10'></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" class="icon-color"><rect class="transparent" width="16" height="16"></rect><path d="M12.24,14.05c0.45,0.45,0.45,1.17,0,1.62C12.01,15.89,11.72,16,11.43,16c-0.29,0-0.58-0.11-0.81-0.33L3.76,8.81
 c-0.45-0.45-0.45-1.17,0-1.62l6.86-6.86c0.45-0.45,1.17-0.45,1.62,0c0.45,0.45,0.45,1.17,0,1.62L6.19,8L12.24,14.05z"></path></svg>

            </Link></div>
            <div className={`layoutDisplay`}>
                <div className='layoutDisplay-products'>
                    {services.map((service) => (
                        <div className='p-2'>
                            <div className='flwd space-y-2'>
                                <div className='flex fwid h-center'>
                                    <Link to={`/product/${service.title}`} className='preventDefault group rounded-3xl'>
                                        <img src={`/img/${service.image}.jpg`} className=' h-[168px] min-w-[168px] rounded-3xl transition all duration-100 shadow-[0_0_0_2px_rgba(2,0,3,0.1)] group-hover:shadow-[0_0_0_4px_rgba(2,0,3,0.1)]'></img>
                                    </Link>
                                </div>

                                <div className='product-disc space-y-1'>
                                    <div className='flex'>
                                        <div className='text-sec text-sm font-semibold'>{service.title}</div>
                                    </div>
                                    <div className='flex'>
                                        <div className='text-pri text-[14px] font-normal'>{service.type_name}</div>
                                    </div>
                                    <div className='flex'>
                                        <div>
                                            <div className='LayoutProduct-rating flex items-center space-x-1'>
                                                <div className='flex items-center space-x-1 space-x-reverse'>
                                                    <div className='text-xs'>{service.total_ratings ? (service.average_rating) : ('0.0')} </div>
                                                    <div className='relative top-[-2px]'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 0.99 ? ('icon-ratingAct fill-sec') : ('icon-rating fill-sec/50')) : ('icon-rating')}>
                                                            <rect className="transparent" width="18" height="18" />
                                                            <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
    c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
    c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
    c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                                                        </svg>
                                                    </div>

                                                    {/* <div className='absolute mx-6 top-[3px]'>

                                                            <svg xmlns="http://www.w3.org/2000/svg" width="6px" height="6px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 1.99 ? ('icon-ratingAct') : ('icon-rating')) : ('icon-rating')}>
                                                                <rect className="transparent" width="18" height="18" />
                                                                <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
    c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
    c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
    c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                                                            </svg>
                                                        </div>

                                                        <div className='absolute mx-5 top-[10px]'>

                                                            <svg xmlns="http://www.w3.org/2000/svg" width="6px" height="6px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 2.99 ? ('icon-ratingAct') : ('icon-rating')) : ('icon-rating')}>
                                                                <rect className="transparent" width="18" height="18" />
                                                                <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
    c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
    c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
    c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                                                            </svg>
                                                        </div>
                                                        <div className='absolute mx-1 top-[10px]'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="6px" height="6px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 3.99 ? ('icon-ratingAct') : ('icon-rating')) : ('icon-rating')}>
                                                                <rect className="transparent" width="18" height="18" />
                                                                <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
    c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
    c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
    c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                                                            </svg>
                                                        </div>
                                                        <div className='absolute top-[3px]'>

                                                            <svg xmlns="http://www.w3.org/2000/svg" width="6px" height="6px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 4.99 ? ('icon-ratingAct') : ('icon-rating')) : ('icon-rating')}>
                                                                <rect className="transparent" width="18" height="18" />
                                                                <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
    c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
    c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
    c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                                                            </svg>
                                                        </div> */}
                                                </div>
                                                <span className='text-sec/50 text-xs'>•</span>
                                                <div className='flex'>
                                                    <div className='font-normal text-sec text-xs'>{formatNumber(0, service.price)} ج.م
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* 
                            <div className='dspace-10'></div>

                            <div className='flex'>
                                <button onClick='' className='product-buy'>شراء الآن</button>
                            </div> */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
        {/* <motion.div className="fixed top-5 right-5 text-white px-4 py-2 rounded-lg z-[999999]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}>
            <div className='toastNotif-bg'>
                <div className='toastNotif-gd'></div>
                <div className='toastNotif-content'>
                    <div className='progress-icon'>
                        <div
                            className="progress-circle success"
                            style={{ "--progress": 60 }}
                        >
                            <svg width="38" height="38" viewBox="0 0 38 38">
                                <circle className="background" cx="19" cy="19" r="15"></circle>
                                <circle className="progress" cx="19" cy="19" r="15"></circle>
                            </svg>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" className='icon-toast success'>
                            <rect className="transparent" width="24" height="24" />
                            <path d="M10.33,16.33c-0.26,0-0.51-0.1-0.71-0.29l-3.33-3.33c-0.39-0.39-0.39-1.02,0-1.41s1.02-0.39,1.41,0l2.63,2.63
	l5.96-5.96c0.39-0.39,1.02-0.39,1.41,0s0.39,1.02,0,1.41l-6.67,6.67C10.85,16.24,10.59,16.33,10.33,16.33z"/>
                        </svg>
                    </div>
                    <div className='space-20'></div>
                    <div>
                        <div className='toastNotif-bigText'>ناجح</div>
                        <div className='toastNotif-smailText'>تم إضافة المنتج إلي السلة.</div>

                    </div>
                </div>

            </div>

        </motion.div> */}
        {footerApp()}
    </div>;
}