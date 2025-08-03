import React, { useState, useRef, useEffect } from 'react';
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


    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const [current, setCurrent] = useState(0);
    const sections = [
        { id: 'preview', title: 'معاينة', content: <HomeContent /> },
        { id: 'about', title: 'التقييمات والمراجعات', content: <AboutContent /> },
        { id: 'contact', title: 'منتجات مشابهة', content: <ContactContent /> },
    ];


    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/product?q=${name_product}`)
            .then((response) => {
                document.title = `${response.data.message[0].t} | ${process.env.REACT_APP_NAME}`;

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

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.find((e) => e.isIntersecting);
                if (visible) {
                    const index = sections.findIndex((s) => s.id === visible.target.id);
                    setCurrent(index);
                }
            },
            { threshold: 0.6 }
        );

        sections.forEach((section) => {
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
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

    function HomeContent() {
        return <>
            {!services.length ? (
                <div className='flex items-center justify-center min-h-[52px]'>
                    <div class="spinner"></div>
                </div>
            ) : (
                <div className='flex justify-center w-full space-x-12 space-x-reverse'>
                    <div className='GalleryProduct space-y-6'>
                        <div className='relative grid mb-6 space-y-4'>
                            <span className='text-3xl text-sec font-semibold'>{service.t}</span >
                            <div className='flex'>
                                <div className='text-sec text-xs font-normal space-x-1 space-x-reverse'><Link to={``} className='hover:text-pri hover:underline'>{service.section_name}</Link><span className='text-sec'>›</span><Link to={``} className='hover:text-pri hover:underline'>{service.type_name}</Link></div>
                            </div>
                        </div >
                        <div className='relative flex justify-between w-full space-x-6 space-x-reverse'>

                            <div className='select-none relative space-y-3 min-w-[calc(100vh-218px)]'>
                                <div className={`relative flex justify-center bg-sec04 min-w-[calc(100vh-218px)] h-[calc(100vh-268px)] rounded-2xl`}>
                                    <div className={`relative rounded-xl`}>
                                        <img src={`/img/${service.i}.png`} className='layoutProduct-image rounded-3xl' />
                                    </div>
                                </div>
                                <div className='relative flex items-center justify-center h-[48px] space-x-3 space-x-reverse'>
                                    <div className={`relative h-[38px] bg-sec04 w-[38px] before:content-[''] before:pointer-events-none before:absolute before:left-0 before:top-0 before:w-full before:h-full before:rounded-lg before:shadow-[0_0_0_2px_rgba(204,0,35,1)] rounded-lg`}>
                                        <img src={`/img/${service.i}.png`} className='h-[38px] w-[38px] rounded-lg scale-[.9]' />
                                    </div>
                                    <div className={`relative h-[38px] w-[38px] bg-sec04 before:content-[''] before:pointer-events-none before:absolute before:left-0 before:top-0 before:w-full before:h-full before:rounded-lg before:shadow-[0_0_0_1px_rgba(2,0,3,.1)] rounded-lg`}>
                                        <img src={`/img/${service.i}.png`} className='h-[38px] w-[38px] rounded-lg scale-[.9]' />
                                    </div>
                                </div>

                            </div>
                            <div>
                                <div className={`relative min-w-[368px] space-y-6 p-6 rounded-2xl before:content-[''] before:pointer-events-none before:absolute before:left-0 before:top-0 before:w-full before:h-full before:rounded-2xl before:shadow-[0_0_0_1px_rgba(2,0,3,.1)]`}>
                                    <div className='relative flex flex-col space-y-3'>
                                        <span className='text-xs text-pri font-semibold'>
                                            السعر
                                        </span>
                                        <span className='text-sec text-xl font-normal'>
                                            <span>
                                                {formatNumber(0, service.p)}
                                            </span>
                                            <span className='text-xs font-semibold'>
                                                ج.م
                                            </span>
                                        </span>

                                    </div>
                                    <div>
                                        <button onClick={(event) => (basketSubmet(service.title, service.product_id, event))} className='flex items-center justify-center w-full h-[48px] rounded-full transition duration-150 bg-sec hover:bg-sec/90 active:scale-[.98] active:bg-sec/95 space-x-2 space-x-reverse'>
                                            <span className='text-sm font-semibold text-white'>إضافة للسلة</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" className="fill-transparent stroke-[2px] stroke-white group-hover:stroke-sec/70">
                                                <rect class="fill-transparent stroke-transparent" width="24" height="24" />
                                                <path d="M18.45,23H5.55c-1.11,0-2.06-0.78-2.27-1.86l-1.86-9.28c-0.29-1.44,0.81-2.77,2.27-2.77h16.61
	c1.46,0,2.56,1.34,2.27,2.77l-1.86,9.28C20.51,22.22,19.56,23,18.45,23z M5.04,5.04h13.92 M7.36,1h9.28"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <div className='w-full h-[1px] bg-sec08'></div>
                                    <div className='relative flex flex-col space-y-3 text-sec'>
                                        <span className='text-xs text-pri font-semibold'>
                                            تفاصيل المنتج
                                        </span>
                                        <div className='flex flex-col space-y-3 text-xs'>
                                            <div className='flex relative space-x-1 space-x-reverse'>
                                                <span className='font-light'>الماركة</span>
                                                <span className='font-semibold'>{service.mn}</span>
                                            </div>
                                            <div className='flex relative space-x-1 space-x-reverse'>
                                                <span className='font-light'>الموديل</span>
                                                <span className='font-semibold'>{service.mln}</span>
                                            </div>
                                            <div className='flex relative space-x-1 space-x-reverse'>
                                                <span className='font-light'>الكمية المتاحة في المخزن</span>
                                                <span className='font-semibold'>{service.q} قطعة</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
            )
            }
        </>;
    }

    function AboutContent() {
        return <>
            <div className='flex space-x-16 space-x-reverse'>
                <div>
                    <span className='text-[12px] font-semibold text-sec'>({service.total_ratings}) المراجعات</span>

                    {true && (
                        <div className='relative py-3'>
                            <div className='relative flex flex-col space-y-4'>
                                <div className='flex space-x-2 space-x-reverse'>
                                    <div className='select-none bg-pri min-w-[38px] h-[38px] rounded-full text-white font-semibold text-xs flex justify-center items-center'>ع</div>
                                    <div className='flex flex-col space-y-1'>
                                        <span className='text-sec font-semibold text-base'>عبد الرحمن احمد</span>
                                        <div className='flex items-center'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="10px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 0.99 ? ('icon-ratingAct fill-pri') : ('icon-rating fill-sec/50')) : ('icon-rating')}>
                                                <rect className="transparent" width="18" height="18" />
                                                <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
    c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
    c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
    c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                                            </svg>

                                            <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="10px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 0.99 ? ('icon-ratingAct fill-pri') : ('icon-rating fill-sec/50')) : ('icon-rating')}>
                                                <rect className="transparent" width="18" height="18" />
                                                <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
    c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
    c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
    c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="10px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 0.99 ? ('icon-ratingAct fill-pri') : ('icon-rating fill-sec/50')) : ('icon-rating')}>
                                                <rect className="transparent" width="18" height="18" />
                                                <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
    c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
    c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
    c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="10px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 0.99 ? ('icon-ratingAct fill-pri') : ('icon-rating fill-sec/50')) : ('icon-rating')}>
                                                <rect className="transparent" width="18" height="18" />
                                                <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
    c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
    c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
    c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="10px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 0.99 ? ('icon-ratingAct fill-pri') : ('icon-rating fill-sec/50')) : ('icon-rating')}>
                                                <rect className="transparent" width="18" height="18" />
                                                <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
    c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
    c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
    c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex space-x-2 space-x-reverse'>
                                    <span className='text-base text-sec font-normal'>
                                        ممتاز بجد شكراً
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                    }
                </div>
                <div >
                    <div className='space-y-4 mb-3'>
                        <div className='flex text-2xl font-semibold space-x-2 space-x-reverse'>
                            <span className='flex items-center space-x-2 space-x-reverse'>
                                <span className='text-3xl text-sec font-semibold'>{service.total_ratings ? Number(service.average_rating).toFixed(2) : ('0.0')}</span>
                            </span>
                        </div>
                        <div className='flex items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 0.99 ? ('icon-ratingAct fill-sec') : ('icon-rating fill-sec/50')) : ('icon-rating')}>
                                <rect className="transparent" width="18" height="18" />
                                <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
    c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
    c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
    c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                            </svg>

                            <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 0.99 ? ('icon-ratingAct fill-sec') : ('icon-rating fill-sec/50')) : ('icon-rating')}>
                                <rect className="transparent" width="18" height="18" />
                                <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
    c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
    c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
    c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 0.99 ? ('icon-ratingAct fill-sec') : ('icon-rating fill-sec/50')) : ('icon-rating')}>
                                <rect className="transparent" width="18" height="18" />
                                <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
    c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
    c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
    c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 0.99 ? ('icon-ratingAct fill-sec') : ('icon-rating fill-sec/50')) : ('icon-rating')}>
                                <rect className="transparent" width="18" height="18" />
                                <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
    c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
    c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
    c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 0 18 18" className={service.total_ratings ? (service.average_rating > 0.99 ? ('icon-ratingAct fill-sec') : ('icon-rating fill-sec/50')) : ('icon-rating')}>
                                <rect className="transparent" width="18" height="18" />
                                <path d="M10.2,2.2l1.02,3.15c0.17,0.52,0.65,0.87,1.2,0.87h3.31c1.22,0,1.73,1.57,0.74,2.28l-2.68,1.95
    c-0.44,0.32-0.63,0.89-0.46,1.41l1.02,3.15c0.38,1.16-0.95,2.13-1.94,1.41l-2.68-1.95c-0.44-0.32-1.04-0.32-1.48,0l-2.68,1.95
    c-0.99,0.72-2.32-0.25-1.94-1.41l1.02-3.15c0.17-0.52-0.02-1.09-0.46-1.41L1.52,8.51C0.53,7.79,1.04,6.22,2.27,6.22h3.31
    c0.55,0,1.03-0.35,1.2-0.87L7.8,2.2C8.18,1.04,9.82,1.04,10.2,2.2z"/>
                            </svg>
                        </div>
                    </div>
                    <div className='space-40'></div>
                    <div>

                        <div className='productCenter-ratingsProgress'>
                            {!service ? (
                                <p></p>
                            ) : (
                                <div className='productCenter-ratingsProgress space-y-2'>
                                    <span className='text-[12px] font-semibold text-sec'>التقييم العام</span>
                                    <div>
                                        {[5, 4, 3, 2, 1].map((star) => (
                                            <div key={star} className='flex items-center'>
                                                <span className='text-xs text-sec font-normal w-4'>{star}</span>
                                                <div className='w-[128px] h-[4px] bg-sec/10 rounded-full'>
                                                    <div
                                                        className='h-[4px] bg-sec rounded-full transition-all duration-300'
                                                        style={{ width: getWidth(ratings[star]) }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>;
    }

    function ContactContent() {
        return <>
            <div>
                <div className='flex'>
                    <Link to={'/shop'} className='text-xl mx-5 font-semibold text-sec flex items-center text-nowrap flex space-x-1 space-x-reverse'><span>منتجات مشابهة</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" class="fill-sec"><rect class="transparent" width="16" height="16"></rect><path d="M12.24,14.05c0.45,0.45,0.45,1.17,0,1.62C12.01,15.89,11.72,16,11.43,16c-0.29,0-0.58-0.11-0.81-0.33L3.76,8.81
 c-0.45-0.45-0.45-1.17,0-1.62l6.86-6.86c0.45-0.45,1.17-0.45,1.62,0c0.45,0.45,0.45,1.17,0,1.62L6.19,8L12.24,14.05z"></path></svg>

                    </Link>
                </div>
                <div className={`layoutDisplay`}>
                    <div className='relative w-screen layoutDisplay-products'>
                        {services.map((service) => (
                            <div className='p-2'>
                                <div className='flwd space-y-2'>
                                    <div className='flex fwid h-center'>
                                        <div className='relative h-[168px] min-w-[168px] group'>
                                            <Link to={`/product/${service.title}`} className='preventDefault group rounded-3xl'>
                                                <div class="absolute transition duration-100 h-[168px] min-w-[168px] left-0 top-0 inset-0 rounded-3xl group-hover:blur-sm opacity-70 -z-10 bg-gradient-to-t from-pri to-pri"></div>

                                                <img src={`/img/${service.image}.jpg`} className=' h-[168px] min-w-[168px] rounded-3xl transition all duration-100 shadow-[0_0_0_2px_rgba(2,0,3,0.1)] group-hover:shadow-[0_0_0_2px_rgba(204,0,35,1)]'></img>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className='product-disc space-y-1'>
                                        <div className='flex'>
                                            <div className='text-sec text-sm font-semibold'>{service.title}</div>
                                        </div>
                                        <div className='flex'>
                                            <div className='text-pri text-xs font-semibold space-x-1 space-x-reverse'><span>{service.section_name}</span><span className='text-sec'>/</span><span>{service.type_name}</span></div>
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
        </>;
    }

    return <div>
        {headerApp()}
        <div className='h-[calc(100vh-64px)] overflow-y-auto hide-scrollbar snap-y snap-mandatory'>

            {/* الأقسام */}
            {sections.map((section) => (
                <section
                    id={section.id}
                    key={section.id}
                    className="h-[calc(100vh-64px)] snap-start flex items-center justify-center"
                >
                    {section.content}
                </section>
            ))}

            {/* مؤشرات */}
            <div className="z-[99] absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-2">
                {sections.map((_, i) => (
                    <div className='flex items-center gap-2 group'>
                        <button
                            key={i}
                            className={`flex items-center px-3 h-[28px] rounded-full transition duration-50 ${current === i ? "bg-sec scale-[1]" : "backdrop-blur-xl bg-sec08 hover:bg-sec/10 scale-[.95]"
                                }`}
                            onClick={() => scrollToSection(_.id)}
                        >
                            <span className={`text-xs font-semibold transition duration-50 ${current === i ? "text-white" : "text-sec"}`}>{_.title}</span>
                        </button>
                    </div>
                ))}
            </div>

            {footerApp()}
        </div>
        {/* <motion.div className="pointer-events-none fixed flex justify-center  top-3 right-0 left-0 text-white px-4 py-2 rounded-lg z-[999999]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}>
            <div className='pointer-events-auto select-none bg-sec/90 backdrop-blur-lg px-3 py-6 rounded-3xl'>
                <div className='flex items-center justify-center px-6 space-x-3 space-x-reverse'>
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
                    <div>
                        <div className='toastNotif-bigText'>ناجح</div>
                        <div className='toastNotif-smailText'>تم إضافة عنصر للسلة</div>

                    </div>
                </div>

            </div>

        </motion.div> */}
    </div>;
}