import React, { useState, useEffect } from 'react';
import QRCode from "react-qr-code";
import { Link } from 'react-router-dom';


export default function SignIn() {
    const [showPage, setShowPage] = useState(false);

    const getCookie = (name) => {
        const cookies = document.cookie.split('; ');
        for (let i = 0; i < cookies.length; i++) {
            const [key, value] = cookies[i].split('=');
            if (key === name) return decodeURIComponent(value);
        }
        return null;
    };

    function deleteCookie(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    }


    // const [TokenStatus, setTokenStatus] = useState(false);
    const userID = localStorage.getItem('userData');
    const data = JSON.parse(userID);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // مدة صلاحية الكوكي
        const expires = "expires=" + date.toUTCString();
        document.cookie = `${name}=${value}; ${expires}; path=/`;
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const [SubmitStatus, setSumbitStatus] = useState(false);
    const [passwordType, setPasswordType] = useState("password");

    const togglePasswordVisibility = () => {
        setPasswordType((prevType) => (prevType === "password" ? "text" : "password"));
    };

    var showhideStatus = false;
    const showHideChange = async (e) => {
        e.preventDefault();
        if (showhideStatus == false)
            document.getElementsByClassName('inp-auth')[1].type = 'text';
        e.preventDefault();

        showhideStatus = true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSumbitStatus((status) => (status === false ? true : false));

        // setCookie("token", "123456789", 7);
        const email = formData.email;
        const password = formData.password;
        try {
            // إرسال البيانات إلى خادم API
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth?type=signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data[0].status == true) {
                    console.log("تم تسجيل الدخول بنجاح:", data);
                    setCookie("client_id", data[0].message.client_id, 30);
                    setCookie("at", data[0].message.at, 30);
                    setCookie("ky", data[0].message.ky, 30);
                    setCookie("user", JSON.stringify({ name: data[0].message.name }), 30);

                    window.location.href = '/';
                } else {
                    setSumbitStatus((status) => (status === false ? true : false));
                    setError(data.message || "فشل تسجيل الدخول");
                }
            } else {
                setSumbitStatus((status) => (status === false ? true : false));
                setError(data.message || "فشل تسجيل الدخول");
            }
        } catch (err) {
            setSumbitStatus((status) => (status === false ? true : false));
            console.error("خطأ:", err);
            setError("حدث خطأ غير متوقع");

        }
    };

    const OrderToken = async () => {
        try {
            // إرسال البيانات إلى خادم API مع طريقة GET
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/authVerify?at=${getCookie("at")}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // قراءة البيانات من الاستجابة
            const data = await response.json();

            if (response.ok) {
                console.log("Success:", data);

                if (data.status == true) {
                    console.log("Success:", data);
                    const user = JSON.parse();
                    user['name'] = data.name;
                    setCookie("user", user, 30);
                    window.location.href = '/';
                } else {
                    window.location.href = '/';
                }
                // تنفيذ منطق في حالة النجاح
            } else {
                console.error("Error response:", data);
                // تنفيذ منطق في حالة الخطأ
            }
        } catch (err) {
            window.location.href = '/';
            console.error("Fetch error:", err);
            deleteCookie('at');
        }
    };

    var locked = false;
    useEffect(() => {
        if (locked == false) {



            if (getCookie('at')) {
                OrderToken();
            } else {
                setShowPage((status) => (status === false ? true : false));
                document.title = 'تسجيل الدخول | Urensh';
            }
            setTimeout(() => {
                document.getElementsByClassName('inp-auth')[0].focus();
            }, 200);

            locked = true;
        }

    }, []);
    return (
        <div className={`center-page ${showPage === false ? 'hidden' : 'show'}`}>
            <div>
                <div className='disperse-layer'>
                    <div className='dse-1'>
                        <div className='logo-auth'>
                            <Link to='/' className='logo'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="38px" height="38px" viewBox="0 0 32 32">
                                    <path class="icon-color" d="M32,16c0,7.84-5.64,14.36-13.08,15.73C17.97,31.91,17,32,16,32s-1.97-0.09-2.92-0.27C5.64,30.36,0,23.84,0,16
	C0,7.16,7.16,0,16,0S32,7.16,32,16z"/>
                                    <path class="icon-white" d="M23.92,9.25l-4.15-2.41c-0.15-0.09-0.34-0.09-0.5,0c-0.15,0.09-0.25,0.25-0.25,0.43v7.23
	c0,0.36-0.19,0.69-0.5,0.87l-2.06,1.19c-0.31,0.18-0.69,0.18-1,0l-2.06-1.19c-0.31-0.18-0.5-0.51-0.5-0.87V7.28
	c0-0.18-0.1-0.34-0.25-0.43c-0.16-0.09-0.35-0.09-0.5,0L7.99,9.25c-0.31,0.18-0.5,0.51-0.5,0.86v7.51c0,0.36,0.19,0.69,0.5,0.87
	l4.35,2.52c0.31,0.18,0.5,0.51,0.5,0.86l0,3.32c0,0.36,0.19,0.69,0.5,0.87l2.37,1.36c0.08,0.04,0.16,0.07,0.25,0.07
	s0.17-0.02,0.25-0.07l2.37-1.36c0.31-0.18,0.5-0.51,0.5-0.87v-3.32c0-0.36,0.19-0.69,0.5-0.87l4.35-2.52
	c0.31-0.18,0.5-0.51,0.5-0.87v-7.51C24.42,9.76,24.23,9.43,23.92,9.25z"/>
                                </svg>
                            </Link>
                        </div>
                        <div className='dspace-10'></div>
                        <div className='auth-text'>تسجيل الدخول إلي Urensh</div>
                        <div className='dspace-20'></div>
                        <form onSubmit={handleSubmit}>
                            {errorMessage && <div className='errorMessage'>{errorMessage}</div>}
                            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

                            <div style={{ marginBottom: '1rem' }}>
                                <div className='input-type'>البريد الإلكتروني</div>
                                <input
                                    type="email"
                                    name="email"
                                    className='inp-auth'
                                    placeholder='أدخل البريد الإلكتروني'
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className='dspace-10'></div>
                            <div style={{ marginBottom: '1rem' }}>
                                <div className='input-type'>كلمة المرور</div>
                                <div className='id-secure'>
                                    <input
                                        type={passwordType}
                                        name="password"
                                        className='inp-auth'
                                        placeholder='أدخل كلمة المرور'
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />

                                    <div className='space-10'></div>
                                    <div className='solid-v-2'></div>
                                    <div className='space-10'></div>

                                    <button type='button' onClick={togglePasswordVisibility} className='cans-auth btn-show icon icon-auth'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 18 18" className={`${passwordType === 'password' ? 'icon-show' : 'icon-hide'} icon-open`}>
                                            <rect className='transparent' width="18" height="18" />
                                            <circle cx="9" cy="9" r="2.7" />
                                            <path d="M9,15.01c-2.07,0-4.15-0.79-5.73-2.37l0,0L0.26,9.64c-0.35-0.35-0.35-0.92,0-1.27l3.01-3.01c3.16-3.16,8.3-3.16,11.46,0
	l3.01,3.01c0.35,0.35,0.35,0.92,0,1.27l-3.01,3.01C13.15,14.22,11.07,15.01,9,15.01z M4.54,11.37c2.46,2.46,6.45,2.46,8.91,0
	L15.83,9l-2.37-2.37C11,4.17,7,4.17,4.54,6.63L2.17,9L4.54,11.37z"/>
                                        </svg>

                                        <svg xmlns="http://www.w3.org/2000/svg" width="17.41" height="5.02" viewBox="0 0 17.41 5.02" className={`${passwordType === 'password' ? 'icon-hide' : 'icon-show'} icon-off`}>
                                            <path d="M16.71,0.71L16.71,0.71L16.71,0.71c-4.42,4.42-11.58,4.42-16,0l0,0l0,0" />

                                        </svg>
                                        <div className='tooltip'>
                                            {passwordType === 'password' ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className='flex'><button type='button' className='btn-forget'>هل فقدت كلمة المرور؟</button></div>
                            <div className='dspace-20'></div>

                            <button type='submit' className='btn-submit' disabled={SubmitStatus === true}>{SubmitStatus === false ? "تسجيل الدخول" : <div className="loader"></div>}</button>
                        </form>
                        <div className='dspace-25'></div>
                        <div className='flex'>
                            <Link to={'/join'} className='btn-cancel'>إنشاء حساب عميل</Link>
                        </div>
                        <div className='dspace-25'></div>
                    </div>
                    {/* <div className='disperse-center'><div className='disperse-center-text'>أو</div></div>
                    <div className='dse-2'>
                        <div className='dse-2-fx'>

                            <div className='illustrative-state'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="320px" height="236.01px" viewBox="0 0 320 236.01">
                                    <g>
                                        <path className="lls-col1" d="M240.69,236.01H91.58V69.39c0-5.52,4.48-10,10-10h129.11c5.52,0,10,4.48,10,10V236.01z" />
                                        <path className="lls-col2" d="M231.26,62.57c4,0,7.24,3.24,7.24,7.24V234H93.78V69.81c0-4,3.24-7.24,7.24-7.24H231.26 M244.29,234V69.81
		c0-7.18-5.84-13.02-13.02-13.02l0,0H101.01c-7.18,0-13.02,5.84-13.02,13.02V234"/>
                                    </g>
                                    <g>
                                        <path className="lls-col2" d="M175.69,75.95h-19.1c-1.12,0-2.03-0.91-2.03-2.03v-1.74c0-1.12,0.91-2.03,2.03-2.03h19.1
		c1.12,0,2.03,0.91,2.03,2.03v1.74C177.72,75.04,176.81,75.95,175.69,75.95z"/>
                                    </g>
                                    <path className="lls-col2" d="M90.7,126.68h-2.63c-1.7,0-3.07-1.38-3.07-3.07v-20.78c0-1.7,1.38-3.07,3.07-3.07h2.63
	c1.7,0,3.07,1.38,3.07,3.07v20.78C93.78,125.31,92.4,126.68,90.7,126.68z"/>
                                    <path className="lls-col2" d="M90.7,148.29h-2.63c-1.7,0-3.07-1.38-3.07-3.07v-7.32c0-1.7,1.38-3.07,3.07-3.07h2.63
	c1.7,0,3.07,1.38,3.07,3.07v7.32C93.78,146.91,92.4,148.29,90.7,148.29z"/>
                                    <path className="lls-col2" d="M90.7,164.33h-2.63c-1.7,0-3.07-1.38-3.07-3.07v-7.32c0-1.7,1.38-3.07,3.07-3.07h2.63
	c1.7,0,3.07,1.38,3.07,3.07v7.32C93.78,162.96,92.4,164.33,90.7,164.33z"/>
                                    <path d="M125.67,127.13h2.9v2.9h-2.9V127.13z M128.57,127.13h2.9v2.9h-2.9V127.13z M131.48,127.13h2.9v2.9h-2.9V127.13z
	 M134.38,127.13h2.9v2.9h-2.9V127.13z M137.28,127.13h2.9v2.9h-2.9V127.13z M140.18,127.13h2.9v2.9h-2.9V127.13z M143.08,127.13h2.9
	v2.9h-2.9V127.13z M148.89,127.13h2.9v2.9h-2.9V127.13z M151.79,127.13h2.9v2.9h-2.9V127.13z M160.49,127.13h2.9v2.9h-2.9V127.13z
	 M166.3,127.13h2.9v2.9h-2.9V127.13z M169.2,127.13h2.9v2.9h-2.9V127.13z M172.1,127.13h2.9v2.9h-2.9V127.13z M175,127.13h2.9v2.9
	H175V127.13z M177.91,127.13h2.9v2.9h-2.9V127.13z M180.81,127.13h2.9v2.9h-2.9V127.13z M183.71,127.13h2.9v2.9h-2.9V127.13z
	 M125.67,130.04h2.9v2.9h-2.9V130.04z M143.08,130.04h2.9v2.9h-2.9V130.04z M154.69,130.04h2.9v2.9h-2.9V130.04z M157.59,130.04h2.9
	v2.9h-2.9V130.04z M160.49,130.04h2.9v2.9h-2.9V130.04z M166.3,130.04h2.9v2.9h-2.9V130.04z M183.71,130.04h2.9v2.9h-2.9V130.04z
	 M125.67,132.94h2.9v2.9h-2.9V132.94z M131.48,132.94h2.9v2.9h-2.9V132.94z M134.38,132.94h2.9v2.9h-2.9V132.94z M137.28,132.94h2.9
	v2.9h-2.9V132.94z M143.08,132.94h2.9v2.9h-2.9V132.94z M148.89,132.94h2.9v2.9h-2.9V132.94z M157.59,132.94h2.9v2.9h-2.9V132.94z
	 M160.49,132.94h2.9v2.9h-2.9V132.94z M166.3,132.94h2.9v2.9h-2.9V132.94z M172.1,132.94h2.9v2.9h-2.9V132.94z M175,132.94h2.9v2.9
	H175V132.94z M177.91,132.94h2.9v2.9h-2.9V132.94z M183.71,132.94h2.9v2.9h-2.9V132.94z M125.67,135.84h2.9v2.9h-2.9V135.84z
	 M131.48,135.84h2.9v2.9h-2.9V135.84z M134.38,135.84h2.9v2.9h-2.9V135.84z M137.28,135.84h2.9v2.9h-2.9V135.84z M143.08,135.84h2.9
	v2.9h-2.9V135.84z M151.79,135.84h2.9v2.9h-2.9V135.84z M154.69,135.84h2.9v2.9h-2.9V135.84z M166.3,135.84h2.9v2.9h-2.9V135.84z
	 M172.1,135.84h2.9v2.9h-2.9V135.84z M175,135.84h2.9v2.9H175V135.84z M177.91,135.84h2.9v2.9h-2.9V135.84z M183.71,135.84h2.9v2.9
	h-2.9V135.84z M125.67,138.74h2.9v2.9h-2.9V138.74z M131.48,138.74h2.9v2.9h-2.9V138.74z M134.38,138.74h2.9v2.9h-2.9V138.74z
	 M137.28,138.74h2.9v2.9h-2.9V138.74z M143.08,138.74h2.9v2.9h-2.9V138.74z M148.89,138.74h2.9v2.9h-2.9V138.74z M151.79,138.74h2.9
	v2.9h-2.9V138.74z M157.59,138.74h2.9v2.9h-2.9V138.74z M160.49,138.74h2.9v2.9h-2.9V138.74z M166.3,138.74h2.9v2.9h-2.9V138.74z
	 M172.1,138.74h2.9v2.9h-2.9V138.74z M175,138.74h2.9v2.9H175V138.74z M177.91,138.74h2.9v2.9h-2.9V138.74z M183.71,138.74h2.9v2.9
	h-2.9V138.74z M125.67,141.64h2.9v2.9h-2.9V141.64z M143.08,141.64h2.9v2.9h-2.9V141.64z M151.79,141.64h2.9v2.9h-2.9V141.64z
	 M166.3,141.64h2.9v2.9h-2.9V141.64z M183.71,141.64h2.9v2.9h-2.9V141.64z M125.67,144.54h2.9v2.9h-2.9V144.54z M128.57,144.54h2.9
	v2.9h-2.9V144.54z M131.48,144.54h2.9v2.9h-2.9V144.54z M134.38,144.54h2.9v2.9h-2.9V144.54z M137.28,144.54h2.9v2.9h-2.9V144.54z
	 M140.18,144.54h2.9v2.9h-2.9V144.54z M143.08,144.54h2.9v2.9h-2.9V144.54z M148.89,144.54h2.9v2.9h-2.9V144.54z M154.69,144.54h2.9
	v2.9h-2.9V144.54z M160.49,144.54h2.9v2.9h-2.9V144.54z M166.3,144.54h2.9v2.9h-2.9V144.54z M169.2,144.54h2.9v2.9h-2.9V144.54z
	 M172.1,144.54h2.9v2.9h-2.9V144.54z M175,144.54h2.9v2.9H175V144.54z M177.91,144.54h2.9v2.9h-2.9V144.54z M180.81,144.54h2.9v2.9
	h-2.9V144.54z M183.71,144.54h2.9v2.9h-2.9V144.54z M148.89,147.45h2.9v2.9h-2.9V147.45z M151.79,147.45h2.9v2.9h-2.9V147.45z
	 M157.59,147.45h2.9v2.9h-2.9V147.45z M160.49,147.45h2.9v2.9h-2.9V147.45z M140.18,150.35h2.9v2.9h-2.9V150.35z M143.08,150.35h2.9
	v2.9h-2.9V150.35z M157.59,150.35h2.9v2.9h-2.9V150.35z M166.3,150.35h2.9v2.9h-2.9V150.35z M172.1,150.35h2.9v2.9h-2.9V150.35z
	 M177.91,150.35h2.9v2.9h-2.9V150.35z M183.71,150.35h2.9v2.9h-2.9V150.35z M125.67,153.25h2.9v2.9h-2.9V153.25z M128.57,153.25h2.9
	v2.9h-2.9V153.25z M131.48,153.25h2.9v2.9h-2.9V153.25z M134.38,153.25h2.9v2.9h-2.9V153.25z M140.18,153.25h2.9v2.9h-2.9V153.25z
	 M145.99,153.25h2.9v2.9h-2.9V153.25z M151.79,153.25h2.9v2.9h-2.9V153.25z M154.69,153.25h2.9v2.9h-2.9V153.25z M157.59,153.25h2.9
	v2.9h-2.9V153.25z M160.49,153.25h2.9v2.9h-2.9V153.25z M163.4,153.25h2.9v2.9h-2.9V153.25z M172.1,153.25h2.9v2.9h-2.9V153.25z
	 M175,153.25h2.9v2.9H175V153.25z M177.91,153.25h2.9v2.9h-2.9V153.25z M125.67,156.15h2.9v2.9h-2.9V156.15z M137.28,156.15h2.9v2.9
	h-2.9V156.15z M143.08,156.15h2.9v2.9h-2.9V156.15z M148.89,156.15h2.9v2.9h-2.9V156.15z M154.69,156.15h2.9v2.9h-2.9V156.15z
	 M163.4,156.15h2.9v2.9h-2.9V156.15z M166.3,156.15h2.9v2.9h-2.9V156.15z M172.1,156.15h2.9v2.9h-2.9V156.15z M175,156.15h2.9v2.9
	H175V156.15z M177.91,156.15h2.9v2.9h-2.9V156.15z M180.81,156.15h2.9v2.9h-2.9V156.15z M125.67,159.05h2.9v2.9h-2.9V159.05z
	 M134.38,159.05h2.9v2.9h-2.9V159.05z M137.28,159.05h2.9v2.9h-2.9V159.05z M145.99,159.05h2.9v2.9h-2.9V159.05z M148.89,159.05h2.9
	v2.9h-2.9V159.05z M151.79,159.05h2.9v2.9h-2.9V159.05z M154.69,159.05h2.9v2.9h-2.9V159.05z M160.49,159.05h2.9v2.9h-2.9V159.05z
	 M163.4,159.05h2.9v2.9h-2.9V159.05z M172.1,159.05h2.9v2.9h-2.9V159.05z M175,159.05h2.9v2.9H175V159.05z M177.91,159.05h2.9v2.9
	h-2.9V159.05z M180.81,159.05h2.9v2.9h-2.9V159.05z M125.67,161.96h2.9v2.9h-2.9V161.96z M128.57,161.96h2.9v2.9h-2.9V161.96z
	 M131.48,161.96h2.9v2.9h-2.9V161.96z M134.38,161.96h2.9v2.9h-2.9V161.96z M137.28,161.96h2.9v2.9h-2.9V161.96z M140.18,161.96h2.9
	v2.9h-2.9V161.96z M143.08,161.96h2.9v2.9h-2.9V161.96z M145.99,161.96h2.9v2.9h-2.9V161.96z M151.79,161.96h2.9v2.9h-2.9V161.96z
	 M154.69,161.96h2.9v2.9h-2.9V161.96z M157.59,161.96h2.9v2.9h-2.9V161.96z M160.49,161.96h2.9v2.9h-2.9V161.96z M163.4,161.96h2.9
	v2.9h-2.9V161.96z M175,161.96h2.9v2.9H175V161.96z M148.89,164.86h2.9v2.9h-2.9V164.86z M154.69,164.86h2.9v2.9h-2.9V164.86z
	 M157.59,164.86h2.9v2.9h-2.9V164.86z M160.49,164.86h2.9v2.9h-2.9V164.86z M163.4,164.86h2.9v2.9h-2.9V164.86z M166.3,164.86h2.9
	v2.9h-2.9V164.86z M175,164.86h2.9v2.9H175V164.86z M177.91,164.86h2.9v2.9h-2.9V164.86z M183.71,164.86h2.9v2.9h-2.9V164.86z
	 M125.67,167.76h2.9v2.9h-2.9V167.76z M128.57,167.76h2.9v2.9h-2.9V167.76z M131.48,167.76h2.9v2.9h-2.9V167.76z M134.38,167.76h2.9
	v2.9h-2.9V167.76z M137.28,167.76h2.9v2.9h-2.9V167.76z M140.18,167.76h2.9v2.9h-2.9V167.76z M143.08,167.76h2.9v2.9h-2.9V167.76z
	 M160.49,167.76h2.9v2.9h-2.9V167.76z M166.3,167.76h2.9v2.9h-2.9V167.76z M169.2,167.76h2.9v2.9h-2.9V167.76z M175,167.76h2.9v2.9
	H175V167.76z M177.91,167.76h2.9v2.9h-2.9V167.76z M180.81,167.76h2.9v2.9h-2.9V167.76z M125.67,170.66h2.9v2.9h-2.9V170.66z
	 M143.08,170.66h2.9v2.9h-2.9V170.66z M148.89,170.66h2.9v2.9h-2.9V170.66z M160.49,170.66h2.9v2.9h-2.9V170.66z M163.4,170.66h2.9
	v2.9h-2.9V170.66z M172.1,170.66h2.9v2.9h-2.9V170.66z M175,170.66h2.9v2.9H175V170.66z M177.91,170.66h2.9v2.9h-2.9V170.66z
	 M125.67,173.56h2.9v2.9h-2.9V173.56z M131.48,173.56h2.9v2.9h-2.9V173.56z M134.38,173.56h2.9v2.9h-2.9V173.56z M137.28,173.56h2.9
	v2.9h-2.9V173.56z M143.08,173.56h2.9v2.9h-2.9V173.56z M151.79,173.56h2.9v2.9h-2.9V173.56z M154.69,173.56h2.9v2.9h-2.9V173.56z
	 M157.59,173.56h2.9v2.9h-2.9V173.56z M166.3,173.56h2.9v2.9h-2.9V173.56z M172.1,173.56h2.9v2.9h-2.9V173.56z M175,173.56h2.9v2.9
	H175V173.56z M180.81,173.56h2.9v2.9h-2.9V173.56z M125.67,176.46h2.9v2.9h-2.9V176.46z M131.48,176.46h2.9v2.9h-2.9V176.46z
	 M134.38,176.46h2.9v2.9h-2.9V176.46z M137.28,176.46h2.9v2.9h-2.9V176.46z M143.08,176.46h2.9v2.9h-2.9V176.46z M151.79,176.46h2.9
	v2.9h-2.9V176.46z M157.59,176.46h2.9v2.9h-2.9V176.46z M160.49,176.46h2.9v2.9h-2.9V176.46z M172.1,176.46h2.9v2.9h-2.9V176.46z
	 M177.91,176.46h2.9v2.9h-2.9V176.46z M125.67,179.37h2.9v2.9h-2.9V179.37z M131.48,179.37h2.9v2.9h-2.9V179.37z M134.38,179.37h2.9
	v2.9h-2.9V179.37z M137.28,179.37h2.9v2.9h-2.9V179.37z M143.08,179.37h2.9v2.9h-2.9V179.37z M157.59,179.37h2.9v2.9h-2.9V179.37z
	 M166.3,179.37h2.9v2.9h-2.9V179.37z M172.1,179.37h2.9v2.9h-2.9V179.37z M180.81,179.37h2.9v2.9h-2.9V179.37z M183.71,179.37h2.9
	v2.9h-2.9V179.37z M125.67,182.27h2.9v2.9h-2.9V182.27z M143.08,182.27h2.9v2.9h-2.9V182.27z M154.69,182.27h2.9v2.9h-2.9V182.27z
	 M157.59,182.27h2.9v2.9h-2.9V182.27z M160.49,182.27h2.9v2.9h-2.9V182.27z M169.2,182.27h2.9v2.9h-2.9V182.27z M175,182.27h2.9v2.9
	H175V182.27z M177.91,182.27h2.9v2.9h-2.9V182.27z M125.67,185.17h2.9v2.9h-2.9V185.17z M128.57,185.17h2.9v2.9h-2.9V185.17z
	 M131.48,185.17h2.9v2.9h-2.9V185.17z M134.38,185.17h2.9v2.9h-2.9V185.17z M137.28,185.17h2.9v2.9h-2.9V185.17z M140.18,185.17h2.9
	v2.9h-2.9V185.17z M143.08,185.17h2.9v2.9h-2.9V185.17z M151.79,185.17h2.9v2.9h-2.9V185.17z M163.4,185.17h2.9v2.9h-2.9V185.17z
	 M166.3,185.17h2.9v2.9h-2.9V185.17z M169.2,185.17h2.9v2.9h-2.9V185.17z M180.81,185.17h2.9v2.9h-2.9V185.17z"/>
                                    <path className="lls-col3" d="M253.18,118.4h-133.2c-8.08,0-14.63,6.55-14.63,14.63v17.06c0,8.08,6.55,14.63,14.63,14.63h133.2
	c8.08,0,14.63-6.55,14.63-14.63v-17.06C267.81,124.95,261.26,118.4,253.18,118.4z"/>
                                    <path className="lls-col3" d="M184.05,204.81h-55.81c-1.4,0-2.53-1.13-2.53-2.53v-2.17c0-1.4,1.13-2.53,2.53-2.53h55.81
	c1.4,0,2.53,1.13,2.53,2.53v2.17C186.58,203.68,185.45,204.81,184.05,204.81z"/>
                                    <g>
                                        <path d="M130.57,140.96c0,0.47-0.05,0.92-0.16,1.37c-0.11,0.45-0.27,0.85-0.49,1.21s-0.5,0.65-0.82,0.87
		c-0.32,0.22-0.71,0.33-1.16,0.33c-0.47,0-0.83-0.13-1.1-0.4c-0.27-0.27-0.43-0.57-0.49-0.92h-0.08c-0.18,0.38-0.45,0.69-0.81,0.94
		c-0.35,0.25-0.8,0.38-1.34,0.38c-0.77,0-1.37-0.26-1.79-0.78c-0.42-0.52-0.63-1.2-0.63-2.05c0-0.67,0.13-1.26,0.4-1.77
		s0.64-0.91,1.12-1.21c0.48-0.29,1.05-0.44,1.71-0.44c0.45,0,0.88,0.04,1.31,0.11c0.43,0.08,0.77,0.16,1.01,0.25l-0.15,3.08
		c-0.01,0.18-0.02,0.31-0.02,0.39c0,0.08,0,0.13,0,0.16c0,0.53,0.09,0.88,0.28,1.05c0.19,0.17,0.41,0.26,0.66,0.26
		c0.31,0,0.58-0.13,0.8-0.39c0.22-0.26,0.39-0.6,0.5-1.03c0.12-0.43,0.17-0.9,0.17-1.42c0-0.94-0.19-1.74-0.57-2.39
		c-0.38-0.65-0.9-1.15-1.56-1.5c-0.66-0.34-1.42-0.52-2.26-0.52c-0.86,0-1.63,0.14-2.29,0.41c-0.67,0.27-1.23,0.66-1.68,1.15
		c-0.45,0.5-0.79,1.08-1.03,1.76c-0.23,0.67-0.35,1.42-0.35,2.23c0,0.99,0.18,1.84,0.53,2.53c0.35,0.69,0.87,1.22,1.56,1.58
		c0.68,0.36,1.52,0.54,2.51,0.54c0.62,0,1.21-0.07,1.77-0.21c0.56-0.14,1.06-0.29,1.5-0.45v1.03c-0.44,0.18-0.92,0.33-1.47,0.45
		c-0.54,0.12-1.14,0.17-1.8,0.17c-1.2,0-2.22-0.22-3.07-0.67c-0.85-0.45-1.5-1.09-1.95-1.92c-0.45-0.84-0.68-1.84-0.68-3.02
		c0-0.94,0.15-1.82,0.44-2.62c0.29-0.8,0.72-1.5,1.28-2.1s1.23-1.05,2.03-1.38c0.79-0.33,1.69-0.49,2.7-0.49
		c0.79,0,1.52,0.12,2.18,0.37c0.66,0.25,1.24,0.61,1.73,1.08c0.49,0.47,0.87,1.04,1.14,1.71
		C130.44,139.36,130.57,140.12,130.57,140.96z M122.9,141.93c0,0.65,0.13,1.12,0.39,1.41c0.26,0.29,0.61,0.44,1.04,0.44
		c0.57,0,0.98-0.21,1.22-0.64c0.25-0.43,0.39-0.98,0.43-1.66l0.09-1.9c-0.13-0.04-0.3-0.08-0.5-0.11c-0.2-0.03-0.41-0.05-0.62-0.05
		c-0.5,0-0.9,0.12-1.2,0.36c-0.3,0.24-0.52,0.55-0.65,0.93C122.96,141.12,122.9,141.51,122.9,141.93z"/>
                                        <path d="M138.75,139.76l-0.47,2.43h2.08v1.02h-2.28l-0.62,3.18h-1.08l0.62-3.18h-2.17l-0.59,3.18h-1.06l0.58-3.18h-1.91v-1.02h2.11
		l0.49-2.43h-2.04v-1h2.22l0.61-3.22h1.09l-0.61,3.22h2.19l0.61-3.22h1.05l-0.61,3.22h1.93v1H138.75z M135.02,142.19h2.17l0.47-2.43
		h-2.17L135.02,142.19z"/>
                                        <path d="M142.36,145.56c0-0.37,0.09-0.64,0.27-0.79c0.18-0.15,0.4-0.23,0.67-0.23c0.25,0,0.47,0.08,0.66,0.23
		c0.19,0.15,0.28,0.42,0.28,0.79c0,0.36-0.09,0.63-0.28,0.79c-0.19,0.16-0.41,0.24-0.66,0.24c-0.26,0-0.49-0.08-0.67-0.24
		C142.45,146.19,142.36,145.93,142.36,145.56z M143.75,143.33h-0.87l-0.38-7.8h1.63L143.75,143.33z"/>
                                        <path d="M152.64,146.38l-3.57-9.51h-0.06c0.02,0.2,0.04,0.46,0.05,0.78c0.02,0.31,0.03,0.66,0.04,1.03s0.02,0.75,0.02,1.13v6.58
		h-1.26v-10.85h2.02l3.34,8.89h0.06l3.4-8.89h2.01v10.85h-1.35v-6.67c0-0.35,0-0.71,0.02-1.06c0.01-0.35,0.03-0.68,0.05-0.99
		c0.02-0.31,0.04-0.57,0.05-0.78h-0.06l-3.62,9.5H152.64z"/>
                                        <path d="M167.7,146.38h-6.06v-10.85h6.06v1.2H163v3.39h4.42v1.19H163v3.87h4.7V146.38z" />
                                        <path d="M176.15,146.38h-6.06v-10.85h6.06v1.2h-4.7v3.39h4.42v1.19h-4.42v3.87h4.7V146.38z" />
                                        <path d="M184.69,143.48c0,0.65-0.16,1.2-0.47,1.65c-0.31,0.45-0.76,0.8-1.34,1.04c-0.58,0.24-1.27,0.36-2.06,0.36
		c-0.4,0-0.79-0.02-1.16-0.06c-0.37-0.04-0.71-0.1-1.01-0.17c-0.3-0.08-0.57-0.17-0.8-0.28v-1.31c0.36,0.16,0.82,0.31,1.36,0.44
		c0.54,0.13,1.1,0.2,1.68,0.2c0.54,0,0.99-0.07,1.35-0.21c0.36-0.14,0.64-0.34,0.82-0.61c0.18-0.26,0.27-0.57,0.27-0.93
		s-0.08-0.65-0.23-0.9c-0.15-0.24-0.41-0.47-0.78-0.68c-0.37-0.21-0.88-0.43-1.54-0.66c-0.47-0.17-0.87-0.36-1.22-0.55
		c-0.35-0.2-0.64-0.42-0.87-0.68c-0.23-0.25-0.41-0.54-0.52-0.87c-0.12-0.32-0.18-0.7-0.18-1.12c0-0.58,0.15-1.07,0.44-1.48
		c0.29-0.41,0.7-0.73,1.22-0.95c0.52-0.22,1.12-0.33,1.8-0.33c0.6,0,1.14,0.06,1.64,0.17c0.5,0.11,0.95,0.26,1.35,0.44l-0.43,1.17
		c-0.37-0.16-0.78-0.3-1.22-0.41c-0.44-0.11-0.9-0.17-1.38-0.17c-0.46,0-0.84,0.07-1.14,0.2c-0.3,0.13-0.53,0.32-0.68,0.55
		c-0.15,0.24-0.23,0.51-0.23,0.83c0,0.36,0.08,0.67,0.23,0.91s0.4,0.46,0.74,0.65c0.34,0.19,0.81,0.4,1.4,0.62
		c0.64,0.23,1.18,0.48,1.62,0.75c0.44,0.27,0.78,0.59,1,0.97C184.57,142.44,184.69,142.91,184.69,143.48z"/>
                                        <path d="M193.68,146.38l-1.31-3.36h-4.3l-1.29,3.36h-1.38l4.24-10.9h1.23l4.23,10.9H193.68z M190.75,138.52
		c-0.03-0.08-0.08-0.23-0.15-0.44c-0.07-0.21-0.14-0.43-0.2-0.66c-0.07-0.23-0.12-0.4-0.16-0.52c-0.05,0.2-0.1,0.41-0.16,0.61
		c-0.06,0.21-0.11,0.4-0.17,0.57c-0.06,0.17-0.1,0.32-0.14,0.44l-1.23,3.28h3.43L190.75,138.52z"/>
                                        <path d="M196.59,146.38v-10.85h1.37v9.63h4.74v1.22H196.59z" />
                                    </g>
                                    <g>
                                        <path d="M211.79,139.77l-0.47,2.43h2.08v1.02h-2.28l-0.62,3.18h-1.08l0.62-3.18h-2.17l-0.59,3.18h-1.06l0.58-3.18h-1.91v-1.02h2.11
		l0.49-2.43h-2.04v-1h2.22l0.61-3.22h1.09l-0.61,3.22h2.19l0.61-3.22h1.05l-0.61,3.22h1.93v1H211.79z M208.07,142.2h2.17l0.47-2.43
		h-2.17L208.07,142.2z"/>
                                        <path d="M221.61,139.77l-0.47,2.43h2.08v1.02h-2.28l-0.62,3.18h-1.08l0.62-3.18h-2.17l-0.59,3.18h-1.06l0.58-3.18h-1.91v-1.02h2.11
		l0.49-2.43h-2.04v-1h2.22l0.61-3.22h1.09l-0.61,3.22h2.19l0.61-3.22h1.05l-0.61,3.22h1.93v1H221.61z M217.89,142.2h2.17l0.47-2.43
		h-2.17L217.89,142.2z"/>
                                        <path d="M231.43,139.77l-0.47,2.43h2.08v1.02h-2.28l-0.62,3.18h-1.08l0.62-3.18h-2.17l-0.59,3.18h-1.06l0.58-3.18h-1.91v-1.02h2.11
		l0.49-2.43h-2.04v-1h2.22l0.61-3.22h1.09l-0.61,3.22h2.19l0.61-3.22h1.05l-0.61,3.22h1.93v1H231.43z M227.7,142.2h2.17l0.47-2.43
		h-2.17L227.7,142.2z"/>
                                        <path d="M241.24,139.77l-0.47,2.43h2.08v1.02h-2.28l-0.62,3.18h-1.08l0.62-3.18h-2.17l-0.59,3.18h-1.06l0.58-3.18h-1.91v-1.02h2.11
		l0.49-2.43h-2.04v-1h2.22l0.61-3.22h1.09l-0.61,3.22h2.19l0.61-3.22h1.05l-0.61,3.22h1.93v1H241.24z M237.52,142.2h2.17l0.47-2.43
		h-2.17L237.52,142.2z"/>
                                    </g>
                                </svg>
                            </div>

                            <div className='dspace-25'></div>


                            <button className='btn-qrcode'>
                                استخدام الباركود
                                <div className='space-10'></div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className='icon-grey'>
                                    <path d="M5,0H2C0.9,0,0,0.9,0,2v3c0,1.1,0.9,2,2,2h3c1.1,0,2-0.9,2-2V2C7,0.9,6.1,0,5,0z M6,5c0,0.55-0.45,1-1,1H2
		C1.45,6,1,5.55,1,5V2c0-0.55,0.45-1,1-1h3c0.55,0,1,0.45,1,1V5z"/>
                                    <path d="M14,0h-3C9.9,0,9,0.9,9,2v3c0,1.1,0.9,2,2,2h3c1.1,0,2-0.9,2-2V2C16,0.9,15.1,0,14,0z M15,5c0,0.55-0.45,1-1,1h-3
		c-0.55,0-1-0.45-1-1V2c0-0.55,0.45-1,1-1h3c0.55,0,1,0.45,1,1V5z"/>
                                    <path d="M5,9H2c-1.1,0-2,0.9-2,2v3c0,1.1,0.9,2,2,2h3c1.1,0,2-0.9,2-2v-3C7,9.9,6.1,9,5,9z M6,14c0,0.55-0.45,1-1,1H2
		c-0.55,0-1-0.45-1-1v-3c0-0.55,0.45-1,1-1h3c0.55,0,1,0.45,1,1V14z"/>
                                    <path className='icon-colb1' d="M14,9h-3c-1.1,0-2,0.9-2,2v3c0,1.1,0.9,2,2,2h3c1.1,0,2-0.9,2-2v-3C16,9.9,15.1,9,14,9z" />                    </svg>
                            </button>

                            <div className='dspace-25'></div>
                            <div className='disperse'><div className='disperse-text'>أو بإمكانك</div></div>
                            <div className='dspace-25'></div>


                            <button className='btn-social'>
                                استخدام Google
                                <div className='space-10'></div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16" className="icon-grey">
                                    <path d="M3.55,9.67l-0.56,2.08l-2.04,0.04C0.35,10.66,0,9.37,0,8c0-1.33,0.32-2.58,0.89-3.68h0l1.81,0.33l0.79,1.8
C3.33,6.94,3.24,7.46,3.24,8C3.24,8.59,3.35,9.15,3.55,9.67z"/>
                                    <path d="M15.86,6.51C15.95,6.99,16,7.49,16,8c0,0.57-0.06,1.13-0.17,1.67c-0.39,1.83-1.41,3.44-2.82,4.57l0,0
l-2.28-0.12l-0.32-2.02c0.94-0.55,1.67-1.41,2.05-2.43H8.18V6.51h4.34H15.86L15.86,6.51z"/>
                                    <path d="M13.01,14.24L13.01,14.24C11.64,15.34,9.9,16,8,16c-3.05,0-5.7-1.7-7.05-4.21l2.59-2.12
c0.68,1.8,2.41,3.09,4.45,3.09c0.88,0,1.7-0.24,2.4-0.65L13.01,14.24z"/>
                                    <path d="M13.11,1.84l-2.59,2.12C9.79,3.51,8.92,3.24,8,3.24c-2.09,0-3.86,1.34-4.5,3.21L0.89,4.32h0
C2.23,1.75,4.91,0,8,0C9.94,0,11.72,0.69,13.11,1.84z"/>
                                </svg>
                            </button>
                            <div className='dspace-10'></div>

                            <button className='btn-social'>
                                استخدام Microsoft
                                <div className='space-10'></div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15.96px" height="16px" viewBox="0 0 15.96 16" className="icon-grey">
                                    <path d="M8.48,7.5h7.48v-7c0-0.28-0.22-0.5-0.5-0.5H8.48V7.5z" />
                                    <path d="M7.48,7.5V0H0.5C0.22,0,0,0.22,0,0.5v7L7.48,7.5L7.48,7.5z" />
                                    <path d="M7.48,8.5H0v7C0,15.78,0.22,16,0.5,16h6.98V8.5z" />
                                    <path d="M8.48,8.5V16h6.98c0.28,0,0.5-0.22,0.5-0.5v-7H8.48z" />
                                </svg>
                            </button>

                            <div className='dspace-10'></div>

                            <button className='btn-social'>
                                استخدام Facebook
                                <div className='space-10'></div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16">
                                    <path className="icon-grey" d="M16,8c0-4.42-3.58-8-8-8S0,3.58,0,8c0,3.99,2.93,7.3,6.75,7.9v-5.59H4.72V8h2.03V6.24
		c0-2.01,1.19-3.11,3.02-3.11c0.88,0,1.79,0.16,1.79,0.16v1.97h-1.01c-0.99,0-1.3,0.62-1.3,1.25V8h2.22l-0.35,2.31H9.25v5.59
		C13.07,15.3,16,11.99,16,8z"/>
                                    <path className="icon-white" d="M11.11,10.31L11.47,8H9.25V6.5c0-0.63,0.31-1.25,1.3-1.25h1.01V3.28c0,0-0.92-0.16-1.79-0.16
		c-1.83,0-3.02,1.11-3.02,3.11V8H4.72v2.31h2.03v5.59C7.16,15.97,7.57,16,8,16s0.84-0.03,1.25-0.1v-5.59H11.11z"/>
                                </svg>
                            </button>
                            <div className='qr-code'>
                            <div className='qr-code-package'>
                                <QRCode value="meesal" size={128} level="H" />
                            </div>
                        </div>
                        </div>
                    </div> */}
                </div>
                <div className='footer-disperse'>
                    جميع الحقوق محفوظة لدي © Urensh 2024
                </div>
                {/* <div className='space-20'></div>
                <a className='fc_lang'>العربية
                    <div className='icon-flags'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="17px"
                            height="17px" viewBox="0 0 17 17" className='icon-solid-black'>
                            <path d="M16.5,8.5c0,0.87-0.14,1.71-0.4,2.5c-1.05,3.2-4.05,5.5-7.6,5.5S1.95,14.2,0.9,11c-0.26-0.79-0.4-1.63-0.4-2.5
	S0.64,6.79,0.9,6c1.05-3.2,4.05-5.5,7.6-5.5s6.55,2.3,7.6,5.5C16.36,6.79,16.5,7.63,16.5,8.5z M16.1,6H0.9
	C0.64,6.79,0.5,7.63,0.5,8.5s0.14,1.71,0.4,2.5h15.2c0.26-0.79,0.4-1.63,0.4-2.5S16.36,6.79,16.1,6z M8.5,0.5L8.5,0.5L8.5,0.5
	c-5.37,4.42-5.37,11.58,0,16l0,0l0,0 M8.5,16.5L8.5,16.5L8.5,16.5c5.37-4.42,5.37-11.58,0-16l0,0l0,0"/>
                        </svg>
                    </div>
                </a> */}
            </div>
        </div>
    );
}