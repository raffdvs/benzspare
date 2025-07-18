import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Switch, Link } from 'react-router-dom';

import axios from 'axios';
import headerApp from './appComp/header.js';

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

    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

    if (differenceInDays === 0) {
        return `اليوم • ${formattedDate}`;
    } else if (differenceInDays === 1) {
        return `البارحة • ${formattedDate}`;
    } else if (differenceInDays <= 3) {
        return `منذ ${differenceInDays} أيام • ${formattedDate}`;
    } else if (differenceInWeeks === 1) {
        return `منذ أسبوع • ${formattedDate}`;
    } else if (differenceInWeeks <= 3) {
        return `منذ ${differenceInWeeks} أسابيع • ${formattedDate}`;
    } else if (differenceInMonths === 1) {
        return `منذ شهر • ${formattedDate}`;
    } else if (differenceInMonths <= 2) {
        return `منذ ${differenceInMonths} أشهر • ${formattedDate}`;
    } else {
        return `في ${formattedDate}`;
    }
}


export default function CheckOut() {



    useState(() => {
    }, []);

    const [data, setData] = useState([]);
    const [getMarks, setMarks] = useState([]);
    const [getTypes, setTypes] = useState([]);
    const [getModels, setModels] = useState([]);


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

    const backLeft = () => {
        window.history.back();
    };

    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [isOpenMark, setIsOpenMark] = useState(false);
    const [isOpenMarkResult, setIsOpenMarkResult] = useState(false);

    const [selectedMark, setSelectedMark] = useState(null);

    const [isOpenModel, setIsOpenModel] = useState(false);
    const [selectedModel, setSelectedModel] = useState(null);

    const toggleMenu = (e) => {
        handleResponse(e, 'types');
        setIsOpen(!isOpen);
    };

    const toggleMenuMark = (e) => {
        handleResponse(e, 'marks');
        setIsOpenMark(!isOpenMark);
    };

    const toggleMenuModel = (e) => {
        handleResponse(e, 'models');
        setIsOpenModel(!isOpenModel);
    };

    // دالة لاختيار العنصر
    const handleItemClick = (type, item) => {
        if (type === 0) {
            setSelectedItem(item);
            setIsOpen(false);
        }
        if (type === 1) {
            setSelectedMark(item);
            setIsOpenMark(false);
        }
        if (type === 2) {
            setSelectedModel(item);
            setIsOpenModel(false);
        }
    };

    const [imageSrc, setImageSrc] = useState(null);
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        handleFileUpload(file);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files[0];
        handleFileUpload(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDragEnter = () => {
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        quantity: '',
        type: '',
        mark_name: '',
        logo_id: '',
        model_name: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleResponse = (e, type) => {
        if (type === 'marks') {
            axios.get(`${process.env.REACT_APP_API_URL}/api/action?type=control.marks`)
                .then((response) => {
                    if (response.data.message.length != 0) {
                        setMarks(response.data.message);
                    }

                })
                .catch((error) => {
                    console.error('Error fetching:', error);
                });
        }
        if (type === 'types') {
            axios.get(`${process.env.REACT_APP_API_URL}/api/action?type=control.types`)
                .then((response) => {
                    if (response.data.message.length != 0) {
                        setTypes(response.data.message);
                    }

                })
                .catch((error) => {
                    console.error('Error fetching:', error);
                });
        }
        if (type === 'models') {
            axios.get(`${process.env.REACT_APP_API_URL}/api/action?type=control.models`)
                .then((response) => {
                    if (response.data.message.length != 0) {
                        setModels(response.data.message);
                    }

                })
                .catch((error) => {
                    console.error('Error fetching:', error);
                });
        }
    }

    const handleFileUpload = (file) => {
        if (file) {
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (validImageTypes.includes(file.type)) {
                setFileName(file.name);
                setError('');

                // استخدام FileReader لقراءة الصورة وعرضها
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImageSrc(reader.result);  // تحديث مصدر الصورة
                };
                reader.readAsDataURL(file);  // قراءة الملف كـ URL بياني
            } else {
                setError('يرجى اختيار صورة بصيغة JPG أو PNG أو GIF فقط.');
                setFileName('');
                setImageSrc(null);
            }
        }
    };

    const handleSubmit = async (e, t) => {
        e.preventDefault();
        if (t === 'control.create.product') {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/post`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ type: t, verify: { at: getCookie('at'), ky: getCookie('ky') }, data: { name: formData.name, price: formData.price, quantity: formData.quantity, type: selectedItem, mark: selectedMark, model: selectedMark } }),
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
        }

        if (t === 'control.create.type') {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/post`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ type: t, verify: { at: getCookie('at'), ky: getCookie('ky') }, data: { type: formData.type } }),
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
        }

        if (t === 'control.create.mark') {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/post`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: t, verify: { at: getCookie('at'), ky: getCookie('ky') },
                    data: {
                        mark_name: formData.mark_name, logo_id: formData.logo_id
                    }
                }),
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
        }

        if (t === 'control.create.model') {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/post`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: t, verify: { at: getCookie('at'), ky: getCookie('ky') },
                    data: {
                        model_name: formData.model_name, mark: 1
                    }
                }),
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
        }
    };


    useEffect(() => {
        document.title = 'Urensh | التحكم';
        axios.get(`${process.env.REACT_APP_API_URL}/api/response?type=settings.account&at=${getCookie('at')}&ky=${getCookie('ky')}`)
            .then((response) => {
                console.log(response.data.message);
                setData(response.data.message[0].user[0]);
            })
            .catch((error) => {
                console.error('Error fetching services:', error);
            });
    }, []);


    return <div>
        {headerApp()}
        <div className='Layoutlayers-center'>
            <div className='Layoutlayers-bground'>
                <div className='Layoutlayers-header'>
                    <div className='space-10'></div>
                    <div className='icon-h-pin-20'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className='icon'>
                            <path d="M17.1,6.82l-0.83-0.83V4.81c0-1.7-1.38-3.08-3.08-3.08h-1.18L11.17,0.9c-1.2-1.2-3.15-1.2-4.35,0L5.99,1.73H4.81
 c-1.7,0-3.08,1.38-3.08,3.08v1.18L0.9,6.82c-1.2,1.2-1.2,3.15,0,4.35l0.83,0.83v1.18c0,1.7,1.38,3.08,3.08,3.08h1.18l0.83,0.83
 C7.4,17.68,8.18,18,9,18s1.59-0.32,2.18-0.9l0.83-0.83h1.18c1.7,0,3.08-1.38,3.08-3.08v-1.18l0.83-0.83
 C18.3,9.98,18.3,8.02,17.1,6.82z M13.95,9c0,2.73-2.22,4.95-4.95,4.95S4.05,11.73,4.05,9S6.27,4.05,9,4.05S13.95,6.27,13.95,9z"></path>
                            <circle cx="9" cy="9" r="2" />

                        </svg>
                    </div>
                    <div className='space-10'></div>
                    <div className='Layoutlayers-text'>التحكم</div>
                    <div className='uspace-10'></div>
                    <div className='solid-v-2'></div>
                    <div className='space-10'></div>
                    <button onClick={backLeft} className='icon cans-head'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon'>
                            <rect className="transparent" width="16" height="16" />
                            <path d="M12.24,14.05c0.45,0.45,0.45,1.17,0,1.62C12.01,15.89,11.72,16,11.43,16c-0.29,0-0.58-0.11-0.81-0.33L3.76,8.81
                        c-0.45-0.45-0.45-1.17,0-1.62l6.86-6.86c0.45-0.45,1.17-0.45,1.62,0c0.45,0.45,0.45,1.17,0,1.62L6.19,8L12.24,14.05z"/>
                        </svg>
                        <div className='tooltip'>
                            إلي الخلف
                        </div>
                    </button>
                </div>
                <div className='solid-h-1'></div>
                <div className='Layoutlayers-content'>
                    <div className='Layoutlayers-menu'>
                        {/* <div className='setting-type'>إدارة</div>
                        <button type='button' className='Layoutlayers-btnMenu'>الطلبات</button>
                        <button type='button' className='Layoutlayers-btnMenu'>الإبلاغات</button>
                        <button type='button' className='Layoutlayers-btnMenu'>المنتجات</button>
                        <button type='button' className='Layoutlayers-btnMenu'>النوع</button>
                        <button type='button' className='Layoutlayers-btnMenu'>الماركات</button>
                        <button type='button' className='Layoutlayers-btnMenu'>الموديلات</button>
                        <div className='dspace-20'></div> */}
                        <div className='setting-type'>إضافة</div>
                        <button type='button' className='Layoutlayers-btnMenu selected'>منتج</button>
                        <button type='button' className='Layoutlayers-btnMenu'>نوع</button>
                        <button type='button' className='Layoutlayers-btnMenu'>ماركة</button>
                        <button type='button' className='Layoutlayers-btnMenu'>موديل</button>

                        <div className='dspace-20'></div>
                        <div className='setting-type'>سجل</div>
                        <button type='button' className='Layoutlayers-btnMenu'>الطلبات</button>

                    </div>
                    <div className='space-20'></div>
                    <div className='settings-layers'>
                        <div className='settings-layer'>
                            <div className='settings-content'>
                                <div className='setting-text'>إضافة منتج</div>
                                {/* <div className='setting-description'>تغيير بيانات الحساب مثل كلمة المرور أو البريد الإلكتروني أو أسم الملف الشخصي.</div> */}
                                {/* <div className='pattern-display'>
                                    <div className='pattern'>

                                    </div>
                                </div> */}
                                {/* <div className='dspace-20'></div> */}
                                <form onSubmit={(e) => handleSubmit(e, 'control.create.product')}>
                                    <div className='flex c-center'>
                                        <div>
                                            <div className='setting-type'>اسم المنتج</div>
                                            <div className='inp-dsn'>
                                                <input type='text' name='name' className='inp-dsor' placeholder='اسم المنتج'
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className='space-10'></div>
                                        <div>
                                            <div className='setting-type'>سعر المنتج</div>
                                            <div className='inp-dsn'>
                                                <input
                                                    type='text' name='price' className='inp-dsor mini' placeholder='سعر المنتج'
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='dspace-20'></div>
                                    <div className='flex c-center'>
                                        <div>
                                            <div className='setting-type'>كمية المنتج</div>
                                            <div className='inp-dsn'>
                                                <input type='text' name='quantity' className='inp-dsor' placeholder='كمية المنتج'
                                                    value={formData.quantity}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className='space-10'></div>
                                        <div>
                                            <div className='setting-type'>نوع المنتج</div>

                                            <div className="menu-container">
                                                <button type='button' onClick={toggleMenu} className="menu-button">
                                                    {selectedItem !== null && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon-grey icon-fl'>
                                                            <rect className="transparent" width="16" height="16" />
                                                            <path d="M13.68,3.72L7.42,0.1c-0.24-0.14-0.53-0.14-0.77,0L0.39,3.72C0.15,3.85,0,4.11,0,4.39v7.23c0,0.28,0.15,0.53,0.39,0.67
	l6.26,3.61C6.76,15.97,6.9,16,7.03,16s0.27-0.03,0.39-0.1l6.26-3.61c0.24-0.14,0.39-0.39,0.39-0.67V4.39
	C14.06,4.11,13.92,3.85,13.68,3.72z M11.74,4.39L7.03,7.11L2.32,4.39l4.71-2.72L11.74,4.39z M1.55,5.73l4.71,2.72v5.44l-4.71-2.72
	V5.73z"/>
                                                        </svg>
                                                    )}
                                                    {selectedItem === null && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon-grey'>
                                                            <rect className="transparent" width="16" height="16" />
                                                            <g>
                                                                <path d="M12.87,8.5c-0.41,0-0.75,0.34-0.75,0.75v1.57l-1.36,0.78c-0.36,0.21-0.48,0.67-0.27,1.02c0.14,0.24,0.39,0.38,0.65,0.38
		c0.13,0,0.26-0.03,0.37-0.1l1.73-1c0.23-0.13,0.38-0.38,0.38-0.65v-2C13.62,8.84,13.29,8.5,12.87,8.5z"/>
                                                                <path d="M13.25,3.6l-1.73-1c-0.36-0.21-0.82-0.08-1.02,0.27c-0.21,0.36-0.08,0.82,0.27,1.02l1.36,0.78v1.57
		c0,0.41,0.34,0.75,0.75,0.75s0.75-0.34,0.75-0.75v-2C13.62,3.98,13.48,3.73,13.25,3.6z"/>
                                                                <path d="M8.92,1.1l-1.73-1c-0.23-0.13-0.52-0.13-0.75,0l-1.73,1C4.35,1.31,4.22,1.77,4.43,2.12C4.64,2.48,5.1,2.61,5.46,2.4
		l1.36-0.78L8.17,2.4c0.12,0.07,0.25,0.1,0.37,0.1c0.26,0,0.51-0.13,0.65-0.38C9.4,1.77,9.28,1.31,8.92,1.1z"/>
                                                                <path d="M2.11,2.6l-1.73,1C0.14,3.73,0,3.98,0,4.25v2C0,6.66,0.34,7,0.75,7S1.5,6.66,1.5,6.25V4.68L2.86,3.9
		c0.36-0.21,0.48-0.67,0.27-1.02C2.92,2.52,2.46,2.39,2.11,2.6z"/>
                                                                <path d="M2.86,11.6L1.5,10.82V9.25c0-0.41-0.34-0.75-0.75-0.75S0,8.84,0,9.25v2c0,0.27,0.14,0.52,0.38,0.65l1.73,1
		C2.23,12.97,2.35,13,2.48,13c0.26,0,0.51-0.13,0.65-0.38C3.34,12.27,3.22,11.81,2.86,11.6z"/>
                                                                <path d="M8.17,13.1l-1.36,0.78L5.46,13.1c-0.36-0.21-0.82-0.08-1.02,0.27c-0.21,0.36-0.08,0.82,0.27,1.02l1.73,1
		c0.12,0.07,0.25,0.1,0.38,0.1s0.26-0.03,0.38-0.1l1.73-1c0.36-0.21,0.48-0.67,0.27-1.02C8.99,13.02,8.53,12.89,8.17,13.1z"/>
                                                            </g>
                                                        </svg>
                                                    )}
                                                    <div className='space-10'></div>

                                                    <div className='ml-text'>{selectedItem === null ? 'حدد نوع المنتج' : selectedItem}</div>

                                                </button>

                                                {isOpen && (
                                                    <ul className="menu-list">
                                                        <div className='menuList-content'>
                                                            {getTypes.length ?
                                                                '' :
                                                                (
                                                                    <div className='flex c-center h-center'>
                                                                        <div className="loader"></div>
                                                                    </div>
                                                                )
                                                            }
                                                            {getTypes.map((type, index) => (

                                                                <li
                                                                    className={selectedItem === type.type ? 'selected' : ''}
                                                                    onClick={() => handleItemClick(0, type.type)}
                                                                >
                                                                    <div className='tooltip'>
                                                                        {type.type}
                                                                    </div>
                                                                    <div className='ml-counter'>
                                                                        {index + 1}
                                                                    </div>
                                                                    <div className='space-5'></div>
                                                                    <div className='solid-v-2'></div>
                                                                    <div className='space-5'></div>

                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon-grey'>
                                                                        <rect className="transparent" width="16" height="16" />
                                                                        <path d="M13.68,3.72L7.42,0.1c-0.24-0.14-0.53-0.14-0.77,0L0.39,3.72C0.15,3.85,0,4.11,0,4.39v7.23c0,0.28,0.15,0.53,0.39,0.67
	l6.26,3.61C6.76,15.97,6.9,16,7.03,16s0.27-0.03,0.39-0.1l6.26-3.61c0.24-0.14,0.39-0.39,0.39-0.67V4.39
	C14.06,4.11,13.92,3.85,13.68,3.72z M11.74,4.39L7.03,7.11L2.32,4.39l4.71-2.72L11.74,4.39z M1.55,5.73l4.71,2.72v5.44l-4.71-2.72
	V5.73z"/>
                                                                    </svg>
                                                                    <div className='space-10'></div>
                                                                    <div className='ml-text'>

                                                                    {type.type}
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </div>
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                        <div className='space-10'></div>
                                        <div>
                                            <div className='setting-type'>الماركة</div>

                                            <div className="menu-container">
                                                <button type='button' onClick={toggleMenuMark} className="menu-button">
                                                    {selectedMark === 'Mercedes-Benz' && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon-grey'>
                                                            <rect className="transparent" width="16" height="16" />
                                                            <path d="M11.72,0.9C10.6,0.32,9.34,0,8,0S5.4,0.32,4.28,0.9l0,0C1.74,2.24,0,4.92,0,8s1.74,5.76,4.3,7.1C5.4,15.66,6.66,16,8,16
s2.58-0.34,3.7-0.92c2.56-1.32,4.3-4,4.3-7.08S14.26,2.24,11.72,0.9z M0.8,8c0-2.62,1.4-4.9,3.5-6.18l0,0C5.32,1.2,6.5,0.84,7.8,0.8
L6.9,7.34L4.3,9.36l0,0l-2.64,2.06C1.12,10.4,0.8,9.24,0.8,8z M11.72,14.16C10.62,14.82,9.36,15.2,8,15.2s-2.64-0.38-3.72-1.04
C3.3,13.58,2.5,12.78,1.9,11.82l2.38-0.98l0,0L8,9.32l3.72,1.5l0,0l2.4,0.98C13.52,12.78,12.68,13.58,11.72,14.16z M11.72,9.36
L11.72,9.36l-2.58-2L8.22,0.8c1.26,0.04,2.46,0.4,3.48,1.02l0,0c2.1,1.26,3.5,3.56,3.5,6.18c0,1.24-0.3,2.4-0.86,3.42L11.72,9.36z"
                                                            />
                                                        </svg>
                                                    )}
                                                    {selectedMark === null && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon-grey'>
                                                            <rect className="transparent" width="16" height="16" />
                                                            <path d="M8.02,16c-0.43,0-0.77-0.35-0.77-0.77c0-0.43,0.34-0.78,0.77-0.78c1.13,0,2.24-0.3,3.22-0.87c0.37-0.22,0.84-0.09,1.06,0.28
	c0.21,0.37,0.09,0.84-0.28,1.06C10.81,15.62,9.43,16,8.02,16C8.02,16,8.02,16,8.02,16z M4.41,15.05c-0.13,0-0.26-0.03-0.38-0.1
	c-1.21-0.7-2.23-1.7-2.94-2.91C0.88,11.67,1,11.19,1.37,10.98c0.37-0.21,0.84-0.09,1.06,0.28C3,12.23,3.82,13.04,4.8,13.6
	c0.37,0.21,0.5,0.69,0.29,1.06C4.94,14.91,4.68,15.05,4.41,15.05z M14.26,12.38c-0.13,0-0.26-0.03-0.39-0.1
	c-0.37-0.21-0.5-0.69-0.28-1.06c0.56-0.97,0.86-2.09,0.86-3.22c0-0.42,0.34-0.81,0.77-0.82C15.66,7.19,15.99,7.48,16,7.9
	c0,0,0,0.09,0,0.1c0,1.4-0.37,2.79-1.07,3.99C14.79,12.24,14.53,12.38,14.26,12.38z M0.77,8.8C0.35,8.8,0,8.47,0,8.04V8
	c0-1.39,0.36-2.75,1.04-3.95c0.21-0.37,0.68-0.5,1.06-0.29c0.37,0.21,0.5,0.68,0.29,1.06C1.84,5.78,1.55,6.88,1.55,8
	C1.55,8.43,1.2,8.8,0.77,8.8z M14.22,5.09c-0.26,0-0.52-0.14-0.67-0.38c-0.58-0.97-1.4-1.78-2.38-2.33
	c-0.37-0.21-0.5-0.68-0.29-1.05c0.21-0.37,0.68-0.5,1.05-0.29c1.22,0.69,2.24,1.69,2.95,2.89c0.22,0.37,0.1,0.84-0.27,1.06
	C14.49,5.06,14.35,5.09,14.22,5.09z M4.34,2.54c-0.27,0-0.52-0.14-0.67-0.38C3.45,1.79,3.58,1.32,3.95,1.1
	C5.15,0.39,6.53,0.01,7.93,0c0,0,0.01,0,0.01,0c0.42,0,0.77,0.34,0.77,0.77c0,0.43-0.34,0.78-0.77,0.78
	C6.81,1.56,5.7,1.87,4.73,2.44C4.61,2.51,4.47,2.54,4.34,2.54z"/>
                                                        </svg>
                                                    )}
                                                    <div className='space-10'></div>
                                                    <div className='ml-text'>
                                                        {selectedMark === null ? 'حدد الماركة' : selectedMark}
                                                    </div>

                                                </button>

                                                {isOpenMark && (
                                                    <ul className="menu-list">
                                                        {getMarks.map((mark, index) => (
                                                            <li
                                                                className={selectedMark === 'Mercedes-Benz' ? 'selected' : ''}
                                                                onClick={() => handleItemClick(1, 'Mercedes-Benz')}
                                                            >
                                                                {mark.logo_id === 1 && (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon-grey'>
                                                                        <rect className="transparent" width="16" height="16" />
                                                                        <path d="M11.72,0.9C10.6,0.32,9.34,0,8,0S5.4,0.32,4.28,0.9l0,0C1.74,2.24,0,4.92,0,8s1.74,5.76,4.3,7.1C5.4,15.66,6.66,16,8,16
                                                                s2.58-0.34,3.7-0.92c2.56-1.32,4.3-4,4.3-7.08S14.26,2.24,11.72,0.9z M0.8,8c0-2.62,1.4-4.9,3.5-6.18l0,0C5.32,1.2,6.5,0.84,7.8,0.8
                                                                L6.9,7.34L4.3,9.36l0,0l-2.64,2.06C1.12,10.4,0.8,9.24,0.8,8z M11.72,14.16C10.62,14.82,9.36,15.2,8,15.2s-2.64-0.38-3.72-1.04
                                                                C3.3,13.58,2.5,12.78,1.9,11.82l2.38-0.98l0,0L8,9.32l3.72,1.5l0,0l2.4,0.98C13.52,12.78,12.68,13.58,11.72,14.16z M11.72,9.36
                                                                L11.72,9.36l-2.58-2L8.22,0.8c1.26,0.04,2.46,0.4,3.48,1.02l0,0c2.1,1.26,3.5,3.56,3.5,6.18c0,1.24-0.3,2.4-0.86,3.42L11.72,9.36z"
                                                                        />
                                                                    </svg>
                                                                )}
                                                                <div className='space-10'></div>
                                                                {mark.mark}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {selectedMark && (
                                        <div>
                                            <div className='dspace-10'></div>
                                            <div className='flex c-center'>
                                                <div>
                                                    <div className='setting-type'>الموديل</div>

                                                    <div className="menu-container">
                                                        <button type='button' onClick={toggleMenuModel} className="menu-button">
                                                            {selectedModel !== null && (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon-grey'>
                                                                    <rect className="transparent" width="16" height="16" />
                                                                    <path d="M13.53,10.08V5.92c0.42-0.24,0.71-0.69,0.71-1.22c0-0.78-0.63-1.41-1.41-1.41c-0.26,0-0.49,0.07-0.7,0.19L8.53,1.41
	c0,0,0,0,0,0C8.53,0.63,7.9,0,7.12,0C6.34,0,5.71,0.63,5.71,1.41l-3.6,2.08C1.9,3.37,1.67,3.29,1.41,3.29C0.63,3.29,0,3.93,0,4.71
	c0,0.52,0.29,0.97,0.71,1.22v4.16C0.29,10.32,0,10.77,0,11.29c0,0.78,0.63,1.41,1.41,1.41c0.26,0,0.49-0.07,0.7-0.19l3.59,2.08
	c0,0.78,0.63,1.41,1.41,1.41c0.78,0,1.41-0.63,1.41-1.41l3.59-2.07c0.21,0.12,0.44,0.19,0.7,0.19c0.78,0,1.41-0.63,1.41-1.41
	C14.23,10.77,13.95,10.32,13.53,10.08z M8.53,8l3.59-2.07v4.14L8.53,8z M11.41,4.71L7.82,6.78V2.63L11.41,4.71L11.41,4.71z
	 M6.41,2.63v4.14L2.82,4.71v0L6.41,2.63z M5.71,8l-3.59,2.07V5.93L5.71,8z M2.82,11.29l3.59-2.07v4.14L2.82,11.29L2.82,11.29
	L2.82,11.29z M7.82,13.37V9.22l3.59,2.07l0,0L7.82,13.37z"/>
                                                                </svg>
                                                            )}
                                                            {selectedModel === null && (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon-grey'>
                                                                    <rect className="transparent" width="16" height="16" />
                                                                    <g>
                                                                        <path d="M12.87,8.5c-0.41,0-0.75,0.34-0.75,0.75v1.57l-1.36,0.78c-0.36,0.21-0.48,0.67-0.27,1.02c0.14,0.24,0.39,0.38,0.65,0.38
		c0.13,0,0.26-0.03,0.37-0.1l1.73-1c0.23-0.13,0.38-0.38,0.38-0.65v-2C13.62,8.84,13.29,8.5,12.87,8.5z"/>
                                                                        <path d="M13.25,3.6l-1.73-1c-0.36-0.21-0.82-0.08-1.02,0.27c-0.21,0.36-0.08,0.82,0.27,1.02l1.36,0.78v1.57
		c0,0.41,0.34,0.75,0.75,0.75s0.75-0.34,0.75-0.75v-2C13.62,3.98,13.48,3.73,13.25,3.6z"/>
                                                                        <path d="M8.92,1.1l-1.73-1c-0.23-0.13-0.52-0.13-0.75,0l-1.73,1C4.35,1.31,4.22,1.77,4.43,2.12C4.64,2.48,5.1,2.61,5.46,2.4
		l1.36-0.78L8.17,2.4c0.12,0.07,0.25,0.1,0.37,0.1c0.26,0,0.51-0.13,0.65-0.38C9.4,1.77,9.28,1.31,8.92,1.1z"/>
                                                                        <path d="M2.11,2.6l-1.73,1C0.14,3.73,0,3.98,0,4.25v2C0,6.66,0.34,7,0.75,7S1.5,6.66,1.5,6.25V4.68L2.86,3.9
		c0.36-0.21,0.48-0.67,0.27-1.02C2.92,2.52,2.46,2.39,2.11,2.6z"/>
                                                                        <path d="M2.86,11.6L1.5,10.82V9.25c0-0.41-0.34-0.75-0.75-0.75S0,8.84,0,9.25v2c0,0.27,0.14,0.52,0.38,0.65l1.73,1
		C2.23,12.97,2.35,13,2.48,13c0.26,0,0.51-0.13,0.65-0.38C3.34,12.27,3.22,11.81,2.86,11.6z"/>
                                                                        <path d="M8.17,13.1l-1.36,0.78L5.46,13.1c-0.36-0.21-0.82-0.08-1.02,0.27c-0.21,0.36-0.08,0.82,0.27,1.02l1.73,1
		c0.12,0.07,0.25,0.1,0.38,0.1s0.26-0.03,0.38-0.1l1.73-1c0.36-0.21,0.48-0.67,0.27-1.02C8.99,13.02,8.53,12.89,8.17,13.1z"/>
                                                                    </g>
                                                                </svg>
                                                            )}
                                                            <div className='space-10'></div>
                                                            <div className='ml-text'>
                                                            {selectedModel === null ? 'حدد الموديل' : selectedModel}
                                                            </div>
                                                        </button>

                                                        {isOpenModel && (
                                                            <ul className="menu-list">
                                                                {getModels.map((model, index) => (
                                                                    <li
                                                                        className={selectedModel === model.model ? 'selected' : ''}
                                                                        onClick={() => handleItemClick(2, model.model)}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon-grey'>
                                                                            <rect className="transparent" width="16" height="16" />
                                                                            <path d="M13.53,10.08V5.92c0.42-0.24,0.71-0.69,0.71-1.22c0-0.78-0.63-1.41-1.41-1.41c-0.26,0-0.49,0.07-0.7,0.19L8.53,1.41
	c0,0,0,0,0,0C8.53,0.63,7.9,0,7.12,0C6.34,0,5.71,0.63,5.71,1.41l-3.6,2.08C1.9,3.37,1.67,3.29,1.41,3.29C0.63,3.29,0,3.93,0,4.71
	c0,0.52,0.29,0.97,0.71,1.22v4.16C0.29,10.32,0,10.77,0,11.29c0,0.78,0.63,1.41,1.41,1.41c0.26,0,0.49-0.07,0.7-0.19l3.59,2.08
	c0,0.78,0.63,1.41,1.41,1.41c0.78,0,1.41-0.63,1.41-1.41l3.59-2.07c0.21,0.12,0.44,0.19,0.7,0.19c0.78,0,1.41-0.63,1.41-1.41
	C14.23,10.77,13.95,10.32,13.53,10.08z M8.53,8l3.59-2.07v4.14L8.53,8z M11.41,4.71L7.82,6.78V2.63L11.41,4.71L11.41,4.71z
	 M6.41,2.63v4.14L2.82,4.71v0L6.41,2.63z M5.71,8l-3.59,2.07V5.93L5.71,8z M2.82,11.29l3.59-2.07v4.14L2.82,11.29L2.82,11.29
	L2.82,11.29z M7.82,13.37V9.22l3.59,2.07l0,0L7.82,13.37z"/>
                                                                        </svg>
                                                                        <div className='space-10'></div>
                                                                        {model.model}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className='dspace-10'></div>
                                    <div className='setting-type'>صورة المنتج 128x128</div>
                                    <div>
                                        <div
                                            className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            onDragEnter={handleDragEnter}
                                            onDragLeave={handleDragLeave}
                                        >

                                            {imageSrc ? (

                                                <div className="image-preview">
                                                    <div>
                                                        <img src={imageSrc} alt="Uploaded Preview" className="preview-image" />
                                                        <input
                                                            type="file"
                                                            id="myFile"
                                                            accept="image/*"
                                                            style={{ display: 'none' }}
                                                            onChange={handleFileChange}
                                                        />
                                                        <label htmlFor="myFile" className="custom-file-upload">
                                                            تغيير
                                                        </label>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="64px" height="64px" viewBox="0 0 64 64" className='icon-grey'>
                                                        <rect className="transparent" width="64" height="64" />
                                                        <path d="M45.29,23.43l-12.52-7.23c-0.48-0.28-1.07-0.28-1.55,0l-12.52,7.23c-0.48,0.28-0.77,0.79-0.77,1.34v14.45
	c0,0.55,0.3,1.06,0.77,1.34l12.52,7.23C31.47,47.93,31.73,48,32,48s0.53-0.07,0.77-0.21l12.52-7.23c0.48-0.28,0.77-0.79,0.77-1.34
	V24.77C46.06,24.22,45.77,23.71,45.29,23.43z M41.42,24.77L32,30.21l-9.42-5.44L32,19.34L41.42,24.77z M21.03,27.46l9.42,5.44v10.88
	l-9.42-5.44V27.46z"/>
                                                        <path d="M50,64H14C6.28,64,0,57.72,0,50V14C0,6.28,6.28,0,14,0h36c7.72,0,14,6.28,14,14v36C64,57.72,57.72,64,50,64z M14,4
	C8.49,4,4,8.49,4,14v36c0,5.51,4.49,10,10,10h36c5.51,0,10-4.49,10-10V14c0-5.51-4.49-10-10-10H14z"/>
                                                    </svg>
                                                    <p>اسحب الصورة هنا</p>
                                                    <div className='space-5'></div>
                                                    <input
                                                        type="file"
                                                        id="myFile"
                                                        accept="image/*"
                                                        style={{ display: 'none' }}
                                                        onChange={handleFileChange}
                                                    />
                                                    <label htmlFor="myFile" className="custom-file-upload">
                                                        اختر صورة
                                                    </label>
                                                </div>
                                            )}
                                        </div>

                                        {error && <p className="error-message">{error}</p>}
                                    </div>


                                    <div className='dspace-20'></div>
                                    <div className='solid-h-1'></div>
                                    <div className='dspace-20'></div>
                                    <button type='submit' className='btn-setting'>تنفيذ الأمر</button>
                                </form>
                            </div>
                        </div>

                        <div className='settings-layer hide'>
                            <div className='settings-content'>
                                <div className='setting-text'>إضافة نوع</div>
                                {/* <div className='setting-description'>تغيير بيانات الحساب مثل كلمة المرور أو البريد الإلكتروني أو أسم الملف الشخصي.</div> */}
                                {/* <div className='pattern-display'>
                                    <div className='pattern'>

                                    </div>
                                </div> */}
                                {/* <div className='dspace-20'></div> */}
                                <form onSubmit={(e) => handleSubmit(e, 'control.create.type')}>
                                    <div className='flex c-center'>
                                        <div>
                                            <div className='setting-type'>اسم النوع</div>
                                            <div className='inp-dsn'>
                                                <input type='text' name='type' className='inp-dsor' placeholder='اسم النوع'
                                                    value={formData.type}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='dspace-20'></div>
                                    <div className='solid-h-1'></div>
                                    <div className='dspace-20'></div>
                                    <button type='submit' className='btn-setting'>تنفيذ الأمر</button>
                                </form>
                            </div>
                        </div>

                        <div className='settings-layer hide'>
                            <div className='settings-content'>
                                <div className='setting-text'>إضافة ماركة</div>
                                {/* <div className='setting-description'>تغيير بيانات الحساب مثل كلمة المرور أو البريد الإلكتروني أو أسم الملف الشخصي.</div> */}
                                {/* <div className='pattern-display'>
                                    <div className='pattern'>

                                    </div>
                                </div> */}
                                {/* <div className='dspace-20'></div> */}
                                <form onSubmit={(e) => handleSubmit(e, 'control.create.mark')}>
                                    <div className='flex c-center'>
                                        <div>
                                            <div className='setting-type'>اسم الماركة</div>
                                            <input type='text' name='mark_name' className='inp-setting' placeholder='اسم الماركة'
                                                value={formData.mark_name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className='space-10'></div>
                                        <div>
                                            <div className='setting-type'>شعار الماركة</div>
                                            <input type='text' name='logo_id' className='inp-setting mini' placeholder='رقم شعار الماركة'
                                                value={formData.logo_id}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className='dspace-20'></div>
                                    <div className='solid-h-1'></div>
                                    <div className='dspace-20'></div>
                                    <button type='submit' className='btn-setting'>تنفيذ الأمر</button>
                                </form>
                            </div>
                        </div>

                        <div className='settings-layer hide'>
                            <div className='settings-content'>
                                <div className='setting-text'>إضافة موديل</div>
                                {/* <div className='setting-description'>تغيير بيانات الحساب مثل كلمة المرور أو البريد الإلكتروني أو أسم الملف الشخصي.</div> */}
                                {/* <div className='pattern-display'>
                                    <div className='pattern'>

                                    </div>
                                </div> */}
                                {/* <div className='dspace-20'></div> */}
                                <form onSubmit={(e) => handleSubmit(e, 'control.create.model')}>
                                    <div className='flex c-center'>

                                        <div>
                                            <div className='setting-type'>اسم الموديل</div>
                                            <input type='text' name='model_name' className='inp-setting' placeholder='اسم الموديل'
                                                value={formData.model_name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className='space-10'></div>
                                        <div>
                                            <div className='setting-type'>الماركة</div>

                                            <div className="menu-container">
                                                <button type='button' onClick={toggleMenuMark} className="menu-button">
                                                    {selectedMark === 'Mercedes-Benz' && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon-grey'>
                                                            <rect className="transparent" width="16" height="16" />
                                                            <path d="M11.72,0.9C10.6,0.32,9.34,0,8,0S5.4,0.32,4.28,0.9l0,0C1.74,2.24,0,4.92,0,8s1.74,5.76,4.3,7.1C5.4,15.66,6.66,16,8,16
s2.58-0.34,3.7-0.92c2.56-1.32,4.3-4,4.3-7.08S14.26,2.24,11.72,0.9z M0.8,8c0-2.62,1.4-4.9,3.5-6.18l0,0C5.32,1.2,6.5,0.84,7.8,0.8
L6.9,7.34L4.3,9.36l0,0l-2.64,2.06C1.12,10.4,0.8,9.24,0.8,8z M11.72,14.16C10.62,14.82,9.36,15.2,8,15.2s-2.64-0.38-3.72-1.04
C3.3,13.58,2.5,12.78,1.9,11.82l2.38-0.98l0,0L8,9.32l3.72,1.5l0,0l2.4,0.98C13.52,12.78,12.68,13.58,11.72,14.16z M11.72,9.36
L11.72,9.36l-2.58-2L8.22,0.8c1.26,0.04,2.46,0.4,3.48,1.02l0,0c2.1,1.26,3.5,3.56,3.5,6.18c0,1.24-0.3,2.4-0.86,3.42L11.72,9.36z"
                                                            />
                                                        </svg>
                                                    )}
                                                    {selectedMark === null && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon-grey'>
                                                            <rect className="transparent" width="16" height="16" />
                                                            <path d="M8.02,16c-0.43,0-0.77-0.35-0.77-0.77c0-0.43,0.34-0.78,0.77-0.78c1.13,0,2.24-0.3,3.22-0.87c0.37-0.22,0.84-0.09,1.06,0.28
	c0.21,0.37,0.09,0.84-0.28,1.06C10.81,15.62,9.43,16,8.02,16C8.02,16,8.02,16,8.02,16z M4.41,15.05c-0.13,0-0.26-0.03-0.38-0.1
	c-1.21-0.7-2.23-1.7-2.94-2.91C0.88,11.67,1,11.19,1.37,10.98c0.37-0.21,0.84-0.09,1.06,0.28C3,12.23,3.82,13.04,4.8,13.6
	c0.37,0.21,0.5,0.69,0.29,1.06C4.94,14.91,4.68,15.05,4.41,15.05z M14.26,12.38c-0.13,0-0.26-0.03-0.39-0.1
	c-0.37-0.21-0.5-0.69-0.28-1.06c0.56-0.97,0.86-2.09,0.86-3.22c0-0.42,0.34-0.81,0.77-0.82C15.66,7.19,15.99,7.48,16,7.9
	c0,0,0,0.09,0,0.1c0,1.4-0.37,2.79-1.07,3.99C14.79,12.24,14.53,12.38,14.26,12.38z M0.77,8.8C0.35,8.8,0,8.47,0,8.04V8
	c0-1.39,0.36-2.75,1.04-3.95c0.21-0.37,0.68-0.5,1.06-0.29c0.37,0.21,0.5,0.68,0.29,1.06C1.84,5.78,1.55,6.88,1.55,8
	C1.55,8.43,1.2,8.8,0.77,8.8z M14.22,5.09c-0.26,0-0.52-0.14-0.67-0.38c-0.58-0.97-1.4-1.78-2.38-2.33
	c-0.37-0.21-0.5-0.68-0.29-1.05c0.21-0.37,0.68-0.5,1.05-0.29c1.22,0.69,2.24,1.69,2.95,2.89c0.22,0.37,0.1,0.84-0.27,1.06
	C14.49,5.06,14.35,5.09,14.22,5.09z M4.34,2.54c-0.27,0-0.52-0.14-0.67-0.38C3.45,1.79,3.58,1.32,3.95,1.1
	C5.15,0.39,6.53,0.01,7.93,0c0,0,0.01,0,0.01,0c0.42,0,0.77,0.34,0.77,0.77c0,0.43-0.34,0.78-0.77,0.78
	C6.81,1.56,5.7,1.87,4.73,2.44C4.61,2.51,4.47,2.54,4.34,2.54z"/>
                                                        </svg>
                                                    )}
                                                    <div className='space-10'></div>
                                                    {selectedMark === null ? 'حدد نوع الماركة' : selectedMark}
                                                </button>

                                                {isOpenMark && (
                                                    <ul className="menu-list">
                                                        {getMarks.map((mark, index) => (
                                                            <li
                                                                className={selectedMark === 'Mercedes-Benz' ? 'selected' : ''}
                                                                onClick={() => handleItemClick(1, 'Mercedes-Benz')}
                                                            >
                                                                {mark.logo_id === 1 && (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon-grey'>
                                                                        <rect className="transparent" width="16" height="16" />
                                                                        <path d="M11.72,0.9C10.6,0.32,9.34,0,8,0S5.4,0.32,4.28,0.9l0,0C1.74,2.24,0,4.92,0,8s1.74,5.76,4.3,7.1C5.4,15.66,6.66,16,8,16
                                                                s2.58-0.34,3.7-0.92c2.56-1.32,4.3-4,4.3-7.08S14.26,2.24,11.72,0.9z M0.8,8c0-2.62,1.4-4.9,3.5-6.18l0,0C5.32,1.2,6.5,0.84,7.8,0.8
                                                                L6.9,7.34L4.3,9.36l0,0l-2.64,2.06C1.12,10.4,0.8,9.24,0.8,8z M11.72,14.16C10.62,14.82,9.36,15.2,8,15.2s-2.64-0.38-3.72-1.04
                                                                C3.3,13.58,2.5,12.78,1.9,11.82l2.38-0.98l0,0L8,9.32l3.72,1.5l0,0l2.4,0.98C13.52,12.78,12.68,13.58,11.72,14.16z M11.72,9.36
                                                                L11.72,9.36l-2.58-2L8.22,0.8c1.26,0.04,2.46,0.4,3.48,1.02l0,0c2.1,1.26,3.5,3.56,3.5,6.18c0,1.24-0.3,2.4-0.86,3.42L11.72,9.36z"
                                                                        />
                                                                    </svg>
                                                                )}
                                                                <div className='space-10'></div>
                                                                {mark.mark}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className='dspace-20'></div>
                                    <div className='solid-h-1'></div>
                                    <div className='dspace-20'></div>
                                    <button type='submit' className='btn-setting'>تنفيذ الأمر</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='dspace-20'></div>
    </div>;
}


// import React, { useState } from 'react';
// import Response_Shop from '../response/res-shop.js';

// import headerApp from './appComp/header.js';
// import footerApp from './appComp/footer.js';

// export default function Settings() {
//     useState(() => {
//         document.title = 'الإعدادات | ورشه';
//     }, []);


//     return <div>
//         {headerApp()}
//         <div className='settingList'>
//             <div className='sm-fwdh'>
//                 <div className='settings-sections'>
//                     <div className='btns-sections'>
//                         <button className='btn-menuSection selected'>
//                             <div className='me-split'></div>
//                             <div className='space-10'></div>
//                             <div className='icon-pin'>
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className='icon'>
//                                     <rect className='transparent' width="18" height="18" />

//                                     <path d="M12.31,18H5.69c-1.79,0-3.24-1.45-3.24-3.24v0c0-1.79,1.45-3.24,3.24-3.24h6.62c1.79,0,3.24,1.45,3.24,3.24v0
// 	C15.55,16.55,14.1,18,12.31,18z M9,0C6.73,0,4.88,1.84,4.88,4.12S6.73,8.24,9,8.24s4.12-1.84,4.12-4.12S11.27,0,9,0z"/>
//                                 </svg>
//                             </div>
//                             <div className='space-10'></div>
//                             إعدادات الحساب
//                         </button>
//                     </div>
//                 </div>
//             </div>
//             <div className='settings-layers'>
//                 <div className='settings-layer'>
//                     <div className='settings-content'>
//                         <div className='setting-text'>إعدادات الحساب</div>
//                         <div className='setting-description'>تغيير بيانات الحساب مثل كلمة المرور أو البريد الإلكتروني أو أسم الملف الشخصي.</div>
//                         <div className='pattern-display'>
//                             <div className='pattern'>

//                             </div>
//                         </div>
//                         <div className='dspace-20'></div>
//                         <form>
//                             <div className='setting-type'>تغيير أسم العرض</div>
//                             <input type='text' className='inp-setting' value='علي محمد' placeholder='البريد الإلكتروني الجديد' />
//                             <div className='dspace-20'></div>
//                             <div className='solid-h-1'></div>
//                             <div className='dspace-20'></div>
//                             <div className='setting-type'>تغيير البريد الإلكتروني</div>
//                             <input type='text' className='inp-setting' value='test@test.com' placeholder='البريد الإلكتروني الجديد' />
//                             <div className='dspace-20'></div>
//                             <div className='solid-h-1'></div>
//                             <div className='dspace-20'></div>
//                             <div className='setting-type'>تغيير كلمة المرور</div>
//                             <input type='password' className='inp-setting' placeholder='كلمة المرور القديمة' />
//                             <div className='dspace-20'></div>
//                             <div className='solid-h-1'></div>
//                             <div className='dspace-20'></div>
//                             <input type='password' className='inp-setting' placeholder='كلمة المرور الجديدة' />
//                             <div className='dspace-10'></div>
//                             <input type='password' className='inp-setting' placeholder='إعادة كلمة المرور الجديدة' />

//                             <div className='dspace-20'></div>
//                             <div className='solid-h-1'></div>
//                             <div className='dspace-20'></div>
//                             <button type='submit' className='btn-setting'>حفظ التغييرات</button>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>;
// }