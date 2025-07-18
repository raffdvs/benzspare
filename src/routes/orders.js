import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Switch, Link } from 'react-router-dom';

import axios from 'axios';
import headerApp from './appComp/header.js';
import footerApp from './appComp/footer.js';

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

export default function CheckOut() {

    useState(() => {
    }, []);

    const [orders, setOrders] = useState([]);
    const [iOrder, setiOrder] = useState([]);

    const [keywords, setKeywords] = useState([]);
    const [saveActive, setSaveActive] = useState(false);
    const [saveDisabled, setsaveDisable] = useState(false);


    const getCookie = (name) => {
        const cookies = document.cookie.split('; ');
        for (let i = 0; i < cookies.length; i++) {
            const [key, value] = cookies[i].split('=');
            if (key === name) return decodeURIComponent(value);
        }
        return null;
    };

    const backLeft = () => {
        window.history.back();
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(number);
    };

    useEffect(() => {
        document.title = 'Urensh | الطلبات';
        axios.get('http://192.168.1.100:5000/api/orders?at=' + getCookie('at'))
            .then((response) => {
                console.log(response.data.message);
                setOrders(response.data.message);
                setiOrder(response.data.iOrder);

                // setKeywords(response.data.keywords);
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
                            {/* <g>
                                <rect className='transparent' width="25.39" height="18" />
                                <path d="M14.22,3.99c-0.06-0.72-0.66-1.27-1.38-1.27h-1.81C10.68,1.17,9.3,0,7.64,0S4.6,1.17,4.26,2.72H2.45
		c-0.72,0-1.32,0.55-1.38,1.27L0,16.49c-0.03,0.39,0.1,0.77,0.36,1.06C0.63,17.84,1,18,1.39,18h12.5c0.39,0,0.76-0.16,1.02-0.45
		c0.26-0.29,0.39-0.67,0.36-1.06L14.22,3.99z M7.64,1.39c0.88,0,1.63,0.55,1.94,1.33H5.7C6.01,1.94,6.76,1.39,7.64,1.39z
		 M1.39,16.61l1.06-12.5h1.72c0,0.38,0.31,0.69,0.69,0.69s0.69-0.31,0.69-0.69h4.17c0,0.38,0.31,0.69,0.69,0.69
		c0.38,0,0.69-0.31,0.69-0.69h1.72l1.06,12.5H1.39z"/>
                                <path d="M7.64,6.19c-2.3,0-4.17,1.87-4.17,4.17c0,2.04,1.47,3.74,3.41,4.1c0.25,0.05,0.5,0.07,0.76,0.07s0.51-0.02,0.76-0.07
		c1.94-0.36,3.41-2.06,3.41-4.1C11.81,8.06,9.94,6.19,7.64,6.19z M9.76,10.9L9.7,11.01l-1.2,0.7v0.98L8.44,12.8L7.7,13.22H7.58
		L6.85,12.8l-0.06-0.11v-0.98l-1.2-0.7L5.52,10.9V8.86l0.06-0.11l1.27-0.73l0.19,0.11v1.98l0.61,0.35l0.61-0.35V8.12l0.19-0.11
		L9.7,8.75l0.06,0.11V10.9z"/>
                                <path d="M20.64,4.25c-2.62,0-4.75,2.13-4.75,4.75s2.13,4.75,4.75,4.75c2.62,0,4.75-2.13,4.75-4.75S23.27,4.25,20.64,4.25z
		 M23.25,7.85l-3,3c-0.1,0.1-0.23,0.15-0.35,0.15s-0.26-0.05-0.35-0.15l-1.5-1.5c-0.2-0.2-0.2-0.51,0-0.71s0.51-0.2,0.71,0
		l1.15,1.15l2.65-2.65c0.2-0.2,0.51-0.2,0.71,0S23.45,7.66,23.25,7.85z"/>
                            </g> */}
                            <path d="M14,0H4C1.79,0,0,1.79,0,4v10c0,2.21,1.79,4,4,4h10c2.21,0,4-1.79,4-4V4C18,1.79,16.21,0,14,0z M6.19,4.34
 c0-0.55,0.45-1,1-1h3.63c0.55,0,1,0.45,1,1v0.25c0,0.55-0.45,1-1,1H7.19c-0.55,0-1-0.45-1-1V4.34z M11.81,13.66c0,0.55-0.45,1-1,1
 H7.19c-0.55,0-1-0.45-1-1v-0.25c0-0.55,0.45-1,1-1h3.63c0.55,0,1,0.45,1,1V13.66z M14.63,9.13c0,0.55-0.45,1-1,1H4.38
 c-0.55,0-1-0.45-1-1V8.88c0-0.55,0.45-1,1-1h9.25c0.55,0,1,0.45,1,1V9.13z"></path>

                        </svg>
                    </div>
                    <div className='space-10'></div>
                    <div className='Layoutlayers-text'>الطلبات</div>
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
                    <div className='Layoutlayers-products'>
                        <div className='Layoutlayers-menu'>
                            <button type='button' className='Layoutlayers-btnMenu selected'>قيد التنفيذ</button>
                            <div className='space-5'></div>
                            <button type='button' className='Layoutlayers-btnMenu'>منفذة</button>
                            <div className='space-5'></div>
                            <button type='button' className='Layoutlayers-btnMenu'>ملغاة</button>
                        </div>
                        <div className='dspace-20'></div>
                        {orders.map((order, index) => (
                            <div>
                                <div className='Layoutlayers-date'>
                                    <div className='Layoutlayers-textDate'>
                                        {formatDate(iOrder[index].date)}
                                    </div>
                                </div>
                                <Link to={`/product/${order.title}`} className='Layoutlayers-product implemented'>
                                    <img className='searchResult-img' src={`/img/${order.image}.jpg`}></img>
                                    <div className='space-20'></div>
                                    <div className='searchResult-content'>
                                        <div className='searchResult-text'>{order.title}</div>
                                        <div className='searchResult-texts'>
                                            <div className='searchResult-price'><div className='product-type'></div><div className='space-5'></div>{iOrder[index].price} ج.م</div>
                                            <div className='space-10'></div>
                                            <div className='searchResult-quantity'><div className='product-type'>الكمية</div><div className='space-5'></div> {iOrder[index].quantity}</div>
                                        </div>
                                    </div>
                                    <div className='Layoutlayers-iconImplemented'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon'>
                                            <rect className="transparent" width="16" height="16" />
                                            {/* <circle className="icon-white" cx="8" cy="8" r="8" />
                                            <polygon className="icon-color" points="6.8,10.99 4,8.19 4.78,7.42 6.8,9.44 11.22,5.01 12,5.79 " /> */}
                                            <path className='icon-white' d="M8,0C3.58,0,0,3.58,0,8s3.58,8,8,8s8-3.58,8-8S12.42,0,8,0z M8,13c-2.76,0-5-2.24-5-5s2.24-5,5-5s5,2.24,5,5S10.76,13,8,13z
	"/>

                                        </svg>
                                    </div>
                                </Link>
                                <div className='dspace-10'></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>;
}