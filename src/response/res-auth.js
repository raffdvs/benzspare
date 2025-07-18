import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const toggleMenuAccount = (status) => (status === false ? true : false);

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



export default function UserStatus() {

	const [basketsProducts, setBasketProducts] = useState([]);
	const [baskets, setBasketData] = useState([]);

	const [showMenuAccount, setMenuAccount] = useState(false);
	const [showBasket, setBasket] = useState(false);

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

			axios.get('http://192.168.1.100:5000/api/response?type=basket.products&client_id=' + getCookie('client_id') + '&at=' + getCookie('at') + '&ky=' + getCookie('ky'))
				.then((response) => {
					if (response.data.message.length !== 0) {

						setSelectedProducts({});
						setSelectedProducts((prev) => {
							const newSelectedProducts = { ...prev };
							const startKey = Object.keys(prev).length;

							for (let i = 0; i < response.data.message.basket.length; i++) {
								const newKey = startKey + i;
								newSelectedProducts[newKey] = false;
							}

							return newSelectedProducts;
						});

						setBasketProducts(response.data.message.product);
						setBasketData(response.data.message.basket);
					}

				})
				.catch((error) => {
					console.error('Error fetching inbox:', error);
				});
			document.body.style.overflow = 'hidden';
		} else {
			resetSelectionOnClose();
			document.body.style.overflow = 'auto';

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

		axios.get('http://192.168.1.100:5000/api/inbox?client_id=' + getCookie('client_id') + '&at=' + getCookie('at') + '&ky=' + getCookie('ky'))
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


	const AccountLogout = () => {
		setAccountLogout((status) => (status === false ? true : false));
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

	const handleKeyDown = (event) => {
		if (event.key == 'Escape') {
			if (showMenuAccount == false) {
				// toggleMenuAccount();
			}
		}
	};

	const [getNotification, setNotification] = useState([]);
	const [totalInbox, setTotalInbox] = useState(0);

	const [FoundNotification, setFoundNotification] = useState(false);

	useEffect(() => {

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	
}
