import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Switch, Link } from 'react-router-dom';

import axios from 'axios';


import Response_Shop from '../response/res-shop.js';

import headerApp from './appComp/header.js';
import footerApp from './appComp/footer.js';

export default function Product() {

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
        document.title = 'العناصر المحفوظة | Urensh';
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
        <div className='LayoutSaves-center'>
            <div className='LayoutSaves-bground'>
                <div className='layoutSaves-header'>
                <div className='space-10'></div>
                    <div className='icon-pin-20'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className='icon'>
                            <rect className='transparent' width="18" height="18" />
                            <path d="M15.44,0H2.56C1.84,0,1.27,0.58,1.27,1.29v15.42c0,1.07,1.23,1.67,2.08,1.02l4.87-3.76c0.46-0.36,1.11-0.36,1.58,0
	l4.87,3.76c0.85,0.66,2.08,0.05,2.08-1.02V1.29C16.73,0.58,16.16,0,15.44,0z M14.74,3.67c0,0.6-0.49,1.09-1.09,1.09H4.36
	c-0.6,0-1.09-0.49-1.09-1.09V3.35c0-0.6,0.49-1.09,1.09-1.09h9.28c0.6,0,1.09,0.49,1.09,1.09V3.67z"/>

                        </svg>
                    </div>
                    <div className='space-10'></div>
                    <div className='layoutSaves-text'>المحفوظات</div>
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
                <div className='layoutSaves-content'>
                    {saves.map((save) => (
                        <div>
                            <Link to={`/product/${save.title}`} className='search-result'>
                                <img className='searchResult-img' src={`/img/${save.image}.jpg`}></img>
                                <div className='space-20'></div>
                                <div className='searchResult-content'>
                                    <div className='searchResult-text'>{save.title}</div>
                                    <div className='searchResult-texts'>
                                        <div className='searchResult-price'><div className='product-type'>السعر</div><div className='space-10'></div>{save.price} ج.م</div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>;
}