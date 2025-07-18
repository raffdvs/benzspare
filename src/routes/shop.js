
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Response_Shop from '.././response/res-shop';

import headerApp from './appComp/header.js';
import footerApp from './appComp/footer.js';

import { AppContext } from "./../AppContext";


export default function Shop() {
    const [count, setCount] = useState([]);
    const [arrangement, setarrangement] = useState(false);
    const [saveDisabled, setsaveDisable] = useState(false);

    const [state, setState] = useState(false);

    useState(() => {
        document.title = `${process.env.REACT_APP_NAME} | المتجر`;
    }, []);

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

    const [inputValue, setInputValue] = useState("");

    // دالة لتقريب الرقم إلى أقرب ألف
    const roundToNearestThousand = (value) => {
        const number = parseInt(value.replace(/,/g, ""), 10); // إزالة الفواصل وتحويل إلى رقم
        if (isNaN(number)) return ""; // إذا لم تكن القيمة رقمًا، ارجع بسلسلة فارغة
        const rounded = Math.round(number / 1000) * 1000; // تقريب الرقم إلى أقرب ألف
        return new Intl.NumberFormat("en-US").format(rounded); // تنسيق الرقم بالفواصل
    };

    const handleInputChange = (e) => {
        const value = e.target.value; // الحصول على قيمة الإدخال
        const formattedValue = roundToNearestThousand(value); // تقريب وتنسيق الرقم
        setInputValue(formattedValue); // تحديث حقل الإدخال
    };

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/shop?at=${getCookie('at')}`)
            .then((response) => {
                setCount({ count: response.data.products.length });
                setServices(response.data.products);
            })
            .catch((error) => {
                console.error('Error fetching services:', error);
            });
    }, []);

    const [services, setServices] = useState([]);

    const [getMarks, setMarks] = useState([]);
    const [getTypes, setTypes] = useState([]);
    const [getModels, setModels] = useState([]);

    const [isOpenFilter, setIsOpenFilter] = useState(false);


    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [isOpenMark, setIsOpenMark] = useState(false);
    const [isOpenMarkResult, setIsOpenMarkResult] = useState(false);

    const [selectedMark, setSelectedMark] = useState(null);

    const [isOpenModel, setIsOpenModel] = useState(false);
    const [selectedModel, setSelectedModel] = useState(null);


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

    const defaultFilter = (type, item) => {
        setSelectedItem(null);
        setSelectedMark(null);
        setSelectedModel(null);

    };

    const toggleFilter = () => {
        if (!isOpenFilter) {
            document.body.style.overflow = 'hidden';
            setIsOpen(false);
            setIsOpenMark(false);
            setIsOpenModel(false);

        } else {
            document.body.style.overflow = 'auto';
        }
        setIsOpenFilter(!isOpenFilter);
    };

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

    const handleResponse = (e, type) => {
        if (type === 'marks') {
            axios.get('http://192.168.1.100:5000/api/action?type=control.marks')
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
            axios.get('http://192.168.1.100:5000/api/action?type=control.types')
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
            axios.get('http://192.168.1.100:5000/api/action?type=control.models')
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

    const applyFilter = async (t, m, ml, e) => {
        e.preventDefault();
        const response = await fetch("http://192.168.1.100:5000/api/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ type: 'shop.filter.products', data: { mark: 1, model: 1, type: 1 } }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log(data);
            setCount({ count: data.products.length });
            setServices(data.products);
            setState(true);
            setIsOpenFilter(!isOpenFilter);
        } else {
            // Failure
        }
    }


    return <div>
        {headerApp()}

        <div className='p-2'>

            <div className='list-section'>
                {/* <div className='sm-fwdh'>
                    <div className='search-quickly'>
                        <div className='sm-text'>الفرز السريع</div>

                        <div className='sq-type'>تخصيص السعر</div>
                        <div className='sq-price'>
                            <input type='number' min={0} max={1000} onChange={handleInputChange}
                                className='ip-price' placeholder='0'></input>
                            <div className='space-10'></div>
                            <div className='solid-v-2'></div>
                            <div className='space-10'></div>
                            <input type='number' min={1000} max={999999} className='ip-price' placeholder='999,999'></input>
                        </div>
                        <div className='dspace-20'></div>
                        <div className='sq-type'>تخصيص الكلمات المفتاحية
                        </div>
                        <div className='sq-keywords'>
                            <button className='btn-keywords'>إضافة</button>
                            <div className='space-10'></div>
                            <div className='solid-v-2'></div>
                            <div className='space-10'></div>
                            <div className='keyword'>لا شيئ</div>
                        </div>
                        <div className='sq-down'>
                            <button className='btn-sq'>تطبيق</button>
                        </div>
                    </div>
                    <div className='dspace-20'></div>
                    <div className='adBox'>
                        <div className='adsgrid'>
                            <div className='adBox-text'>إعلانات</div>

                            <img className='adImage' src='/img/ads.gif' />
                        </div>
                    </div>
                </div>
                <div className='space-20'></div> */}
                <div className='list-products'>
                    <div className='flex items-center justify-between w-full h-[48px] px-2'>
                        <div>
                            <button className='btn-filter flex relative space-x-2 space-x-reverse' onClick={toggleFilter}>

                                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon-grey'>
                                    <rect className="transparent" width="16" height="16" />
                                    <path d="M15.86,1.08C15.59,0.42,14.96,0,14.25,0H1.75C1.04,0,0.41,0.42,0.14,1.08S0.02,2.49,0.52,2.99l4.55,4.55v4.81
	c0,0.58,0.29,1.14,0.78,1.46l2.38,1.58c0.29,0.19,0.62,0.3,0.97,0.3c0.28,0,0.57-0.07,0.82-0.21c0.57-0.3,0.92-0.9,0.92-1.54v-6.4
	l4.55-4.55C15.99,2.49,16.14,1.74,15.86,1.08z M14.35,1.86L9.57,6.64C9.42,6.79,9.34,6.99,9.34,7.21v6.72c0,0.06-0.02,0.1-0.08,0.13
	c-0.05,0.02-0.1,0.02-0.15-0.01l-2.38-1.58c-0.04-0.02-0.06-0.07-0.06-0.13V7.21c0-0.22-0.09-0.42-0.23-0.57L1.65,1.86
	C1.62,1.84,1.58,1.78,1.62,1.7c0.03-0.1,0.11-0.1,0.14-0.1h12.5c0.02,0,0.1,0,0.14,0.1C14.42,1.78,14.38,1.84,14.35,1.86z"/>

                                </svg>
                                <span>
                                    تصفية
                                </span>
                                {/* <div className='space-10'></div>
                            <div className='solid-v-2'></div>

                            <div className='space-10'></div>

                            <div className={`status-filter${state ? ' actived' : ''}`} >{state ? 'مفعل' : 'غير مفعل'}</div> */}
                            </button>
                        </div>

                        <div>
                            <button className='icon cans selected' title='فرز جانبي' disabled>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20" className='icon'>
                                    <path d="M6,8H3C1.9,8,1,7.1,1,6V3c0-1.1,0.9-2,2-2h3c1.1,0,2,0.9,2,2v3C8,7.1,7.1,8,6,8z M6,12H3c-1.1,0-2,0.9-2,2v3
	c0,1.1,0.9,2,2,2h3c1.1,0,2-0.9,2-2v-3C8,12.9,7.1,12,6,12z M17,12h-3c-1.1,0-2,0.9-2,2v3c0,1.1,0.9,2,2,2h3c1.1,0,2-0.9,2-2v-3
	C19,12.9,18.1,12,17,12z M17,1h-3c-1.1,0-2,0.9-2,2v3c0,1.1,0.9,2,2,2h3c1.1,0,2-0.9,2-2V3C19,1.9,18.1,1,17,1z"/>


                                </svg>


                            </button>
                        </div>
                    </div>
                    {isOpenFilter && (
                        <div className={`popupLayout`}>
                            <div className='popupLayout-bgd'>
                                <div className='popupLayout-head'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className='icon icon-pin'>
                                        <rect className="transparent" width="18" height="18" />
                                        <path d="M17.85,1.22C17.54,0.48,16.83,0,16.03,0H1.97c-0.8,0-1.51,0.48-1.82,1.22C-0.16,1.95,0.01,2.8,0.58,3.36L5.7,8.48v5.41
c0,0.66,0.33,1.27,0.88,1.64l2.67,1.78c0.33,0.22,0.71,0.33,1.09,0.33c0.32,0,0.64-0.08,0.93-0.23c0.64-0.34,1.04-1.01,1.04-1.73
V8.48l5.12-5.12C17.99,2.8,18.16,1.95,17.85,1.22z M16.15,2.09l-5.38,5.38c-0.17,0.17-0.26,0.4-0.26,0.64v7.56
c0,0.07-0.03,0.12-0.09,0.15c-0.06,0.03-0.12,0.03-0.17-0.01l-2.67-1.78C7.53,14,7.5,13.94,7.5,13.89V8.11
c0-0.24-0.09-0.47-0.26-0.64L1.85,2.09C1.83,2.07,1.77,2.01,1.81,1.9c0.04-0.1,0.13-0.1,0.16-0.1h14.06c0.03,0,0.11,0,0.16,0.1
C16.23,2.01,16.17,2.07,16.15,2.09z"/>
                                    </svg>
                                    <div className='space-10'></div>
                                    <div className='popupLayout-btex'>تصفية</div>
                                    <div className='uspace-10'></div>
                                    <button onClick={defaultFilter} className='icon cans-head'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon'>
                                            <rect className='transparent' width="16" height="16" />
                                            <path d="M15.08,0.54l-1.27,2.05c-0.04-0.09-0.09-0.17-0.16-0.24C12.15,0.83,10.14,0,8,0C3.59,0,0,3.59,0,8s3.59,8,8,8
c2.14,0,4.15-0.83,5.66-2.34c0.35-0.35,0.35-0.91,0-1.26s-0.91-0.35-1.26,0c-1.18,1.18-2.74,1.82-4.4,1.82
c-3.43,0-6.22-2.79-6.22-6.22S4.57,1.78,8,1.78c1.66,0,3.22,0.65,4.4,1.82c0.06,0.06,0.14,0.1,0.22,0.14l-1.94,1.2
c-0.42,0.26-0.24,0.91,0.26,0.91h4.57c0.27,0,0.49-0.22,0.49-0.49V0.8C16,0.3,15.35,0.11,15.08,0.54z"/>
                                        </svg>
                                        <div className='tooltip'>
                                            إعادة من جديد
                                        </div>
                                    </button>
                                    <div className='space-10'></div>
                                    <div className='solid-v-2'></div>
                                    <div className='space-10'></div>
                                    <button onClick={toggleFilter} className='icon cans-head'>
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
                                <div className='solid-h-1'></div>
                                <div className='pgd-4 ovlw-auto hig-100'>
                                    <div className='pgd-4'>
                                        <div className='setting-type'>نوع المنتج</div>

                                        <div className="menu-container">
                                            <button type='button' onClick={toggleMenu} className="menu-button-second">
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
                                    <div className='dspace-10'></div>
                                    <div className='pgd-4'>
                                        <div className='setting-type'>الماركة</div>

                                        <div className="menu-container">
                                            <button type='button' onClick={toggleMenuMark} className="menu-button-second">
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
                                                    <div className='menuList-content'>
                                                        {getMarks.length ?
                                                            '' :
                                                            (
                                                                <div className='flex c-center h-center'>
                                                                    <div className="loader"></div>
                                                                </div>
                                                            )
                                                        }
                                                        {getMarks.map((mark, index) => (
                                                            <li
                                                                className={selectedMark === 'Mercedes-Benz' ? 'selected' : ''}
                                                                onClick={() => handleItemClick(1, 'Mercedes-Benz')}
                                                            >
                                                                <div className='tooltip'>
                                                                    {mark.mark}
                                                                </div>
                                                                <div className='ml-counter'>
                                                                    {index + 1}
                                                                </div>
                                                                <div className='space-5'></div>
                                                                <div className='solid-v-2'></div>
                                                                <div className='space-5'></div>

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
                                                    </div>
                                                </ul>
                                            )}
                                        </div>

                                    </div>
                                    <div className='dspace-10'></div>
                                    {selectedMark && (
                                        <div className='pgd-4'>
                                            <div>
                                                <div className='setting-type'>الموديل</div>

                                                <div className="menu-container">
                                                    <button type='button' onClick={toggleMenuModel} className="menu-button-second">
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
                                                            <div className='menuList-content'>
                                                                {getModels.length ?
                                                                    '' :
                                                                    (
                                                                        <div className='flex c-center h-center'>
                                                                            <div className="loader"></div>
                                                                        </div>
                                                                    )
                                                                }
                                                                {getModels.map((model, index) => (
                                                                    <li
                                                                        className={selectedModel === model.model ? 'selected' : ''}
                                                                        onClick={() => handleItemClick(2, model.model)}
                                                                    >
                                                                        <div className='tooltip'>
                                                                            {model.model}
                                                                        </div>
                                                                        <div className='ml-counter'>
                                                                            {index + 1}
                                                                        </div>
                                                                        <div className='space-5'></div>
                                                                        <div className='solid-v-2'></div>
                                                                        <div className='space-5'></div>
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
                                                            </div>
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className='filter-btnsFilter'>
                                        <button className='filter-btnFilter' onClick={(e) => applyFilter(selectedItem, selectedMark, selectedModel, e)} disabled={!selectedItem || !selectedMark || !selectedModel ? true : false}>تطبيق</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className='products-display'>

                        <div className={`products py-2 ${arrangement === true ? 'vertical' : 'horizontal'}`}>
                            {services.map((service) => (
                                <div className=''>
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
                                </div>
                            ))}

                        </div>

                    </div>


                </div>
            </div>
        </div>

        {footerApp()}

    </div>;
}