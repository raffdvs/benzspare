import { BrowserRouter as Router, Routes, Route, Switch, Link } from 'react-router-dom';
import userState from '../../response/res-auth';



export default function headerApp() {


    return (
        <div className='relative h-[calc(100vh-64px)] snap-start mt-8 z-[99] bg-white'>
            <footer className='flex flex-col justify-between h-[calc(100vh-64px)]'>

                <div className='flex'>

                    <div className='footer_expl justify-between'>


                        <div className='footer_column'>
                            <div className='relative h-[32px]'>

                                <svg xmlns="http://www.w3.org/2000/svg" width="198.85px" height="32px" viewBox="0 0 198.85 32">
                                    <g>
                                        <path className='fill-pri' d="M32,16c0,7.84-5.64,14.36-13.08,15.73C17.97,31.91,17,32,16,32s-1.97-0.09-2.92-0.27C5.64,30.36,0,23.84,0,16
		C0,7.16,7.16,0,16,0S32,7.16,32,16z"/>
                                        <path className='fill-white' d="M24.17,9.4l-4.4-2.55c-0.15-0.09-0.34-0.09-0.5,0c-0.15,0.09-0.25,0.25-0.25,0.43v7.52c0,0.18-0.1,0.34-0.25,0.43
		l-2.56,1.47c-0.15,0.09-0.35,0.09-0.5,0l-2.56-1.47C13,15.14,12.9,14.98,12.9,14.8V7.28c0-0.18-0.1-0.34-0.25-0.43
		c-0.16-0.09-0.35-0.09-0.5,0L7.74,9.4C7.59,9.49,7.49,9.65,7.49,9.83v8.09c0,0.18,0.09,0.34,0.25,0.43l4.85,2.81
		c0.15,0.09,0.25,0.25,0.25,0.43v3.9c0,0.18,0.1,0.34,0.25,0.43l2.62,1.5c0.08,0.04,0.16,0.07,0.25,0.07c0.09,0,0.17-0.02,0.25-0.07
		l2.62-1.5c0.16-0.09,0.25-0.25,0.25-0.43v-3.9c0-0.18,0.1-0.34,0.25-0.43l4.85-2.81c0.15-0.09,0.25-0.25,0.25-0.43V9.83
		C24.42,9.65,24.33,9.49,24.17,9.4z"/>
                                    </g>
                                    <g className='fill-pri'>
                                        <g>
                                            <path d="M55.27,15.92c1.5,0.76,2.25,1.99,2.25,3.69c0,1.45-0.53,2.64-1.59,3.58s-2.4,1.4-4.02,1.4h-7.79V7.4h7.51
			c1.6,0,2.94,0.46,4.02,1.39c1.08,0.93,1.62,2.12,1.62,3.56C57.27,13.93,56.61,15.11,55.27,15.92z M51.68,10.51h-4.32v4.02h4.32
			c0.71,0,1.27-0.19,1.69-0.57c0.42-0.38,0.63-0.86,0.63-1.45c0-0.57-0.21-1.05-0.62-1.43C52.98,10.7,52.41,10.51,51.68,10.51z
			 M51.96,21.51c0.71,0,1.27-0.19,1.69-0.58c0.42-0.39,0.63-0.88,0.63-1.47c0-0.59-0.21-1.07-0.62-1.44
			c-0.41-0.37-0.98-0.56-1.71-0.56h-4.6v4.04H51.96z"/>
                                            <path d="M72.24,10.51h-8.37v3.99h5.76v2.98h-5.76v3.99h8.37v3.11h-11.6V7.4h11.6V10.51z" />
                                            <path d="M87.08,7.4h3.24V24.6h-2.65l-8.87-11.45V24.6h-3.24V7.4h2.63l8.9,11.5V7.4z" />
                                            <path d="M98.71,21.49h9.28v3.11H94.13v-2.5l8.8-11.58h-8.8V7.4h13.35v2.5L98.71,21.49z" />
                                        </g>
                                    </g>
                                    <g className='fill-pri'>
                                        <path d="M125.12,19.51c0,1.65-0.62,2.98-1.87,3.98c-1.25,1-2.88,1.5-4.9,1.5c-1.85,0-3.43-0.43-4.72-1.28
		c-1.29-0.85-2.07-1.94-2.34-3.27l3.16-1.14c0.22,0.76,0.68,1.37,1.39,1.85s1.62,0.71,2.73,0.71c0.99,0,1.79-0.19,2.39-0.58
		c0.6-0.39,0.9-0.89,0.9-1.52c0-0.35-0.08-0.65-0.24-0.88c-0.16-0.24-0.48-0.45-0.96-0.64c-0.48-0.19-0.85-0.32-1.11-0.39
		c-0.26-0.07-0.79-0.19-1.58-0.35c-0.08-0.02-0.15-0.03-0.2-0.05c-1.82-0.4-3.23-0.99-4.22-1.76c-0.99-0.77-1.49-1.88-1.49-3.35
		c0-1.63,0.59-2.93,1.76-3.89c1.17-0.96,2.67-1.44,4.51-1.44c1.72,0,3.18,0.42,4.39,1.25s1.95,1.93,2.24,3.3l-3.06,1.14
		c-0.2-0.76-0.63-1.38-1.28-1.86c-0.65-0.48-1.45-0.72-2.41-0.72c-0.84,0-1.53,0.18-2.07,0.54c-0.54,0.36-0.81,0.83-0.81,1.4
		c0,0.34,0.09,0.63,0.28,0.88c0.19,0.25,0.48,0.47,0.87,0.64c0.4,0.18,0.75,0.32,1.07,0.42c0.32,0.1,0.77,0.22,1.34,0.35
		c2.07,0.5,3.63,1.13,4.68,1.87C124.6,16.97,125.12,18.06,125.12,19.51z"/>
                                        <path d="M135.39,7.4c1.65,0,3.03,0.51,4.15,1.53c1.11,1.02,1.67,2.28,1.67,3.78c0,1.5-0.55,2.77-1.66,3.8
		c-1.1,1.04-2.49,1.56-4.16,1.56h-4.25v6.52h-3.26V7.4H135.39z M135.39,14.96c0.76,0,1.38-0.21,1.86-0.63
		c0.48-0.42,0.72-0.95,0.72-1.59c0-0.64-0.24-1.17-0.72-1.59c-0.48-0.42-1.1-0.63-1.86-0.63h-4.25v4.45H135.39z"/>
                                        <path d="M155.13,24.6l-1.57-3.82h-7.66l-1.54,3.82h-3.51L148,7.4h3.41l7.26,17.19H155.13z M147.09,17.87h5.28l-2.65-6.47
		L147.09,17.87z"/>
                                        <path d="M170.7,24.6l-3.82-6.62h-3.03v6.62h-3.24V7.4h7.48c1.65,0,3.03,0.5,4.15,1.5c1.11,1,1.67,2.25,1.67,3.75
		c0,1.11-0.32,2.11-0.96,3c-0.64,0.88-1.49,1.52-2.55,1.91l4.04,7.03H170.7z M163.85,10.51v4.45h4.25c0.76,0,1.38-0.21,1.86-0.63
		c0.48-0.42,0.72-0.95,0.72-1.59c0-0.64-0.24-1.17-0.72-1.59c-0.48-0.42-1.1-0.63-1.86-0.63H163.85z"/>
                                        <path d="M188.65,10.51h-8.37v3.99h5.76v2.98h-5.76v3.99h8.37v3.11h-11.6V7.4h11.6V10.51z" />
                                        <g>
                                            <path d="M194.31,21.1v0.63h-1v2.87h-0.67v-2.87h-1V21.1H194.31z" />
                                            <path d="M198.85,21.1v3.5h-0.66v-2.51l-0.97,2.51h-0.67l-0.95-2.49v2.49h-0.66v-3.5h0.95l0.99,2.61l1.01-2.61H198.85z" />
                                        </g>
                                    </g>

                                </svg>
                            </div>

                        </div>

                        <div className='footer_column space-y-2'>
                            <div className='text-sec text-sm font-semibold px-3 pb-2'>عنا</div>

                            <a href='#' className='flex items-center min-w-[164px] px-2 h-[28px] hover:bg-sec/10 hover:text-sec/70 rounded-xl group text-light text-sec text-xs'>عن {process.env.REACT_APP_NAME}
                                <div className='icon-arrow'>
                                    <div className='icon-style'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10px"
                                            height="10px" viewBox="0 0 12 12" className='fill-sec group-hover:fill-sec/70'>
                                            <path d="M11.78,10.72L2.56,1.5H6c0.41,0,0.75-0.34,0.75-0.75S6.41,0,6,0H0.75c-0.1,0-0.19,0.02-0.29,0.06
	C0.28,0.13,0.13,0.28,0.06,0.46C0.02,0.56,0,0.65,0,0.75V6c0,0.41,0.34,0.75,0.75,0.75S1.5,6.41,1.5,6V2.56l9.22,9.22
	c0.15,0.15,0.34,0.22,0.53,0.22s0.38-0.07,0.53-0.22C12.07,11.49,12.07,11.01,11.78,10.72z"/>


                                        </svg>
                                    </div>
                                </div>
                            </a>
                            <a href='#' className='flex items-center min-w-[164px] px-2 h-[28px] hover:bg-sec/10 hover:text-sec/70 rounded-xl group text-light text-sec text-xs'>{process.env.REACT_APP_NAME} للأعمال
                                <div className='icon-arrow'>
                                    <div className='icon-style'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10px"
                                            height="10px" viewBox="0 0 12 12" className='fill-sec group-hover:fill-sec/70'>
                                            <path d="M11.78,10.72L2.56,1.5H6c0.41,0,0.75-0.34,0.75-0.75S6.41,0,6,0H0.75c-0.1,0-0.19,0.02-0.29,0.06
	C0.28,0.13,0.13,0.28,0.06,0.46C0.02,0.56,0,0.65,0,0.75V6c0,0.41,0.34,0.75,0.75,0.75S1.5,6.41,1.5,6V2.56l9.22,9.22
	c0.15,0.15,0.34,0.22,0.53,0.22s0.38-0.07,0.53-0.22C12.07,11.49,12.07,11.01,11.78,10.72z"/>

                                        </svg>
                                    </div>
                                </div>
                            </a>
                            {/* <div className='dspace-10'></div>
                        <a href='#' className='flex items-center w-[128px] h-[28px] hover:bg-sec/10 hover:text-sec/70 rounded-xl px-2 group'>وظائف
                            <div className='icon-arrow'>
                                <div className='icon-style'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10px"
                                        height="10px" viewBox="0 0 12 12" className='fill-sec group-hover:fill-sec/70'>
<path d="M11.78,10.72L2.56,1.5H6c0.41,0,0.75-0.34,0.75-0.75S6.41,0,6,0H0.75c-0.1,0-0.19,0.02-0.29,0.06
	C0.28,0.13,0.13,0.28,0.06,0.46C0.02,0.56,0,0.65,0,0.75V6c0,0.41,0.34,0.75,0.75,0.75S1.5,6.41,1.5,6V2.56l9.22,9.22
	c0.15,0.15,0.34,0.22,0.53,0.22s0.38-0.07,0.53-0.22C12.07,11.49,12.07,11.01,11.78,10.72z"/>

                                    </svg>
                                </div>
                            </div>
                        </a> */}
                            {/* <div className='dspace-10'></div>
                        <a href='#' className='flex items-center w-[128px] h-[28px] hover:bg-sec/10 hover:text-sec/70 rounded-xl px-2 group'>المطورين
                            <div className='icon-arrow'>
                                <div className='icon-style'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10px"
                                        height="10px" viewBox="0 0 12 12" className='fill-sec group-hover:fill-sec/70'>
<path d="M11.78,10.72L2.56,1.5H6c0.41,0,0.75-0.34,0.75-0.75S6.41,0,6,0H0.75c-0.1,0-0.19,0.02-0.29,0.06
	C0.28,0.13,0.13,0.28,0.06,0.46C0.02,0.56,0,0.65,0,0.75V6c0,0.41,0.34,0.75,0.75,0.75S1.5,6.41,1.5,6V2.56l9.22,9.22
	c0.15,0.15,0.34,0.22,0.53,0.22s0.38-0.07,0.53-0.22C12.07,11.49,12.07,11.01,11.78,10.72z"/>

                                    </svg>
                                </div>
                            </div>
                        </a> */}
                            <a href='#' className='flex items-center min-w-[164px] px-2 h-[28px] hover:bg-sec/10 hover:text-sec/70 rounded-xl group text-light text-sec text-xs'>التواصل معنا
                                <div className='icon-arrow'>
                                    <div className='icon-style'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10px"
                                            height="10px" viewBox="0 0 12 12" className='fill-sec group-hover:fill-sec/70'>
                                            <path d="M11.78,10.72L2.56,1.5H6c0.41,0,0.75-0.34,0.75-0.75S6.41,0,6,0H0.75c-0.1,0-0.19,0.02-0.29,0.06
	C0.28,0.13,0.13,0.28,0.06,0.46C0.02,0.56,0,0.65,0,0.75V6c0,0.41,0.34,0.75,0.75,0.75S1.5,6.41,1.5,6V2.56l9.22,9.22
	c0.15,0.15,0.34,0.22,0.53,0.22s0.38-0.07,0.53-0.22C12.07,11.49,12.07,11.01,11.78,10.72z"/>

                                        </svg>
                                    </div>
                                </div>
                            </a>
                        </div>


                        <div className='footer_column space-y-2'>
                            <div className='text-sec text-sm font-semibold px-3 pb-2'>قانوني</div>
                            <a href='/terms' className='flex items-center min-w-[164px] px-2 h-[28px] hover:bg-sec/10 hover:text-sec/70 rounded-xl group text-light text-sec text-xs'>شروط الإستخدام
                                <div className='icon-arrow'>
                                    <div className='icon-style'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10px"
                                            height="10px" viewBox="0 0 12 12" className='fill-sec group-hover:fill-sec/70'>
                                            <path d="M11.78,10.72L2.56,1.5H6c0.41,0,0.75-0.34,0.75-0.75S6.41,0,6,0H0.75c-0.1,0-0.19,0.02-0.29,0.06
	C0.28,0.13,0.13,0.28,0.06,0.46C0.02,0.56,0,0.65,0,0.75V6c0,0.41,0.34,0.75,0.75,0.75S1.5,6.41,1.5,6V2.56l9.22,9.22
	c0.15,0.15,0.34,0.22,0.53,0.22s0.38-0.07,0.53-0.22C12.07,11.49,12.07,11.01,11.78,10.72z"/>

                                        </svg>
                                    </div>
                                </div>
                            </a>
                            <a href='#' className='flex items-center min-w-[164px] px-2 h-[28px] hover:bg-sec/10 hover:text-sec/70 rounded-xl group text-light text-sec text-xs'>سياسة الخصوصية
                                <div className='icon-arrow'>
                                    <div className='icon-style'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10px"
                                            height="10px" viewBox="0 0 12 12" className='fill-sec group-hover:fill-sec/70'>
                                            <path d="M11.78,10.72L2.56,1.5H6c0.41,0,0.75-0.34,0.75-0.75S6.41,0,6,0H0.75c-0.1,0-0.19,0.02-0.29,0.06
	C0.28,0.13,0.13,0.28,0.06,0.46C0.02,0.56,0,0.65,0,0.75V6c0,0.41,0.34,0.75,0.75,0.75S1.5,6.41,1.5,6V2.56l9.22,9.22
	c0.15,0.15,0.34,0.22,0.53,0.22s0.38-0.07,0.53-0.22C12.07,11.49,12.07,11.01,11.78,10.72z"/>

                                        </svg>
                                    </div>
                                </div>
                            </a>
                            <a href='#' className='flex items-center min-w-[164px] px-2 h-[28px] hover:bg-sec/10 hover:text-sec/70 rounded-xl group text-light text-sec text-xs'>حماية المستهلك
                                <div className='icon-arrow'>
                                    <div className='icon-style'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10px"
                                            height="10px" viewBox="0 0 12 12" className='fill-sec group-hover:fill-sec/70'>
                                            <path d="M11.78,10.72L2.56,1.5H6c0.41,0,0.75-0.34,0.75-0.75S6.41,0,6,0H0.75c-0.1,0-0.19,0.02-0.29,0.06
	C0.28,0.13,0.13,0.28,0.06,0.46C0.02,0.56,0,0.65,0,0.75V6c0,0.41,0.34,0.75,0.75,0.75S1.5,6.41,1.5,6V2.56l9.22,9.22
	c0.15,0.15,0.34,0.22,0.53,0.22s0.38-0.07,0.53-0.22C12.07,11.49,12.07,11.01,11.78,10.72z"/>

                                        </svg>
                                    </div>
                                </div>
                            </a>
                        </div>


                        <div className='footer_column space-y-2'>
                            <div className='text-sec text-sm font-semibold px-3 pb-2'>مساعدة
                            </div>

                            <a href='#' className='flex items-center min-w-[164px] px-2 h-[28px] hover:bg-sec/10 hover:text-sec/70 rounded-xl group text-light text-sec text-xs'>الدليل السريع
                                <div className='icon-arrow'>
                                    <div className='icon-style'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10px"
                                            height="10px" viewBox="0 0 12 12" className='fill-sec group-hover:fill-sec/70'>
                                            <path d="M11.78,10.72L2.56,1.5H6c0.41,0,0.75-0.34,0.75-0.75S6.41,0,6,0H0.75c-0.1,0-0.19,0.02-0.29,0.06
	C0.28,0.13,0.13,0.28,0.06,0.46C0.02,0.56,0,0.65,0,0.75V6c0,0.41,0.34,0.75,0.75,0.75S1.5,6.41,1.5,6V2.56l9.22,9.22
	c0.15,0.15,0.34,0.22,0.53,0.22s0.38-0.07,0.53-0.22C12.07,11.49,12.07,11.01,11.78,10.72z"/>

                                        </svg>
                                    </div>
                                </div>
                            </a>

                            <a href='#' className='flex items-center min-w-[164px] px-2 h-[28px] hover:bg-sec/10 hover:text-sec/70 rounded-xl group text-light text-sec text-xs'>مركز المساعدة
                                <div className='icon-arrow'>
                                    <div className='icon-style'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10px"
                                            height="10px" viewBox="0 0 12 12" className='fill-sec group-hover:fill-sec/70'>
                                            <path d="M11.78,10.72L2.56,1.5H6c0.41,0,0.75-0.34,0.75-0.75S6.41,0,6,0H0.75c-0.1,0-0.19,0.02-0.29,0.06
	C0.28,0.13,0.13,0.28,0.06,0.46C0.02,0.56,0,0.65,0,0.75V6c0,0.41,0.34,0.75,0.75,0.75S1.5,6.41,1.5,6V2.56l9.22,9.22
	c0.15,0.15,0.34,0.22,0.53,0.22s0.38-0.07,0.53-0.22C12.07,11.49,12.07,11.01,11.78,10.72z"/>

                                        </svg>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='w-full h-[1px] bg-sec08 mt-8'></div>
                    <div className='flex items-center text-sec text-xs h-10 py-8'>
                        {process.env.REACT_APP_NAME}, Inc. {new Date().getFullYear()} ©
                    </div>
                </div>
            </footer>
        </div>
    );
}