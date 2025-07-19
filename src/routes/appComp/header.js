import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';



import axios from 'axios';

import { BrowserRouter as Router, Routes, Route, Switch, Link } from 'react-router-dom';
import UserStatus, { toggleMenuAccount } from '../../response/res-auth';
import { menu } from 'framer-motion/client';


function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();

    const differenceInMilliseconds = now - date;
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);
    const differenceInWeeks = Math.floor(differenceInDays / 7);
    const differenceInMonths = Math.floor(differenceInDays / 30); // تقريبي

    const formattedDate = ` ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} • ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

    if (date.getFullYear() === now.getFullYear()) {
        if (differenceInDays === 0) {
            return `اليوم • ${formattedDate}`;
        } else if (differenceInDays === 1) {
            return `البارحة • ${formattedDate}`;
        } else if (differenceInDays === 2) {
            return `منذ يومين • ${formattedDate}`;
        } else if (differenceInDays <= 3) {
            return `منذ ${differenceInDays} أيام • ${formattedDate}`;
        } else if (differenceInWeeks === 1) {
            return `منذ أسبوع • ${formattedDate}`;
        } else if (differenceInWeeks === 2) {
            return `منذ أسبوعين • ${formattedDate}`;
        } else if (differenceInWeeks <= 3) {
            return `منذ ${differenceInWeeks} أسابيع • ${formattedDate}`;
        } else if (differenceInMonths === 1) {
            return `منذ شهر • ${formattedDate}`;
        } else if (differenceInMonths <= 2) {
            return `منذ ${differenceInMonths} أشهر • ${formattedDate}`;
        } else {
            return `في ${formattedDate}`;
        }
    } else {
        return `${formattedDate}`;
    }
}

function animateLine(type, line, x, y, duration) {
    if (type === 0) {
        const startX1 = parseFloat(line.getAttribute("x1"));
        const startY1 = parseFloat(line.getAttribute("y1"));

        const deltaX = x - startX1;
        const deltaY = y - startY1;

        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // تحديث الإحداثيات
            line.setAttribute("x1", startX1 + deltaX * progress);
            line.setAttribute("y1", startY1 + deltaY * progress);

            // استمرار الحركة حتى الاكتمال
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }
    if (type === 1) {
        const startX2 = parseFloat(line.getAttribute("x2"));
        const startY2 = parseFloat(line.getAttribute("y2"));

        const deltaX = x - startX2;
        const deltaY = y - startY2;

        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            line.setAttribute("x2", startX2 + deltaX * progress);
            line.setAttribute("y2", startY2 + deltaY * progress);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }
}

export default function HeaderApp() {


    const [showSearch, setShowSearch] = useState(false);

    const toggleSearch = () => {
        setShowSearch((status) => (status === false ? true : false));
    };


    const handleKeyDown = (event) => {
        console.log(event.key);
        if (event.key == 'F1') {
            event.preventDefault();
            if (showSearch == false) {
                window.open('/help', '_blank');
            }
        }
        if (event.key == 'F2') {
            if (!showSearch) {
                toggleSearch();
            }
        }
    };



    const [basketsProducts, setBasketProducts] = useState([]);
    const [baskets, setBasketData] = useState([]);

    const [showMenuAccount, setMenuAccount] = useState(false);
    const [showBasket, setBasket] = useState(false);
    const [showBuyBasket, setBuyBasket] = useState(false);

    const [showMenus, setMenus] = useState(false);

    const [contextMenu, setContextMenu] = useState({});

    const [selectedProducts, setSelectedProducts] = useState({});

    const [quantitys, setQuantitys] = useState({});


    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(number);
    };


    const setQuantity = (i, n) => {
        setQuantitys((prev) => ({
            ...prev,
            [i]: n,
        }));
    };

    const selectProducts = (i) => {
        setSelectedProducts((prev) => ({
            ...prev,
            [i]: !prev[i],
        }));

        const parentElement = document.getElementsByClassName('basket-product')[i];
        const childElement = parentElement.querySelectorAll('.Line');
        const childElement1 = childElement[0];
        const childElement2 = childElement[1];

        if (selectedProducts[i] != true) {
            animateLine(0, childElement1, 5.67, 12.67, 50);
            animateLine(1, childElement2, 15, 3.33, 50);
        } else {
            animateLine(0, childElement1, 1, 8, 50);
            animateLine(1, childElement2, 5.67, 12.67, 50);
        }
    };

    const resetSelectionOnClose = () => {
        setSelectedProducts((prev) => {
            const resetProducts = Object.keys(prev).reduce((acc, key) => {
                acc[key] = false;
                return acc;
            }, {});
            return resetProducts;
        });
    };


    const processBuyBasket = () => {
        setBuyBasket((status) => (status === false ? true : false));
    };

    const processMenus = () => {
        setMenus((status) => (status === false ? true : false));
    };

    const activateAllSelections = () => {
        resetSelectionOnClose();
        setSelectedProducts((prev) => {
            const updatedProducts = Object.keys(prev).reduce((acc, key) => {
                acc[key] = prev[key] === false ? true : prev[key];

                if (prev[key] === false) {
                    const parentElement = document.getElementsByClassName('basket-product')[key];
                    if (parentElement) {
                        const childElement = parentElement.querySelectorAll('.Line');
                        if (childElement.length >= 2) {
                            const childElement1 = childElement[0];
                            const childElement2 = childElement[1];

                            if (prev[key] !== true) {
                                animateLine(0, childElement1, 5.67, 12.67, 50);
                                animateLine(1, childElement2, 15, 3.33, 50);
                            } else {
                                animateLine(0, childElement1, 1, 8, 50);
                                animateLine(1, childElement2, 5.67, 12.67, 50);
                            }
                        }
                    }
                }

                return acc;
            }, {});
            return updatedProducts;
        });
    };

    const toggleBasket = () => {
        if (!showBasket) {

            axios.get(`${process.env.REACT_APP_API_URL}/api/response?type=basket.products&client_id=${getCookie('client_id')}&at=${getCookie('at')}&ky=${getCookie('ky')} `)
                .then((response) => {
                    console.log(response.data.message.products);
                    if (response.data.message.products.length !== 0) {

                        setSelectedProducts({});
                        setSelectedProducts((prev) => {
                            const newSelectedProducts = { ...prev };
                            const startKey = Object.keys(prev).length;

                            for (let i = 0; i < response.data.message.products.length; i++) {
                                const newKey = startKey + i;
                                newSelectedProducts[newKey] = false;
                            }

                            return newSelectedProducts;
                        });

                        setBasketProducts(response.data.message.products);
                    }

                })
                .catch((error) => {
                    console.error('Error fetching inbox:', error);
                });
        } else {
            resetSelectionOnClose();

        }
        setBasket((status) => (status === false ? true : false));
    };

    const closeBasket = () => {
        if (!showBasket) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
            resetSelectionOnClose();

        }
        setBasket(false);
    };

    const toggleMenuAccount = () => {
        if (!showMenuAccount) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
            resetSelectionOnClose();
        }

        axios.get(`${process.env.REACT_APP_API_URL}/api/inbox?client_id=${getCookie('client_id')}&at=${getCookie('at')}&ky=${getCookie('ky')} `)
            .then((response) => {
                setNotification(response.data.message);

                if (Array.isArray(response.data.message) && response.data.message.length !== 0) {
                    setFoundNotification(true);
                    setTotalInbox(response.data.message.length);
                }

            })
            .catch((error) => {
                console.error('Error fetching inbox:', error);
            });
        setMenuAccount((status) => (status === false ? true : false));
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                setShowNotification((status) => (status === false ? true : false));

                (async () => {
                    const showNotification = () => {
                        const notification = new Notification('صندوق الوارد', {
                            body: 'رسالة جديدة حول "يد التحكم" الذي أبلغتنا عنه',
                            icon: '/img/1.jpg'
                        });

                        setTimeout(() => {
                            notification.close();
                        }, 10 * 1000);

                        notification.addEventListener('click', () => {

                            window.open('/', '_blank');
                        });
                    }

                    const showError = () => {
                        const error = document.querySelector('.error');
                        error.style.display = 'block';
                        error.textContent = 'You blocked the notifications';
                    }

                    let granted = false;

                    if (Notification.permission === 'granted') {
                        granted = true;
                    } else if (Notification.permission !== 'denied') {
                        let permission = await Notification.requestPermission();
                        granted = permission === 'granted' ? true : false;
                    }

                    granted ? showNotification() : showError();

                })();
            }
        });
    };

    function deleteCookie(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    }


    const [showAccountLogout, setAccountLogout] = useState(false);
    const [showNotification, setShowNotification] = useState(true);

    const [showMessages, setShowMessage] = useState(false);


    const AccountLogout = () => {
        setAccountLogout((status) => (status === false ? true : false));
    };

    const ShwMessages = () => {
        setShowMessage((status) => (status === false ? true : false));
    };



    const LogOut = () => {
        deleteCookie('client_id');
        deleteCookie('at');
        deleteCookie('user');
        deleteCookie('ky');
        window.location.href = '/login';
    };

    function requestNotificationPermission() {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                console.log("تم منح الإذن للإشعارات.");
            } else if (permission === "denied") {
                console.log("تم رفض الإذن للإشعارات.");
            } else {
                console.log("الإذن معلق.");
            }
        });
    }

    const getCookie = (name) => {
        const cookies = document.cookie.split('; ');
        for (let i = 0; i < cookies.length; i++) {
            const [key, value] = cookies[i].split('=');
            if (key === name) return decodeURIComponent(value);
        }
        return null;
    };

    const user = JSON.parse(getCookie('user'));
    const data = user != undefined ? user.name : '';


    const [getNotification, setNotification] = useState([]);
    const [totalInbox, setTotalInbox] = useState(0);

    const [FoundNotification, setFoundNotification] = useState(false);

    useEffect(() => {

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [searchEmpty, setSearchEmpty] = useState(true);
    const [searchLoader, setSearchLoader] = useState(false);
    const [searchResults, setSearchResults] = useState(false);
    const [searchnotFound, setSearchNotFound] = useState(false);

    var timer = null;
    const searchChange = async (event) => {
        clearTimeout(timer);
        const query = event.target.value;
        setResults([]);
        setSearchTerm(query);
        setSearchResults(false);
        setSearchNotFound(false);
        setSearchLoader(true);


        if (query.trim() === '') {
            setSearchEmpty(true);
            setSearchLoader(false);
            setSearchResults(false);
            setSearchNotFound(false);
            return;
        }
        setSearchEmpty(false);

        axios.get(`${process.env.REACT_APP_API_URL}/api/search?q=${query}`)
            .then((response) => {
                timer = setTimeout(() => {
                    if (response.data.message.length != 0) {
                        setSearchLoader(false);
                        setSearchResults(true);
                        setResults(response.data.message);
                    } else {
                        setResults([]);
                        setSearchLoader(false);
                        setSearchResults(false);
                        setSearchNotFound(true);
                    }
                }, 200);
            })
            .catch((error) => {
                console.error('Error fetching search:', error);
            });
    };

    const [scrollPercentage, setScrollPercentage] = useState(0);
    const [AutoSolid, setAutoSolid] = useState(false);


    const handleScroll = () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop > 5) {
            setAutoSolid(true);
        } else {
            setAutoSolid(false);
        }
    };

    useEffect(() => {

        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop > 5) {
            setAutoSolid(true);
        }

        window.addEventListener("scroll", handleScroll);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className='header'>
            <div className={`flex justify-between items-center head py-[10px] px-[20px] `}>

                <div className='flex space-x-3 space-x-reverse'>
                    <Link to='/' className='logo h-[24px] min-w-[24px]'>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="70px"
                        height="16px" viewBox="0 0 70 16" className='icon-color'>
                        <g>
                            <path d="M2.13,0.05v9.59c0,1.13,0.21,2.06,0.63,2.81c0.63,1.13,1.68,1.69,3.17,1.69c1.78,0,2.99-0.61,3.63-1.83
		c0.34-0.66,0.52-1.55,0.52-2.67V0.05h2.13v8.71c0,1.91-0.26,3.38-0.77,4.4c-0.94,1.87-2.73,2.81-5.34,2.81s-4.4-0.94-5.33-2.81
		C0.26,12.14,0,10.67,0,8.77V0.05H2.13z"/>
                            <path d="M15.27,4.26h1.81v1.95c0.15-0.38,0.51-0.84,1.09-1.39c0.58-0.55,1.24-0.82,2-0.82c0.04,0,0.1,0,0.18,0.01
		c0.08,0.01,0.23,0.02,0.43,0.04v2.01c-0.11-0.02-0.22-0.03-0.31-0.04c-0.1-0.01-0.2-0.01-0.31-0.01c-0.96,0-1.69,0.31-2.21,0.92
		s-0.77,1.33-0.77,2.13v6.51h-1.9V4.26z"/>
                            <path d="M29.47,4.57c0.75,0.38,1.33,0.86,1.72,1.46c0.38,0.57,0.63,1.24,0.76,2c0.11,0.52,0.17,1.35,0.17,2.49h-8.29
		c0.04,1.15,0.31,2.07,0.81,2.76c0.51,0.69,1.29,1.04,2.35,1.04c0.99,0,1.79-0.33,2.38-0.98c0.34-0.38,0.58-0.82,0.72-1.32h1.87
		c-0.05,0.42-0.21,0.88-0.49,1.39c-0.28,0.51-0.59,0.93-0.93,1.25c-0.58,0.56-1.29,0.94-2.15,1.14c-0.46,0.11-0.97,0.17-1.55,0.17
		c-1.41,0-2.6-0.51-3.58-1.54c-0.98-1.02-1.47-2.46-1.47-4.3c0-1.82,0.49-3.29,1.48-4.43C24.25,4.57,25.54,4,27.13,4
		C27.93,4,28.71,4.19,29.47,4.57z M30.16,9.01c-0.08-0.82-0.26-1.48-0.54-1.98c-0.52-0.92-1.39-1.37-2.61-1.37
		c-0.87,0-1.61,0.31-2.2,0.95c-0.59,0.63-0.9,1.43-0.94,2.4H30.16z"/>
                            <path d="M34.45,4.26h1.81v1.61c0.53-0.66,1.1-1.14,1.7-1.43c0.6-0.29,1.26-0.43,2-0.43c1.6,0,2.69,0.56,3.25,1.68
		c0.31,0.61,0.47,1.49,0.47,2.63v7.26h-1.93V8.44c0-0.69-0.1-1.25-0.31-1.67c-0.34-0.7-0.95-1.06-1.84-1.06
		c-0.45,0-0.82,0.05-1.11,0.14c-0.52,0.15-0.98,0.46-1.37,0.93c-0.32,0.37-0.52,0.76-0.62,1.16c-0.1,0.4-0.14,0.97-0.14,1.7v5.93
		h-1.9V4.26z"/>
                            <path d="M47.61,12.02c0.06,0.63,0.22,1.12,0.48,1.46c0.48,0.61,1.31,0.92,2.49,0.92c0.7,0,1.32-0.15,1.86-0.46
		c0.54-0.31,0.8-0.78,0.8-1.42c0-0.49-0.21-0.86-0.64-1.11c-0.27-0.15-0.82-0.33-1.63-0.54l-1.51-0.38
		c-0.96-0.24-1.67-0.51-2.13-0.8c-0.82-0.51-1.23-1.22-1.23-2.13c0-1.07,0.39-1.94,1.16-2.6c0.77-0.66,1.81-0.99,3.11-0.99
		c1.7,0,2.93,0.5,3.69,1.5c0.47,0.63,0.7,1.32,0.69,2.05h-1.79c-0.04-0.43-0.19-0.82-0.45-1.17c-0.44-0.5-1.19-0.75-2.27-0.75
		c-0.72,0-1.26,0.14-1.63,0.41c-0.37,0.27-0.56,0.64-0.56,1.09c0,0.49,0.24,0.89,0.73,1.18c0.28,0.18,0.7,0.33,1.25,0.46l1.26,0.31
		c1.37,0.33,2.28,0.65,2.74,0.96c0.74,0.49,1.11,1.25,1.11,2.29c0,1.01-0.38,1.88-1.15,2.61c-0.76,0.73-1.93,1.1-3.49,1.1
		c-1.68,0-2.88-0.38-3.58-1.15c-0.7-0.76-1.08-1.71-1.12-2.84H47.61z"/>
                            <path d="M57.29,0h1.9v5.79c0.45-0.57,0.86-0.97,1.21-1.2c0.61-0.4,1.38-0.6,2.29-0.6c1.64,0,2.75,0.57,3.34,1.72
		c0.32,0.63,0.48,1.5,0.48,2.61v7.26h-1.95V8.44c0-0.83-0.11-1.44-0.32-1.83c-0.34-0.62-0.99-0.93-1.94-0.93
		c-0.79,0-1.5,0.27-2.14,0.81c-0.64,0.54-0.96,1.57-0.96,3.07v6h-1.9V0z"/>
                        </g>
                    </svg>
                    <div className='space-10'></div> */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 32 32">
                            <path class="icon-color" d="M32,16c0,7.84-5.64,14.36-13.08,15.73C17.97,31.91,17,32,16,32s-1.97-0.09-2.92-0.27C5.64,30.36,0,23.84,0,16
	C0,7.16,7.16,0,16,0S32,7.16,32,16z"/>
                            <path class="icon-white" d="M24.17,9.4l-4.4-2.55c-0.15-0.09-0.34-0.09-0.5,0c-0.15,0.09-0.25,0.25-0.25,0.43v7.52
	c0,0.18-0.1,0.34-0.25,0.43l-2.56,1.47c-0.15,0.09-0.35,0.09-0.5,0l-2.56-1.47c-0.15-0.09-0.25-0.25-0.25-0.43V7.28
	c0-0.18-0.1-0.34-0.25-0.43c-0.16-0.09-0.35-0.09-0.5,0L7.74,9.4C7.59,9.49,7.49,9.65,7.49,9.83v8.09c0,0.18,0.09,0.34,0.25,0.43
	l4.85,2.81c0.15,0.09,0.25,0.25,0.25,0.43l0,3.9c0,0.18,0.1,0.34,0.25,0.43l2.62,1.5c0.08,0.04,0.16,0.07,0.25,0.07
	s0.17-0.02,0.25-0.07l2.62-1.5c0.16-0.09,0.25-0.25,0.25-0.43v-3.9c0-0.18,0.1-0.34,0.25-0.43l4.85-2.81
	c0.15-0.09,0.25-0.25,0.25-0.43V9.83C24.42,9.65,24.33,9.49,24.17,9.4z"/>

                        </svg>
                    </Link>

                    <button onClick={toggleSearch} className='group'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20" className="fill-transparent">
                            <rect class="fill-transparent" width="20" height="20" />

                            {/* <g id="Iconly/Light-Outline/Search" stroke="none" stroke-width="1.5" fill="none" fill-rule="evenodd">
                                <g id="Search" transform="translate(2.000000, 2.000000)" className='fill-sec group-hover:fill-sec/70'>
                                    <path d="M9.7388,8.8817842e-14 C15.1088,8.8817842e-14 19.4768,4.368 19.4768,9.738 C19.4768,12.2715459 18.5045194,14.5822774 16.9134487,16.3164943 L20.0442,19.4407 C20.3372,19.7337 20.3382,20.2077 20.0452,20.5007 C19.8992,20.6487 19.7062,20.7217 19.5142,20.7217 C19.3232,20.7217 19.1312,20.6487 18.9842,20.5027 L15.8156604,17.3430042 C14.1488713,18.6778412 12.0354764,19.477 9.7388,19.477 C4.3688,19.477 -0.0002,15.108 -0.0002,9.738 C-0.0002,4.368 4.3688,8.8817842e-14 9.7388,8.8817842e-14 Z M9.7388,1.5 C5.1958,1.5 1.4998,5.195 1.4998,9.738 C1.4998,14.281 5.1958,17.977 9.7388,17.977 C14.2808,17.977 17.9768,14.281 17.9768,9.738 C17.9768,5.195 14.2808,1.5 9.7388,1.5 Z" id="Combined-Shape"></path>
                                </g>
                            </g> */}


                            <path className='stroke-[1.5px] stroke-sec group-hover:stroke-sec/70' d="M15.31,8c0,3.87-3.13,7-7,7s-7-3.13-7-7s3.13-7,7-7S15.31,4.13,15.31,8z M12.94,13.25L18.69,19" />

                        </svg>
                        <div className='tooltip'>
                            البحث
                        </div>
                    </button>
                    {showSearch && (
                        <div className={`backdrop ${showSearch === false ? ' hide' : ' show'}`}>
                            <div className='searchList min-w-[480px]'>
                                <div className='searchbox'>
                                    <div className='space-10'></div>
                                    <div className='icon-pin-20'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20">
                                            <path className="icon-head" d="M19,10c0,1.64-0.44,3.18-1.2,4.5c-0.59,1.02-1.37,1.91-2.3,2.63c-0.33,0.25-0.68,0.48-1.04,0.69
C13.14,18.57,11.62,19,10,19c-0.2,0-0.4-0.01-0.6-0.02c-1.39-0.09-2.71-0.5-3.85-1.16c-0.36-0.21-0.71-0.44-1.04-0.69
c-0.93-0.71-1.71-1.6-2.3-2.62C1.44,13.18,1,11.64,1,10c0-4.97,4.03-9,9-9C14.97,1,19,5.03,19,10z M16.36,16.36L19,19"/>
                                        </svg>
                                    </div>
                                    <div className='space-5'></div>
                                    <input className='inp-search' onChange={searchChange} placeholder='بحث عن...' value={searchTerm} autoFocus={showSearch && true}></input>
                                    <div className='space-10'></div>
                                    <div className='solid-v-2'></div>
                                    <div className='space-10'></div>
                                    <button type='button' onClick={toggleSearch} className='icon cans-head icon-pin-20'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon'>
                                            <rect className='transparent' width="16" height="16" />
                                            <path d="M12.95,14.36L8,9.41l-4.95,4.95l-1.41-1.41L6.59,8L1.64,3.05l1.41-1.41L8,6.59l4.95-4.95l1.41,1.41L9.41,8
	l4.95,4.95L12.95,14.36z"/>
                                        </svg>
                                        <div className='tooltip'>
                                            إغلاق البحث
                                        </div>
                                    </button>
                                </div>
                                <div className='solid-h-1'></div>
                                <div className='search-board'>
                                    <div className={`search-guide${searchEmpty === false ? ' hide' : ''}`}>
                                        <div>
                                            <div className='guide'>إختصارات سريعة</div>
                                            <div className='dspace-20'></div>

                                            <div className='guide-content'>
                                                <div className='key-guide'>F2</div>
                                                <div className='space-10'></div>
                                                <div className='solid-v-2'></div>
                                                <div className='space-10'></div>
                                                <div className='text-guide'>إظهار أو إخفاء صندوق البحث</div>
                                            </div>
                                            <div className='dspace-10'></div>
                                            <div className='solid-h-1'></div>
                                            <div className='dspace-10'></div>
                                            <div className='guide-content'>
                                                <div className='key-guide'>TAB</div>
                                                <div className='space-10'></div>
                                                <div className='solid-v-2'></div>
                                                <div className='space-10'></div>
                                                <div className='text-guide'>تحديد عنصر من نتائج البحث</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`search-loading${searchLoader === false ? ' hide' : ' show'}`}><div className="loader"></div></div>
                                    <div className={`search-results${searchResults === false ? ' show' : ' hide'}`}>
                                        {results.map((result) => (
                                            <Link to={`/product/${result.title}`} className='search-result'>
                                                <div className='space-5'></div>
                                                <img className='searchResult-img' src={`/img/${result.image}.jpg`}></img>
                                                <div className='space-20'></div>
                                                <div className='searchResult-content'>
                                                    <div className='searchResult-text'>{result.title}</div>
                                                    <div className='searchResult-texts'>
                                                        <div className='searchResult-quantity'><div className='product-type'>الكمية</div><div className='space-10'></div> {result.quantity}</div>
                                                        <div className='space-20'></div>
                                                        <div className='searchResult-price'><div className='product-type'>السعر</div><div className='space-10'></div>{result.price} ج.م</div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}

                                        <div className={`search-notFound${searchnotFound === false ? ' hide' : ' show'}`}>
                                            <div className='flex'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20" className="icon">
                                                    <rect class="transparent" width="20" height="20" />

                                                    <path d="M18.82,20c-0.3,0-0.6-0.11-0.83-0.34l-1.8-1.8c-0.03,0.02-0.05,0.04-0.08,0.06c-0.36,0.28-0.75,0.53-1.15,0.76
	c-1.69,0.96-3.63,1.39-5.55,1.3c-1.59-0.1-3.07-0.55-4.37-1.3c-0.41-0.24-0.79-0.49-1.14-0.76c-1.04-0.8-1.9-1.78-2.56-2.92
	C0.46,13.49,0,11.76,0,10C0,4.49,4.49,0,10,0s10,4.49,10,10c0,1.75-0.46,3.48-1.33,5c-0.24,0.42-0.51,0.82-0.81,1.19l1.8,1.8
	c0.46,0.46,0.46,1.2,0,1.66C19.43,19.89,19.12,20,18.82,20z M10,2.35c-4.22,0-7.65,3.43-7.65,7.65c0,1.35,0.36,2.67,1.03,3.83
	c0.5,0.87,1.16,1.62,1.95,2.22c0.28,0.21,0.59,0.41,0.9,0.6c0.98,0.57,2.1,0.91,3.26,0.98c0.2,0.01,0.35,0.02,0.51,0.02
	c1.33,0,2.64-0.35,3.79-1c0.3-0.18,0.6-0.38,0.89-0.59c0.22-0.17,0.43-0.35,0.63-0.54c0.03-0.04,0.06-0.07,0.1-0.11
	s0.07-0.07,0.11-0.1c0.43-0.44,0.8-0.94,1.12-1.48c0.67-1.16,1.02-2.48,1.02-3.82C17.65,5.78,14.22,2.35,10,2.35z"/>
                                                </svg>
                                                <div className='space-10'></div>
                                                <div className='searchnotFound-text'>لا يوجد ما يطابق بحثك</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className='flex'>
                    {!getCookie('at') ? (
                        <div>
                            <a href='/login' className='icon cans-head'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 20 20">
                                    <path className="icon-head" d="M19,10c0,1.64-0.44,3.18-1.2,4.5c-0.59,1.02-1.37,1.91-2.3,2.63c-0.33,0.25-0.68,0.48-1.04,0.69
	C13.14,18.57,11.62,19,10,19c-0.2,0-0.4-0.01-0.6-0.02c-1.39-0.09-2.71-0.5-3.85-1.16c-0.36-0.21-0.71-0.44-1.04-0.69
	c-0.93-0.71-1.71-1.6-2.3-2.62C1.44,13.18,1,11.64,1,10c0-4.97,4.03-9,9-9C14.97,1,19,5.03,19,10z M10,5.07
	c-1.63,0-2.96,1.32-2.96,2.96s1.32,2.96,2.96,2.96s2.96-1.32,2.96-2.96S11.63,5.07,10,5.07z M10,14.26c-2.08,0-3.86,1.34-4.48,3.21
	c0.27,0.21,0.55,0.39,0.84,0.56c0.94,0.54,2.01,0.88,3.14,0.95C9.67,19,9.84,19,10,19c1.32,0,2.57-0.35,3.64-0.96
	c0.29-0.17,0.58-0.36,0.84-0.56C13.85,15.6,12.08,14.26,10,14.26z"/>
                                </svg>
                            </a>
                        </div>

                    ) : (
                        <div className='flex space-x-4 space-x-reverse'>

                            <button onClick={ShwMessages} className='group'>
                                {/* <div className='basket-quantity'>
						<div className='basket-number'>
							0
						</div>
					</div> */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24" className="fill-transparent stroke-[1.5px] stroke-sec group-hover:stroke-sec/70">
                                    <rect class="fill-transparent stroke-transparent" width="24" height="24" />
                                    <path d="M12,23H1l1.99-2.25c0.62-0.7,0.8-1.7,0.45-2.57l-1-2.53C-0.34,8.61,4.87,0.72,12.43,1.01
	c0.27,0.01,0.55,0.03,0.82,0.06c5.03,0.56,9.12,4.65,9.68,9.68C23.66,17.38,18.49,23,12,23 M7,9.98h10 M7,14.02h6.47"/>
                                </svg>

                            </button>


                            {showMessages && (

                                <div className='absolute left-5 top-10 w-[360px] h-[580px] bg-white rounded-2xl shadow-[0_0_0_1px_inset_rgba(2,0,3,.1),0_8px_24px_rgba(2,0,3,.1)]'>
                                    <div className='flex items-center px-4 h-[52px]'>
                                        <div className='icon-pin-20'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" className="fill-transparent stroke-[1.5px] stroke-sec group-hover:stroke-sec/70">
                                                <rect class="fill-transparent stroke-transparent" width="24" height="24" />
                                                <path d="M12,23H1l1.99-2.25c0.62-0.7,0.8-1.7,0.45-2.57l-1-2.53C-0.34,8.61,4.87,0.72,12.43,1.01
	c0.27,0.01,0.55,0.03,0.82,0.06c5.03,0.56,9.12,4.65,9.68,9.68C23.66,17.38,18.49,23,12,23 M7,9.98h10 M7,14.02h6.47"/>
                                            </svg>
                                        </div>
                                        <div className='space-10'></div>
                                        <div className='text-sec text-base font-semibold'>الرسائل</div></div>
                                    <div className='solid-h-1'></div>
                                    <div className='inboxContents'>
                                        <div className={`no_inbox${FoundNotification === true ? ' hide' : ' show'}`}>
                                            <div className='illustrative-state'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="88.47px" height="128px" viewBox="0 0 88.47 128">
                                                    <g>
                                                        <path class="illust-col0" d="M88.47,44.23c0,0.84-0.03,1.67-0.07,2.49c-0.11,1.93-0.33,3.84-0.68,5.7c-3.84,20.52-21.84,36.05-43.48,36.05
		S4.6,72.94,0.76,52.42c-0.35-1.86-0.58-3.76-0.68-5.7C0.03,45.9,0,45.07,0,44.23c0-0.72,0.02-1.44,0.05-2.15
		C1.18,18.65,20.53,0,44.23,0s43.06,18.65,44.18,42.07C88.45,42.79,88.47,43.5,88.47,44.23z"/>
                                                        <path class="illust-col1" d="M88.37,47.14c0.06-0.96,0.09-1.93,0.09-2.92c0-0.72-0.02-1.44-0.05-2.15H0.05C0.02,42.79,0,43.5,0,44.23
		c0,2.8,0.26,5.53,0.76,8.19h1.93l28.46,54.41l1.84-0.96L5.02,52.41h22.74l5.97,54.05l2.06-0.23l-5.95-53.82h28.78l-6.13,55.42
		l2.06,0.23l6.15-55.65h22.76l-27.3,53.46l1.85,0.94l27.78-54.41h1.91c0.31-1.64,0.52-3.31,0.64-5l0.11-0.21L88.37,47.14z"/>
                                                        <path class="illust-col2" d="M57.83,103.7H30.64c-1.46,0-2.65,1.18-2.65,2.65c0,1.46,1.18,2.65,2.65,2.65h1.42c0,0.02-0.01,0.04-0.01,0.06
		h24.35c0-0.02-0.01-0.04-0.01-0.06h1.42c1.46,0,2.65-1.18,2.65-2.65C60.48,104.89,59.29,103.7,57.83,103.7z M32.06,111.09v14.15
		c0,1.52,1.24,2.76,2.76,2.76h18.83c1.52,0,2.76-1.24,2.76-2.76v-16.12c0-0.02,0-0.04,0-0.06L32.06,111.09z"/>
                                                        <path class="illust-col1" d="M28.85,19.26c-0.53,0.13-1.05,0.3-1.55,0.49c-0.24-0.34-0.5-0.66-0.79-0.97c-0.61-0.64-1.29-1.25-2.23-1.71
		c-0.12,1.04,0.01,1.94,0.22,2.8c0.1,0.38,0.22,0.74,0.35,1.09c-0.43,0.27-0.84,0.56-1.25,0.88c-0.77,0.63-1.51,1.34-2.11,2.31
		c1.14,0.11,2.15-0.04,3.12-0.27c0.53-0.13,1.04-0.29,1.55-0.48c0.24,0.34,0.5,0.66,0.79,0.97c0.6,0.64,1.29,1.25,2.23,1.71
		c0.12-1.04-0.01-1.94-0.22-2.8c-0.1-0.37-0.22-0.74-0.35-1.09c0.43-0.27,0.84-0.56,1.24-0.88c0.77-0.63,1.51-1.34,2.11-2.31
		C30.83,18.88,29.82,19.03,28.85,19.26z"/>
                                                    </g>
                                                </svg>
                                            </div>
                                            <div className='inboxIllus-text'>صندوق الوارد فارغ</div>
                                            <div className='inboxIllus-description'>جميع الرسائل المتلقاة تجدها هنا</div>
                                            <div className={`${showNotification === false ? 'btn-hide' : 'btn-show'}`}>
                                                <div className='dspace-20'></div>
                                                <div className='btn-center'>
                                                    <button type='button' onClick={requestNotificationPermission} className='btn-AllowNotif'>تفعيل الإشعارات</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`content_inbox${FoundNotification === true ? ' show' : ' hide'}`}>
                                            {getNotification.map((inbox, index) => (
                                                <div>
                                                    {index === 0 && (
                                                        // <div className='inbox-warning'>
                                                        // 	<div className='inboxWarning-text'>الرسائل تُحذف تلقائيًا بعد مرور 30 يومًا من تلقيها.</div>
                                                        // </div>
                                                        <div className='dspace-20'></div>
                                                    )}
                                                    <div className='inbox_content'>
                                                        <div className='flex'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 32 32" className='icon-grey'>
                                                                <rect className='transparent' width="32" height="32" />
                                                                <g>
                                                                    <path d="M14.2,15.4c1.06,0.79,2.54,0.79,3.6,0l11.96-8.97C29.23,6.16,28.64,6,28,6H4C3.36,6,2.77,6.16,2.24,6.43L14.2,15.4z" />
                                                                    <path d="M19,17c-0.88,0.66-1.94,0.99-3,0.99c-1.06,0-2.12-0.33-3-0.99L0.68,7.76C0.25,8.4,0,9.17,0,10v12c0,2.21,1.79,4,4,4h24
		c2.21,0,4-1.79,4-4V10c0-0.83-0.25-1.6-0.68-2.24L19,17z"/>
                                                                </g>
                                                            </svg>
                                                        </div>
                                                        <div className='space-20'></div>
                                                        <div>
                                                            <div className='inboxContent-text'>
                                                                {inbox.inbox}
                                                            </div>
                                                            <div className='inboxContent-content'>
                                                                {inbox.content}
                                                            </div>
                                                            <div className='inboxContent-options'>

                                                            </div>
                                                            <div className='inboxContent-date'>{formatDate(inbox.date)}</div>
                                                        </div>
                                                    </div>
                                                    {totalInbox !== index + 1 && (
                                                        <div className='dspace-20'></div>
                                                    )}
                                                    {totalInbox !== index + 1 && (
                                                        <div className='solid-h-1'></div>
                                                    )}

                                                    {totalInbox !== index + 1 && (
                                                        <div className='dspace-20'></div>
                                                    )}
                                                </div>
                                            ))}
                                            <div className='dspace-20'></div>
                                        </div>

                                    </div>
                                </div>
                            )}
                            <button type='button' onClick={toggleMenuAccount} className='rounded-full transition duration-100 hover:shadow-[0_0_0_2px_rgba(204,0,35,0.25)]'>
                                <div className='bg-pri min-w-[20px] h-[20px] rounded-full text-white font-semibold text-xs flex justify-center items-center'>{data[0]}</div>
                            </button>
                            {showMenuAccount && (
                                <div className={`absolute top-12 left-28 ${showMenuAccount === false && ' hidden'}`}>
                                    {/* <button type='button' onClick={toggleMenuAccount} className='menu-hidebtn'><div className='rotate-text'>.حدد شيئاً</div></button> */}
                                    <div className={`popup-center ${showAccountLogout === false ? 'hide' : 'show'}`}>
                                        <div className='relative w-[300px] rounded-xl shadow-xl bg-white'>
                                            <div className='popup-content'>
                                                <div className='popup-name'>تسجيل الخروج</div>
                                                <div className='popup-description'>سيتم تسجيل خروجك بشكل نهائي من المتصفح، هل أنت متأكد من المتابعة؟</div>
                                            </div>
                                            <div className='p-2 space-y-2'><button type='button' onClick={LogOut} className='bg-sec rounded-xl px-2 h-[32px] w-full'><span className='text-white text-sm font-semibold'>تسجيل الخروج</span></button><button type='button' onClick={AccountLogout} className='bg-transparent rounded-xl px-2 h-[32px] w-full'><span className='text-sec text-sm font-semibold'>إلغاء</span></button></div>
                                        </div>
                                    </div>
                                    <div className='flex-p animation'>
                                        <div className={`bg-white rounded-xl shadow-md after:content-[''] after:pointer-events-none after:absolute after:left-0 after:top-0 after:w-full after:h-full after:rounded-xl after:shadow-[0_0_0_1px_rgba(2,0,3,.08)]`}>
                                            <div className='flex items-center p-3 space-x-2 space-x-reverse '>
                                                <div className='menu-picture-letter'>{data[0]}</div>
                                                <div className='menu-name'>{data}</div><div className='menu-account-level'>مشرف</div><div className='space-10'></div>
                                                <button onClick={AccountLogout} className='icon cans-head'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon-black'>
                                                        <rect className="transparent" width="16" height="16" />
                                                        <path d="M7.51,16H4.84c-1.72,0-3.11-1.4-3.11-3.11V3.11C1.73,1.4,3.13,0,4.84,0h2.67C8,0,8.4,0.4,8.4,0.89S8,1.78,7.51,1.78H4.84
	c-0.74,0-1.33,0.6-1.33,1.33v9.78c0,0.74,0.6,1.33,1.33,1.33h2.67c0.49,0,0.89,0.4,0.89,0.89C8.4,15.6,8,16,7.51,16z M10.87,11.4
	c-0.23,0-0.45-0.09-0.63-0.26c-0.35-0.35-0.35-0.91,0-1.25l1-1H6.18c-0.49,0-0.89-0.4-0.89-0.89s0.4-0.89,0.89-0.89h5.06l-1-1
	c-0.35-0.35-0.35-0.91,0-1.25c0.35-0.35,0.91-0.35,1.25,0l2.52,2.52c0.09,0.09,0.15,0.19,0.2,0.29c0.04,0.1,0.06,0.2,0.07,0.32l0,0
	c0,0.01,0,0.02,0,0.03l0,0l0,0c0,0.12-0.03,0.22-0.07,0.32l0,0l0,0c-0.04,0.1-0.1,0.2-0.18,0.28l0,0l0,0l0,0l-0.01,0.01l-2.51,2.52
	C11.32,11.32,11.1,11.4,10.87,11.4z"/>
                                                    </svg>
                                                    <div className='tooltip'>
                                                        تسجيل الخروج
                                                    </div>
                                                </button>

                                            </div>
                                            <div className='solid-h-1'></div>
                                            {/* <div className='header-account'>
                            <div className='menu-picture-letter'>{data[0]}</div>
                            <div className='space-10'></div>
                            <div className='menu-name'>{data}</div>
                        </div> */}
                                            <div className='btns_menu'>
                                                <Link to='/orders/' onClick={() => { document.body.style.overflow = 'auto' }} className='btn-menuSection'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className='icon'>
                                                        <path d="M14,0H4C1.79,0,0,1.79,0,4v10c0,2.21,1.79,4,4,4h10c2.21,0,4-1.79,4-4V4C18,1.79,16.21,0,14,0z M6.19,4.34
	c0-0.55,0.45-1,1-1h3.63c0.55,0,1,0.45,1,1v0.25c0,0.55-0.45,1-1,1H7.19c-0.55,0-1-0.45-1-1V4.34z M11.81,13.66c0,0.55-0.45,1-1,1
	H7.19c-0.55,0-1-0.45-1-1v-0.25c0-0.55,0.45-1,1-1h3.63c0.55,0,1,0.45,1,1V13.66z M14.63,9.13c0,0.55-0.45,1-1,1H4.38
	c-0.55,0-1-0.45-1-1V8.88c0-0.55,0.45-1,1-1h9.25c0.55,0,1,0.45,1,1V9.13z"/>
                                                    </svg>
                                                    <div className='space-10'></div>
                                                    الطلبات</Link>
                                                <Link to='/' onClick={() => { document.body.style.overflow = 'auto' }} className='btn-menuSection' disabled tabIndex={-1}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className='icon'>
                                                        <rect className="transparent" width="18" height="18" />
                                                        <path d="M14.31,8.68C16.29,4.72,13.45,0.07,9.05,0C4.54-0.07,1.69,4.88,3.7,8.91l4.23,8.46c0.42,0.84,1.61,0.84,2.03,0
	L14.31,8.68z M9,9.18c-1.81,0-3.27-1.47-3.27-3.27S7.19,2.64,9,2.64s3.27,1.47,3.27,3.27S10.81,9.18,9,9.18z"/>
                                                    </svg>
                                                    <div className='space-10'></div>
                                                    تتبع الطرد</Link>
                                                <Link to='/saves/' onClick={() => { document.body.style.overflow = 'auto' }} className='btn-menuSection'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className='icon'>
                                                        <rect className='transparent' width="18" height="18" />
                                                        <path d="M15.44,0H2.56C1.84,0,1.27,0.58,1.27,1.29v15.42c0,1.07,1.23,1.67,2.08,1.02l4.87-3.76c0.46-0.36,1.11-0.36,1.58,0
	l4.87,3.76c0.85,0.66,2.08,0.05,2.08-1.02V1.29C16.73,0.58,16.16,0,15.44,0z M14.74,3.67c0,0.6-0.49,1.09-1.09,1.09H4.36
	c-0.6,0-1.09-0.49-1.09-1.09V3.35c0-0.6,0.49-1.09,1.09-1.09h9.28c0.6,0,1.09,0.49,1.09,1.09V3.67z"/>

                                                    </svg>
                                                    <div className='space-10'></div>
                                                    المحفوظات</Link>
                                                <div className='dspace-5'></div>
                                                <div className='solid-h-1'></div>
                                                <div className='dspace-5'></div>
                                                <Link to='/settings/' onClick={() => { document.body.style.overflow = 'auto' }} className='btn-menuSection'>
                                                    <div className='icon-pin'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className='icon'>
                                                            <rect className='transparent' width="18" height="18" />
                                                            <path d="M17.1,6.82l-0.83-0.83V4.81c0-1.7-1.38-3.08-3.08-3.08h-1.18L11.17,0.9c-1.2-1.2-3.15-1.2-4.35,0L5.99,1.73H4.81
	c-1.7,0-3.08,1.38-3.08,3.08v1.18L0.9,6.82c-1.2,1.2-1.2,3.15,0,4.35l0.83,0.83v1.18c0,1.7,1.38,3.08,3.08,3.08h1.18l0.83,0.83
	C7.4,17.68,8.18,18,9,18s1.59-0.32,2.18-0.9l0.83-0.83h1.18c1.7,0,3.08-1.38,3.08-3.08v-1.18l0.83-0.83
	C18.3,9.98,18.3,8.02,17.1,6.82z M13.95,9c0,2.73-2.22,4.95-4.95,4.95S4.05,11.73,4.05,9S6.27,4.05,9,4.05S13.95,6.27,13.95,9z"/>

                                                        </svg>
                                                    </div>
                                                    <div className='space-10'></div>
                                                    <div className='swidth-1'>الإعدادات</div>
                                                </Link>
                                                <div className='dspace-5'></div>
                                                <div className='solid-h-1'></div>
                                                <div className='dspace-5'></div>
                                                <Link to='/control/' onClick={() => { document.body.style.overflow = 'auto' }} className='btn-menuSection'>
                                                    <div className='icon-pin'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className='icon'>
                                                            <rect className='transparent' width="18" height="18" />
                                                            <path d="M17.1,6.82l-0.83-0.83V4.81c0-1.7-1.38-3.08-3.08-3.08h-1.18L11.17,0.9c-1.2-1.2-3.15-1.2-4.35,0L5.99,1.73H4.81
	c-1.7,0-3.08,1.38-3.08,3.08v1.18L0.9,6.82c-1.2,1.2-1.2,3.15,0,4.35l0.83,0.83v1.18c0,1.7,1.38,3.08,3.08,3.08h1.18l0.83,0.83
	C7.4,17.68,8.18,18,9,18s1.59-0.32,2.18-0.9l0.83-0.83h1.18c1.7,0,3.08-1.38,3.08-3.08v-1.18l0.83-0.83
	C18.3,9.98,18.3,8.02,17.1,6.82z M13.95,9c0,2.73-2.22,4.95-4.95,4.95S4.05,11.73,4.05,9S6.27,4.05,9,4.05S13.95,6.27,13.95,9z"/>
                                                            <circle cx="9" cy="9" r="2" />

                                                        </svg>
                                                    </div>
                                                    <div className='space-10'></div>
                                                    <div className='swidth-1'>التحكم</div>
                                                </Link>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}


                            <button onClick={toggleBasket} className='group'>
                                {/* <div className='basket-quantity'>
						<div className='basket-number'>
							0
						</div>
					</div> */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24" className="fill-transparent stroke-[1.5px] stroke-sec group-hover:stroke-sec/70">
                                    <rect class="fill-transparent stroke-transparent" width="24" height="24" />
                                    <path d="M18.45,23H5.55c-1.11,0-2.06-0.78-2.27-1.86l-1.86-9.28c-0.29-1.44,0.81-2.77,2.27-2.77h16.61
	c1.46,0,2.56,1.34,2.27,2.77l-1.86,9.28C20.51,22.22,19.56,23,18.45,23z M5.04,5.04h13.92 M7.36,1h9.28"/>
                                </svg>

                            </button>


                            {showBasket && (
                                <>
                                    <motion.div
                                        initial={{ left: -360 }}
                                        animate={{ left: 0 }}
                                        exit={{ left: -360 }}        // عند الإخفاء
                                        transition={{ duration: 0.2 }}
                                        className={`fixed flex top-0 left-0 bg-white shadow-xl overflow-hidden overscroll-contain`}>
                                        <div className='w-[1px] h-screen bg-sec/10'></div>

                                        <div className=' w-[359px] h-screen'>
                                            <div className='flex items-center px-4 h-[48px] space-x-2 space-x-reverse'>
                                                <div className='min-w-[20px]'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" className="fill-transparent stroke-[1.5px] stroke-sec group-hover:stroke-sec/70">
                                                        <rect class="fill-transparent stroke-transparent" width="24" height="24" />
                                                        <path d="M18.45,23H5.55c-1.11,0-2.06-0.78-2.27-1.86l-1.86-9.28c-0.29-1.44,0.81-2.77,2.27-2.77h16.61
	c1.46,0,2.56,1.34,2.27,2.77l-1.86,9.28C20.51,22.22,19.56,23,18.45,23z M5.04,5.04h13.92 M7.36,1h9.28"/>
                                                    </svg>
                                                </div>
                                                <div className='text-base text-sec font-normal'>السلة</div>
                                                {basketsProducts.length !== 0 &&
                                                    (
                                                        <div className='text-base text-pri font-semibold'>{basketsProducts.length}</div>
                                                    )
                                                }
                                                <div className='uspace-10'></div>
                                                <button onClick={closeBasket} className='icon cans-head'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon'>
                                                        <rect className='transparent' width="16" height="16" />
                                                        <path d="M12.95,14.36L8,9.41l-4.95,4.95l-1.41-1.41L6.59,8L1.64,3.05l1.41-1.41L8,6.59l4.95-4.95l1.41,1.41L9.41,8
	l4.95,4.95L12.95,14.36z"/>
                                                    </svg>
                                                    <div className='tooltip'>
                                                        إغلاق
                                                    </div>
                                                </button>
                                            </div>
                                            <div className='w-full h-[1px] bg-sec/10'></div>



                                            <div className={`relative  h-[calc(100%-148px)] overflow-hidden ${baskets.length !== 0 && 'active'}`}>
                                                <div className='absolute flex justify-center items-center top-3 left-0 p-2 pt-0 w-full'>
                                                    <div className={`flex items-center h-[48px] px-3 bg-sec/40 backdrop-blur-md rounded-2xl ${Object.values(selectedProducts).some(value => value === true) ? 'block' : 'hidden'} ${baskets.length !== 0 && 'active'}`}>
                                                        <div className='flex items-center justify-center h-[32px] px-3 bg-pri rounded-xl text-nowrap'><span className='text-white text-sm font-semibold'>
                                                            {Object.values(selectedProducts).filter(value => value === true).length} / {basketsProducts.length}</span></div>
                                                        <div className='space-10'></div>
                                                        <button className='flex items-center justify-center h-[32px] min-w-[32px] bg-white/20 hover:bg-white/25 rounded-xl' onClick={resetSelectionOnClose}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='fill-white'>
                                                                <rect className='transparent' width="16" height="16" />
                                                                <path d="M12.95,14.36L8,9.41l-4.95,4.95l-1.41-1.41L6.59,8L1.64,3.05l1.41-1.41L8,6.59l4.95-4.95l1.41,1.41L9.41,8
	l4.95,4.95L12.95,14.36z"/>
                                                            </svg>
                                                            <div className='tooltip'>
                                                                إلغاء تحديد الكل
                                                            </div>
                                                        </button>
                                                        <div className='space-10'></div>
                                                        <button className='h-[32px] px-3 bg-white/20 rounded-xl text-nowrap hover:bg-white/25 disabled:text-sec/70' onClick={activateAllSelections} disabled={Object.values(selectedProducts).every((value) => value === true) ? true : false}><span className='text-white text-sm font-semibold'>تحديد الكل</span></button>

                                                    </div>
                                                </div>
                                                <div className={`overscroll-contain overflow-y-auto  pt-0 h-[calc(100%)]`}>
                                                    {basketsProducts.map((basket, i) => (
                                                        <div>
                                                            <div className={`basket-product select-none
 flex items-center p-4 rounded-2xl  transition duration-100 ${selectedProducts[i] && 'select'} `}>
                                                                <div className='fwid'>
                                                                    <div className='flex'>
                                                                        <div className='flex'>
                                                                            <Link className=' group' to={`/product/${basket.title}`} onClick={() => { document.body.style.overflow = 'auto' }}>
                                                                                <img src={`/img/${basket.image}.jpg`} className='transition duration-100 rounded-xl h-[56px] min-w-[56px] shadow-[0_0_0_2px_rgba(2,0,3,0.1)] group-hover:shadow-[0_0_0_4px_rgba(2,0,3,0.1)]' tabindex={-1} />
                                                                            </Link>
                                                                        </div>
                                                                        <div className='space-20'></div>
                                                                        <div className='basket-productTexts space-y-2'>
                                                                            <div className='text-sec font-semibold text-sm'>{basket.title}</div>
                                                                            <div className='flex'>
                                                                                <div className='text-pri text-xs font-semibold space-x-1 space-x-reverse'><span>{basket.section_name}</span><span className='text-[8px] text-sec/70'>•</span><span>{basket.type_name}</span></div>

                                                                            </div>
                                                                            <div className='text-sec text-xs font-normal'>{basket.price} ج.م</div>

                                                                            <div className='flex items-center space-x-2 space-x-reverse'><span className='text-sec text-xs font-normal'>الكمية:</span><span className='text-sec text-xs font-semibold'>{quantitys[i] || 1}</span>

                                                                                <div className='flex space-x-1 space-x-reverse'>
                                                                                    <button type='button' className='flex items-center justify-center h-[24px] min-w-[24px] transition duration-100 bg-sec/10 hover:bg-sec/15 rounded-full' onClick={() => setQuantity(i, (quantitys[i] || 1) - 1)}>
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="10px" viewBox="0 0 16 16" className='fill-sec'>
                                                                                            <rect className="transparent" width="16" height="16" />
                                                                                            <g>
                                                                                                <rect y="7" width="16" height="2" />
                                                                                            </g>
                                                                                        </svg>
                                                                                        <div className='tooltip'>
                                                                                            إنقاص
                                                                                        </div>
                                                                                    </button>

                                                                                    <button type='button' className='flex items-center justify-center h-[24px] min-w-[24px] transition duration-100 shadow-[0_0_0_2px_rgba(2,0,3,.1)] hover:shadow-[0_0_0_2px_rgba(2,0,3,1)] rounded-full' onClick={() => { if (quantitys[i] === basket.quantity_in_basket || 1) { setQuantity(i, (quantitys[i] || 1) + 1); } }}>
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="10px" height="10px" viewBox="0 0 16 16" className='fill-sec'>
                                                                                            <rect className="transparent" width="16" height="16" />
                                                                                            <g>
                                                                                                <polygon points="16,7 9,7 9,0 7,0 7,7 0,7 0,9 7,9 7,16 9,16 9,9 16,9 " />
                                                                                            </g>
                                                                                        </svg>
                                                                                        <div className='tooltip'>
                                                                                            إضافة
                                                                                        </div>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                            {selectedProducts[i] && (
                                                                                <div className='flex space-x-2 space-x-reverse'>
                                                                                    <span className='text-sec text-xs font-normal'>الأجمالي:</span><span className='text-pri text-xs font-semibold'>  {((quantitys[i] || 1) * (basket.price || 0)).toFixed(2)} ج.م</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='checkLayout'>

                                                                    <div value={i} className='checkLayout-box rounded-lg' onClick={() => selectProducts(i)}><svg width="16px" height="16px" viewBox="0 0 16 16">
                                                                        <rect class="transparent" width="16px" height="16px" />
                                                                        <line id="Line1" className='Line' x1="1" y1="8" x2="1" y2="8" />
                                                                        <line id="Line2" className='Line' x1="5.67" y1="12.67" x2="5.67" y2="12.67" />

                                                                    </svg>
                                                                        <div className='tooltip'>
                                                                            تحديد
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>


                                            </div>
                                            {basketsProducts.length !== 0 && (
                                                <>
                                                    <div className='w-full h-[1px] bg-sec/10'></div>
                                                    <div className='flex items-center justify-center w-full h-[48px]'>
                                                        {Object.values(selectedProducts).some(value => value === true) ? (
                                                            <div className='popupLayout-texts space-x-2 space-x-reverse'>


                                                                <div className='flex text-sm text-sec font-normal space-x-2 space-x-reverse'><span> #</span><span className='font-semibold text-pri'>{Object.values(selectedProducts).some(value => value === true) && Object.keys(selectedProducts).filter((key) => selectedProducts[key]).reduce((total, key) => { const quantity = quantitys[key] || 1; return total + quantity; }, 0)}</span>
                                                                </div>
                                                                <span className='text-xs text-sec/70 font-normal'>•</span>
                                                                <div className='flex text-sm text-sec font-normal space-x-2 space-x-reverse'>
                                                                    <span> الإجمالي الكلي </span><span className='font-semibold text-pri underline'>
                                                                        {
                                                                            Object.values(selectedProducts).some(value => value === true) &&
                                                                            formatNumber(
                                                                                Object.keys(selectedProducts)
                                                                                    .filter((key) => selectedProducts[key])
                                                                                    .reduce((total, key) => {
                                                                                        const productId = basketsProducts[key].id;
                                                                                        const product = basketsProducts.find((product) => product.id === productId);
                                                                                        const quantity = quantitys[key] || 1;
                                                                                        return total + (product ? product.price * quantity : 0);
                                                                                    }, 0)
                                                                            )
                                                                        } ج.م
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className='popupLayout-note space-x-2 space-x-reverse'><span className='text-sec/50 text-sm font-normal'>حدد عنصر واحد علي الأقل أو </span><button className='h-[32px] px-3 bg-sec/10 rounded-xl text-nowrap hover:bg-sec/15 disabled:text-sec/70' onClick={activateAllSelections}><span className='text-sec text-sm font-semibold'>تحديد الكل</span></button></div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                            <div className='flex items-center justify-center'>
                                                <button onClick={() => { processBuyBasket(); document.body.style.overflow = 'hidden' }} className='transition duration-100 cursor-pointer w-[calc(100%-32px)] h-[38px] px-3 bg-sec rounded-xl text-nowrap hover:bg-sec/90 disabled:text-sec/70' disabled={Object.values(selectedProducts).some(value => value === true) ? false : true}><span className='text-sm font-semibold text-white'>شراء الآن</span></button>
                                            </div>
                                        </div>
                                    </motion.div>
                                    {showBuyBasket && (
                                        <div className='fixed top-0 left-0 w-full h-full bg-sec/10 backdrop-blur-sm flex items-center justify-center z-[1000]'>
                                            <motion.div

                                                initial={{ bottom: -25, opacity: 0, scale: 0.9 }}
                                                animate={{ bottom: 0, opacity: 1, scale: 1 }}
                                                exit={{ bottom: -25 }}        // عند الإخفاء
                                                transition={{ duration: 0.1 }}
                                                className='select-none relative w-[768px] h-[532px] bg-white rounded-3xl shadow-2xl'>
                                                <div className='absolute left-0 w-full top-0 bottom-0 flex justify-between'>
                                                    <div className='w-[50%]'>
                                                        <div className='w-full h-full px-1'>
                                                            <div className='w-full h-full overflow-y-auto  overscroll-contain  p-1'>
                                                                <div className='relative w-full h-[58px] px-3 flex items-center space-x-2 space-x-reverse'>
                                                                    <div className='space-x-2 space-x-reverse bg-pri px-3 rounded-full'>
                                                                        <span className='text-sm font-semibold text-white'>
                                                                            {Object.values(selectedProducts).filter(value => value === true).length}
                                                                        </span>
                                                                    </div>
                                                                    <span className='text-sm font-semibold'> الإجمالي الكلي </span><span className='text-sm font-semibold text-pri underline'>
                                                                        {
                                                                            Object.values(selectedProducts).some(value => value === true) &&
                                                                            formatNumber(
                                                                                Object.keys(selectedProducts)
                                                                                    .filter((key) => selectedProducts[key])
                                                                                    .reduce((total, key) => {
                                                                                        const productId = basketsProducts[key].id;
                                                                                        const product = basketsProducts.find((product) => product.id === productId);
                                                                                        const quantity = quantitys[key] || 1;
                                                                                        return total + (product ? product.price * quantity : 0);
                                                                                    }, 0)
                                                                            )
                                                                        } ج.م
                                                                    </span>
                                                                </div>
                                                                {basketsProducts.filter((_, i) => selectedProducts[i]).map((basket, i) => (
                                                                    <div>
                                                                        <div className={`basket-product select-none
 flex items-center p-4 rounded-2xl  transition duration-100 ${selectedProducts[i] && 'select'} `}>
                                                                            <div className='fwid'>
                                                                                <div className='flex'>
                                                                                    <div className='flex'>
                                                                                        <Link className=' group' to={`/product/${basket.title}`} onClick={() => { document.body.style.overflow = 'auto' }}>
                                                                                            <img src={`/img/${basket.image}.jpg`} className='transition duration-100 rounded-xl h-[56px] min-w-[56px] shadow-[0_0_0_2px_rgba(2,0,3,0.1)] group-hover:shadow-[0_0_0_2px_rgba(204,0,35,1)]' tabindex={-1} />
                                                                                        </Link>
                                                                                    </div>
                                                                                    <div className='space-20'></div>
                                                                                    <div className='basket-productTexts space-y-2'>
                                                                                        <div className='text-sec font-semibold text-sm'>{basket.title}</div>
                                                                                        <div className='flex'>
                                                                                            <div className='text-pri text-xs font-semibold space-x-1 space-x-reverse'><span>{basket.section_name}</span><span className='text-[8px] text-sec/70'>•</span><span>{basket.type_name}</span></div>
                                                                                        </div>
                                                                                        <div className='text-sec text-xs font-normal'>{basket.price} ج.م</div>

                                                                                        <div className='flex items-center space-x-2 space-x-reverse'><span className='text-sec text-xs font-normal'>الكمية:</span><span className='text-sec text-xs font-semibold'>{quantitys[i] || 1}</span>
                                                                                        </div>
                                                                                        <div className='flex space-x-2 space-x-reverse'>
                                                                                            <span className='text-sec text-xs font-normal'>الأجمالي:</span><span className='text-pri text-xs font-semibold'>  {((quantitys[i] || 1) * (basket.price || 0)).toFixed(2)} ج.م</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='relative flex justify-center w-[50%] px-2 pt-3'>
                                                        <div className='relative w-full'>
                                                            <div className='space-y-2'>
                                                                {false && (
                                                                    <div className='w-full px-2'>
                                                                        <div className='relative w-full rounded-xl p-[1px] shadow-[0_0_0_1px_inset_rgba(2,0,3,.2)] space-y-2 py-2'>
                                                                            <div className='px-4 space-y-1'>
                                                                                <span className='text-xs text-sec font-semibold'>التفاصيل</span>
                                                                                <div className='flex items-center space-x-2 space-x-reverse'>
                                                                                    <span className='text-xs text-sec font-normal'>القائمة</span>
                                                                                    <span className='text-xs text-pri font-semibold'>قائمة أساسية</span>
                                                                                </div>
                                                                                <div className='flex items-center space-x-2 space-x-reverse'>
                                                                                    <span className='text-xs text-sec font-normal'>رقم العملية</span>
                                                                                    <span className='text-xs text-pri font-semibold'>1000245/2025</span>
                                                                                </div>
                                                                                <div className='flex items-center space-x-2 space-x-reverse'>
                                                                                    <span className='text-xs text-sec font-normal'>إجمالي المبلغ</span>
                                                                                    <span className='text-xs text-pri font-semibold'>
                                                                                        {
                                                                                            Object.values(selectedProducts).some(value => value === true) &&
                                                                                            formatNumber(
                                                                                                Object.keys(selectedProducts)
                                                                                                    .filter((key) => selectedProducts[key])
                                                                                                    .reduce((total, key) => {
                                                                                                        const productId = basketsProducts[key].id;
                                                                                                        const product = basketsProducts.find((product) => product.id === productId);
                                                                                                        const quantity = quantitys[key] || 1;
                                                                                                        return total + (product ? product.price * quantity : 0);
                                                                                                    }, 0)
                                                                                            )
                                                                                        } ج.م
                                                                                    </span>
                                                                                </div>
                                                                                <div className='flex items-center space-x-2 space-x-reverse'>
                                                                                    <span className='text-xs text-sec font-normal'>طريقة الدفع</span>
                                                                                    <span className='text-xs text-pri font-semibold'>كاش</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className='w-full h-[1px] bg-sec/10'></div>
                                                                            <div className='px-4 space-y-1'>
                                                                                <span className='text-xs text-sec font-semibold'>المستلم</span>
                                                                                <div className='flex items-center space-x-2 space-x-reverse'>
                                                                                    <span className='text-xs text-sec font-normal'>أسم المستلم</span>
                                                                                    <span className='text-xs text-pri font-semibold'>علي محمد كاسبر</span>
                                                                                </div>
                                                                                <div className='flex items-center space-x-2 space-x-reverse'>
                                                                                    <span className='text-xs text-sec font-normal'>رقم الهاتف</span>
                                                                                    <span className='text-xs text-pri font-semibold' dir="ltr">+20 11 16744379</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className='w-full h-[1px] bg-sec/10'></div>
                                                                            <div className='px-4 space-y-1'>
                                                                                <span className='text-xs text-sec font-semibold'>التوصيل</span>
                                                                                <div className='flex items-center space-x-2 space-x-reverse'>
                                                                                    <span className='text-xs text-sec font-normal'>العنوان</span>
                                                                                    <span className='text-xs text-pri font-semibold'>الجيزة، ساقية مكي</span>
                                                                                </div>
                                                                                <div className='flex items-center space-x-2 space-x-reverse'>
                                                                                    <span className='text-xs text-sec font-normal'>أسم الشارع</span>
                                                                                    <span className='text-xs text-pri font-semibold'>شارع الحرية</span>
                                                                                </div>
                                                                                <div className='flex items-center space-x-2 space-x-reverse'>
                                                                                    <span className='text-xs text-sec font-normal'>رقم العمارة</span>
                                                                                    <span className='text-xs text-pri font-semibold'>10</span>
                                                                                </div>
                                                                                <div className='flex items-center space-x-2 space-x-reverse'>
                                                                                    <span className='text-xs text-sec font-normal'>رقم دور العمارة</span>
                                                                                    <span className='text-xs text-pri font-semibold'>2</span>
                                                                                </div>
                                                                                <div className='flex items-center space-x-2 space-x-reverse'>
                                                                                    <span className='text-xs text-sec font-normal'>نوع التوصيل</span>
                                                                                    <span className='text-xs text-pri font-semibold'>منزل</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className='flex'>
                                                                    <div className='relative w-full px-2'>
                                                                        <div onClick={processMenus} className='flex justify-between select-none cursor-pointer transition duration-100 items-center px-3 min-w-full h-[42px] rounded-xl shadow-[0_0_0_1px_inset_rgba(2,0,3,.5),0_0_0_1px_transparent] hover:shadow-[0_0_0_2px_inset_rgba(2,0,3,.7),0_0_0_1px_transparent]'>
                                                                            {contextMenu ? (
                                                                                <span className='text-sm text-sec/50 font-semibold'>
                                                                                    إختر قائمة
                                                                                </span>
                                                                            ) : (
                                                                                <span className='text-sm text-sec font-semibold'>
                                                                                    قائمة أساسية
                                                                                </span>
                                                                            )}
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                                                                <path class="fill-sec" d="M12.21,7.25l-3.31,3.31c-0.5,0.5-1.31,0.5-1.81,0L3.79,7.25C2.98,6.44,3.55,5.07,4.69,5.07h6.62
	C12.45,5.07,13.02,6.44,12.21,7.25z"/>
                                                                            </svg>
                                                                        </div>
                                                                        {showMenus && (
                                                                            <motion.div
                                                                                initial={{ top: 0, opacity: 0 }}
                                                                                animate={{ top: 48, opacity: 1 }}
                                                                                transition={{ duration: 0.1 }}
                                                                                exit={{ top: 0 }}        // عند الإخفاء
                                                                                className={`z-[9999] absolute right-0 top-[32px] w-full h-auto min-h-[8px] after:content-[''] after:pointer-events-none after:absolute shadow-xl after:left-0 after:top-0 after:w-full after:h-full after:rounded-xl after:shadow-[0_0_0_1px_rgba(2,0,3,.2)] bg-white rounded-xl`}>
                                                                                <div className='overflow-y-auto max-h-[480px] overscroll-contain'>
                                                                                    {contextMenu ? (
                                                                                        <div className='flex items-center justify-center min-h-[52px]'>
                                                                                            <div class="spinner"></div>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <>
                                                                                            <div className='p-1'>
                                                                                                <button className='relative w-full flex items-center px-2 h-[38px] hover:bg-sec/10 rounded-lg space-x-2 space-x-reverse'>
                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24">
                                                                                                        <path class="fill-transparent stroke-[1.5px] stroke-sec" d="M23,12c0,6.08-4.92,11-11,11S1,18.08,1,12S5.92,1,12,1S23,5.92,23,12z" />

                                                                                                    </svg>
                                                                                                    <span className='text-sm text-sec font-normal'>
                                                                                                        قائمة أساسية
                                                                                                    </span>

                                                                                                </button>
                                                                                            </div>
                                                                                            <div className='w-full h-[1px] bg-sec/10'></div>
                                                                                            <div className='p-1'>
                                                                                                <button className='relative w-full flex items-center px-2 h-[38px] hover:bg-pri/10 rounded-lg space-x-2 space-x-reverse'>
                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24">
                                                                                                        <path class="fill-transparent stroke-[1.5px] stroke-pri" d="M23,12c0,6.08-4.92,11-11,11S1,18.08,1,12S5.92,1,12,1S23,5.92,23,12z M12,6v6h6 M12,18v-6H6" />

                                                                                                    </svg>
                                                                                                    <span className='text-sm text-pri font-normal'>
                                                                                                        إنشاء قائمة جديدة
                                                                                                    </span>

                                                                                                </button>
                                                                                            </div>
                                                                                        </>
                                                                                    )}
                                                                                </div>
                                                                            </motion.div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className='flex space-x-2 space-x-reverse px-3'>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" class="stroke-sec/70 stroke-[1.5px] fill-transparent">
                                                                        <path d="M15,8c0,3.87-3.13,7-7,7s-7-3.13-7-7s3.13-7,7-7S15,4.13,15,8z M8,4.5v4.2 M8,10.8v0.7" />
                                                                    </svg>
                                                                    <span className='text-xs font-normal text-sec/70'>تُضاف العناصر مباشرة إلى القائمة المحددة بعد تأكيد الشراء.
                                                                        <span className='flex items-center text-pri font-semibold text-xs'>
                                                                            <Link className='flex items-center hover:underline space-x-1 space-x-reverse'>
                                                                                <span className='text-nowrap'>
                                                                                    معرفة المزيد
                                                                                </span>
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="10px"
                                                                                    height="10px" viewBox="0 0 12 12" className='fill-pri'>
                                                                                    <path d="M11.78,10.72L2.56,1.5H6c0.41,0,0.75-0.34,0.75-0.75S6.41,0,6,0H0.75c-0.1,0-0.19,0.02-0.29,0.06
	C0.28,0.13,0.13,0.28,0.06,0.46C0.02,0.56,0,0.65,0,0.75V6c0,0.41,0.34,0.75,0.75,0.75S1.5,6.41,1.5,6V2.56l9.22,9.22
	c0.15,0.15,0.34,0.22,0.53,0.22s0.38-0.07,0.53-0.22C12.07,11.49,12.07,11.01,11.78,10.72z"/>

                                                                                </svg>
                                                                            </Link>
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                                <div className='absolute bottom-0 left-0 h-[60px] px-3 flex items-center justify-between'>
                                                                    <div className='flex items-center justify-between'>
                                                                        <div className='flex space-x-2 space-x-reverse'>
                                                                            <button onClick={() => { processBuyBasket(); document.body.style.overflow = 'auto' }} className='px-4 h-[32px] transition duration-100 shadow-[0_0_0_1px_inset_rgba(2,0,3,.5),0_0_0_1px_transparent] hover:shadow-[0_0_0_2px_inset_rgba(2,0,3,.7),0_0_0_1px_transparent] rounded-full'><span className='text-sec text-xs font-semibold'>إلغاء</span></button>
                                                                            <button className='px-4 h-[32px] transition duration-100 bg-sec hover:bg-sec/80 rounded-full'><span className='text-white text-xs font-semibold'>تأكيد الشراء</span></button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>

            </div>
            <div className={`solid-h-auto${AutoSolid === false ? ' hide' : ' show'}`}></div>
            <div className={`void-head${AutoSolid === true ? ' scroller' : ''}`}>
            </div>
        </div >
    );
}