
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


import headerApp from './appComp/header.js';
import footerApp from './appComp/footer.js';

export default function Home() {
    const [services, setServices] = useState([]);
    const [sections, setSections] = useState([]);

    const [ratings, setRatings] = useState([]);

    const [arrangement, setarrangement] = useState(false);


    const getCookie = (name) => {
        const cookies = document.cookie.split('; ');
        for (let i = 0; i < cookies.length; i++) {
            const [key, value] = cookies[i].split('=');
            if (key === name) return decodeURIComponent(value);
        }
        return null;
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(number);
    };

    useEffect(() => {
        document.title = `${process.env.REACT_APP_NAME} | قطع غيار السيارات`;

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

        axios.get(`${process.env.REACT_APP_API_URL}/api/response?type=home.sections`)
            .then((response) => {
                setSections(response.data.sections);
            })
            .catch((error) => {
                console.error('Error fetching services:', error);
            });

        axios.get(`${process.env.REACT_APP_API_URL}/api/response?type=home.bestSelling`)
            .then((response) => {
                setServices(response.data.products);
            })
            .catch((error) => {
                console.error('Error fetching services:', error);
            });
    }, []);



    return <div>
        {headerApp()}
        <div className="list">

            <div className=' p-0 m-0'>
                <div>
                    <div className='flex h-screen justify-center'>
                        <div className='w-[calc(100%-16px)] h-[calc(100%-52px)] flex items-center justify-center rounded-xl ' >
                            <div className='space-y-12'>
                                <div className='grid w-full items-center text-center justify-center space-y-6'>

                                    <div className='flex justify-center'>

                                        <svg xmlns="http://www.w3.org/2000/svg" width="74px" height="14.52px" viewBox="0 0 74 14.52">
                                            <rect class="fill-transparent" width="74" height="14.52" />


                                            <path class="fill-pri stroke-pri stroke-[2px]" d="M49.17,13.52h-4.52c-2.21,0-4-1.79-4-4V5c0-2.21,1.79-4,4-4h4.52c2.21,0,4,1.79,4,4v4.52
	C53.17,11.73,51.38,13.52,49.17,13.52z"/>
                                            <path class="fill-transparent stroke-sec stroke-[2px]" d="M29.35,13.52h-4.52c-2.21,0-4-1.79-4-4V5c0-2.21,1.79-4,4-4h4.52c2.21,0,4,1.79,4,4v4.52
	C33.35,11.73,31.56,13.52,29.35,13.52z M13.52,9.52V5c0-2.21-1.79-4-4-4H5C2.79,1,1,2.79,1,5v4.52c0,2.21,1.79,4,4,4h4.52
	C11.73,13.52,13.52,11.73,13.52,9.52z M73,9.52V5c0-2.21-1.79-4-4-4h-4.52c-2.21,0-4,1.79-4,4v4.52c0,2.21,1.79,4,4,4H69
	C71.21,13.52,73,11.73,73,9.52z"/>

                                        </svg>
                                    </div>

                                    <div className='text-2xl font-semibold'>
                                        يرجى اختيار القسم المناسب.
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 md:grid-cols-4 gap-6 justify-center px-6'>

                                    {sections.map((section) => (
                                        <div className='grid space-y-3'>
                                            <div className='relative h-[168px] min-w-[168px] group'>

                                                <Link to={`/product/asd`} className='preventDefault group rounded-3xl'>
                                                    <div class="absolute transition duration-100 h-[168px] min-w-[168px] left-0 top-0 inset-0 rounded-3xl group-hover:blur-sm opacity-70 -z-10 bg-gradient-to-t from-pri to-pri"></div>

                                                    <img src={`/img/${section.img}.jpg`} className=' h-[168px] min-w-[168px] rounded-3xl transition all duration-100 shadow-[0_0_0_2px_rgba(2,0,3,0.1)] group-hover:shadow-[0_0_0_2px_rgba(204,0,35,1)]'></img>
                                                </Link>
                                            </div>
                                            <div className='flex items-center justify-between'>
                                                <span className='text-sm font-semibold'>{section.name}</span>
                                                <span className='flex items-center text-xs font-normal h-[24px] px-3 rounded-full text-white bg-pri'>{section.total_types} فئات</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className='layoutHome-bestSelling py-3'>
                <div className='flex'>
                    <Link to={'/shop'} className='text-xl mx-5 font-semibold text-sec flex items-center text-nowrap flex space-x-1 space-x-reverse'><span>الأكثر مبيعاً لدينا</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" class="fill-sec"><rect class="transparent" width="16" height="16"></rect><path d="M12.24,14.05c0.45,0.45,0.45,1.17,0,1.62C12.01,15.89,11.72,16,11.43,16c-0.29,0-0.58-0.11-0.81-0.33L3.76,8.81
 c-0.45-0.45-0.45-1.17,0-1.62l6.86-6.86c0.45-0.45,1.17-0.45,1.62,0c0.45,0.45,0.45,1.17,0,1.62L6.19,8L12.24,14.05z"></path></svg>

                    </Link>
                </div>
                <div className={`layoutDisplay`}>
                    <div className='layoutDisplay-products'>
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
                                            <div className='text-pri text-xs font-semibold space-x-1 space-x-reverse'><span>{service.section_name}</span><span className='text-[8px] text-sec/70'>•</span><span>{service.type_name}</span></div>
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
                                                        <div className='font-normal text-sec text-xs'>{formatNumber(service.price)} ج.م
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

            {/* <div className='layoutHome-bestSelling'>
                <div className='text-2xl mx-5 font-normal text-sec'>الماركات الحالية لدينا</div>
                <div className={`layoutDisplay`}>
                    <div className='layoutDisplay-brands'>
                        <div className='flex min-w-[192px] p-[32px] rounded-3xl shadow-[0_0_0_2px_inset_rgba(2,0,3,0.1)]'>
                            <div>
                                <div className='brandCenter'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="64px" height="64px" viewBox="0 0 64 64" class="fill-sec/50">
                                        <path d="M46.88,3.6C42.4,1.28,37.36,0,32,0S21.6,1.28,17.12,3.6l0,0C6.96,8.96,0,19.68,0,32s6.96,23.04,17.2,28.4
	C21.6,62.64,26.64,64,32,64s10.32-1.36,14.8-3.68C57.04,55.04,64,44.32,64,32S57.04,8.96,46.88,3.6z M3.2,32
	c0-10.48,5.6-19.6,14-24.72l0,0c4.08-2.48,8.8-3.92,14-4.08l-3.6,26.16l-10.4,8.08l0,0L6.64,45.68C4.48,41.6,3.2,36.96,3.2,32z
	 M46.88,56.64c-4.4,2.64-9.44,4.16-14.88,4.16s-10.56-1.52-14.88-4.16C13.2,54.32,10,51.12,7.6,47.28l9.52-3.92l0,0L32,37.28
	l14.88,6l0,0l9.6,3.92C54.08,51.12,50.72,54.32,46.88,56.64z M46.88,37.44L46.88,37.44l-10.32-8L32.88,3.2
	c5.04,0.16,9.84,1.6,13.92,4.08l0,0c8.4,5.04,14,14.24,14,24.72c0,4.96-1.2,9.6-3.44,13.68L46.88,37.44z"/>
                                    </svg>
                                </div>
                                <div className='dspace-20'></div>
                                <div className='layoutDisplay-brandText'>Mercedes-Benz</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
        {footerApp()}
    </div>
}