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
        confirm_password: '',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirm_Password] = useState("");

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
        const confirm_password = formData.confirm_password;

        try {
            // إرسال البيانات إلى خادم API
            const response = await fetch("http://192.168.1.100:5000/api/auth?type=signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, confirm_password }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data[0].status == true) {
                    console.log("تم تسجيل الدخول بنجاح:", data);
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
            const response = await fetch(`http://192.168.1.100:5000/api/authVerify?at=${getCookie("at")}`, {
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
                document.title = 'الإنضمام | Urensh';
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 48 48">
                                    <path class="icon-color" d="M48,24c0,11.76-8.46,21.54-19.62,23.6C26.95,47.86,25.5,48,24,48s-2.95-0.14-4.38-0.4C8.46,45.54,0,35.76,0,24
	C0,10.74,10.74,0,24,0S48,10.74,48,24z"/>
                                    <polygon class="icon-white" points="35.86,14.72 28.57,10.5 27.49,11.12 27.49,22.49 24,24.51 20.51,22.49 20.51,11.12 19.43,10.5 
	12.14,14.72 11.78,15.34 11.78,27.14 12.14,27.76 19.07,31.76 19.07,37.44 19.43,38.08 23.64,40.5 24.36,40.5 28.57,38.08 
	28.93,37.44 28.93,31.76 35.86,27.76 36.22,27.14 36.22,15.34 "/>
                                </svg>
                            </Link>
                        </div>
                        <div className='dspace-10'></div>
                        <div className='auth-text'>الإنضمام إلي Urensh</div>
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
                                            {passwordType === 'password' ? 'إظهار' : 'إخفاء'} كلمة المرور
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className='dspace-10'></div>
                            <div style={{ marginBottom: '1rem' }}>
                                <div className='input-type'>إعادة كلمة المرور</div>
                                <div className='id-secure'>
                                    <input
                                        type={passwordType}
                                        name="confirm_password"
                                        className='inp-auth'
                                        placeholder='أدخل كلمة المرور مرة أخري'
                                        value={formData.confirm_password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className='dspace-25'></div>

                            <button type='submit' className='btn-submit' disabled={SubmitStatus === true}>{SubmitStatus === false ? "المتابعة" : <div className="loader"></div>}</button>
                        </form>
                        <div className='dspace-25'></div>
                        <div className='flex'>
                            <Link to={'/login'} className='btn-cancel'>تسجيل الدخول</Link>
                        </div>
                        <div className='dspace-25'></div>
                    </div>
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