import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Switch, Link } from 'react-router-dom';

import axios from 'axios';


import Response_Shop from '../response/res-shop.js';

import headerApp from './appComp/header.js';
import footerApp from './appComp/footer.js';

export default function CheckOut() {

    useState(() => {
    }, []);

    const [saves, setSaves] = useState([]);
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
        document.title = 'Urensh | مركز الدفع';
        axios.get('http://192.168.1.100:5000/api/saves?at=' + getCookie('at'))
            .then((response) => {
                console.log(response.data.message);
                setSaves(response.data.message);
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="25.39px" height="18px" viewBox="0 0 25.39 18" className='icon'>
                            <g>
                                <rect className='transparent' width="25.39" height="18" />
                                <path d="M14.22,3.99c-0.06-0.72-0.66-1.27-1.38-1.27h-1.81C10.68,1.17,9.3,0,7.64,0S4.6,1.17,4.26,2.72H2.45
		c-0.72,0-1.32,0.55-1.38,1.27L0,16.49c-0.03,0.39,0.1,0.77,0.36,1.06C0.63,17.84,1,18,1.39,18h12.5c0.39,0,0.76-0.16,1.02-0.45
		c0.26-0.29,0.39-0.67,0.36-1.06L14.22,3.99z M7.64,1.39c0.88,0,1.63,0.55,1.94,1.33H5.7C6.01,1.94,6.76,1.39,7.64,1.39z
		 M1.39,16.61l1.06-12.5h1.72c0,0.38,0.31,0.69,0.69,0.69s0.69-0.31,0.69-0.69h4.17c0,0.38,0.31,0.69,0.69,0.69
		c0.38,0,0.69-0.31,0.69-0.69h1.72l1.06,12.5H1.39z"/>
                                <path d="M7.64,6.19c-2.3,0-4.17,1.87-4.17,4.17c0,2.04,1.47,3.74,3.41,4.1c0.25,0.05,0.5,0.07,0.76,0.07
		c0.26,0,0.51-0.02,0.76-0.07c1.94-0.36,3.41-2.06,3.41-4.1C11.81,8.06,9.94,6.19,7.64,6.19z M9.76,10.9L9.7,11.01l-1.2,0.7v0.98
		L8.44,12.8L7.7,13.22H7.58L6.85,12.8l-0.06-0.11v-0.98l-1.2-0.7L5.52,10.9V8.86l0.06-0.11l1.27-0.73l0.19,0.11v1.98l0.61,0.35
		l0.61-0.35V8.12l0.19-0.11L9.7,8.75l0.06,0.11V10.9z"/>
                                <path d="M25.39,9c0-0.1-0.02-0.2-0.06-0.29c-0.04-0.09-0.09-0.17-0.16-0.24L21.4,4.7c-0.29-0.29-0.77-0.29-1.06,0s-0.29,0.77,0,1.06
	l2.49,2.49h-6.19c-0.41,0-0.75,0.34-0.75,0.75s0.34,0.75,0.75,0.75h6.19l-2.49,2.49c-0.29,0.29-0.29,0.77,0,1.06
	c0.15,0.15,0.34,0.22,0.53,0.22s0.38-0.07,0.53-0.22l3.77-3.77c0.07-0.07,0.12-0.15,0.16-0.24C25.37,9.2,25.39,9.1,25.39,9z"/>
                            </g>
                        </svg>
                    </div>
                    <div className='space-10'></div>
                    <div className='Layoutlayers-text'>مركز الدفع</div>
                    <div className='uspace-10'></div>
                    <div className='solid-v-2'></div>
                    <div className='space-10'></div>
                    <button onClick={backLeft} className='icon cans-head'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon'>
                            <rect className="transparent" width="16" height="16" />
                            <path d="M12.24,14.05c0.45,0.45,0.45,1.17,0,1.62C12.01,15.89,11.72,16,11.43,16c-0.29,0-0.58-0.11-0.81-0.33L3.76,8.81
                        c-0.45-0.45-0.45-1.17,0-1.62l6.86-6.86c0.45-0.45,1.17-0.45,1.62,0c0.45,0.45,0.45,1.17,0,1.62L6.19,8L12.24,14.05z"/>
                        </svg>
                    </button>
                </div>
                <div className='solid-h-1'></div>
                <div className='Layoutlayers-content'>
                    <div className='Layoutlayers-products'>
                        {saves.map((save) => (
                            <div>
                                <Link to={`/product/${save.title}`} className='Layoutlayers-product selected'>
                                    <img className='searchResult-img' src={`/img/${save.image}.jpg`}></img>
                                    <div className='space-20'></div>
                                    <div className='searchResult-content'>
                                        <div className='searchResult-text'>{save.title}</div>
                                        <div className='searchResult-texts'>
                                            <div className='searchResult-price'><div className='product-type'>السعر</div><div className='space-5'></div>{save.price} ج.م</div>
                                            <div className='space-20'></div>
                                            <div className='searchResult-quantity'><div className='product-type'>الكمية</div><div className='space-5'></div> {save.quantity}</div>
                                        </div>
                                    </div>
                                    <div className='Layoutlayers-iconSelect'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon'>
                                            <rect className="transparent" width="16" height="16" />
                                            <circle className="icon-white" cx="8" cy="8" r="5" />
                                        </svg>
                                    </div>
                                </Link>
                                <div className='dspace-10'></div>
                            </div>
                        ))}
                    </div>
                    <div className='space-20'></div>
                    <div className='Layoutlayers-cost'>
                        <div className='Layoutlayers-bgCost'>
                            <div className='Layoutlayers-TextCost'>أجمالي الكميات<div className='space-10'></div><div className='floatCost'>8</div></div>
                            <div className='Layoutlayers-TextCost'>أجمالي السعر<div className='space-10'></div><div className='floatCost'>4129.61 ج.م</div></div>
                        </div>
                        <div className='dspace-20'></div>
                        <div className='flex'>
                            <button type='button' className='Layoutlayers-button'>المتابعة</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}