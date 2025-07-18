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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://192.168.1.100:5000/api/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            });

            const data = await response.json();

            if (response.ok) {
                if (data[0].status == true) {
                    // Success
                } else {
                    // Failed
                }
            } else {
                // Failure
            }
        } catch (err) {
            // Failure
        }
    };


    useEffect(() => {
        document.title = 'Urensh | الإعدادات';
        axios.get('http://192.168.1.100:5000/api/response?type=settings.account&at=' + getCookie('at') + '&ky=' + getCookie('ky'))
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

                        </svg>
                    </div>
                    <div className='space-10'></div>
                    <div className='Layoutlayers-text'>الإعدادات</div>
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
                        <button type='button' className='Layoutlayers-btnMenu selected'>الآمان</button>
                        <div className='space-5'></div>
                        <button type='button' className='Layoutlayers-btnMenu'>العنوان</button>
                    </div>
                    <div className='dspace-20'></div>
                    <div className='settings-layers'>
                        <div className='settings-layer'>
                            <div className='settings-content'>
                                <div className='setting-text'>الآمان</div>
                                {/* <div className='setting-description'>تغيير بيانات الحساب مثل كلمة المرور أو البريد الإلكتروني أو أسم الملف الشخصي.</div> */}
                                {/* <div className='pattern-display'>
                                    <div className='pattern'>

                                    </div>
                                </div> */}
                                {/* <div className='dspace-20'></div> */}
                                <form onSubmit={handleSubmit}>
                                    <div className='setting-type'>تغيير كلمة المرور</div>
                                    <input type='password' className='inp-setting' placeholder='كلمة المرور القديمة' />
                                    <div className='dspace-10'></div>
                                    <input type='password' className='inp-setting' placeholder='كلمة المرور الجديدة' />
                                    <div className='dspace-10'></div>
                                    <input type='password' className='inp-setting' placeholder='إعادة كلمة المرور الجديدة' />

                                    <div className='dspace-20'></div>
                                    <div className='solid-h-1'></div>
                                    <div className='dspace-20'></div>
                                    <button type='submit' className='btn-setting'>حفظ التغييرات</button>
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