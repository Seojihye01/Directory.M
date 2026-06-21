import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import './Main_5.css';

const Main_5: React.FC = () => {
    const [displayFunded, setDisplayFunded] = useState(124500000);
    const [displaySupporters, setDisplaySupporters] = useState(5241);
    const targetFunded = useRef(124500000);
    const targetSupporters = useRef(5241);
    const navigate = useNavigate();

    const [time, setTime] = useState(new Date());

    const animateCount = (start: number, end: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
        let startTime: number | null = null;
        const duration = 2000; 
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setter(Math.floor(progress * (end - start) + start));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        const dataTimer = setInterval(() => {
            const oldFund = targetFunded.current;
            const oldSupp = targetSupporters.current;
            targetFunded.current += Math.floor(Math.random() * 500000) + 100000;
            targetSupporters.current += Math.floor(Math.random() * 5) + 1;
            animateCount(oldFund, targetFunded.current, setDisplayFunded);
            animateCount(oldSupp, targetSupporters.current, setDisplaySupporters);
        }, 7000);
        return () => { clearInterval(timer); clearInterval(dataTimer); };
    }, []);

    const seconds = time.getSeconds();
    const secondDeg = (seconds / 60) * 360;
    const minuteDeg = (time.getMinutes() / 60) * 360;
    const hourDeg = ((time.getHours() % 12) / 12) * 360;

    const activeStep = secondDeg >= 315 || secondDeg < 45 ? "DEV" : 
                       secondDeg < 135 ? "PROD" : 
                       secondDeg < 225 ? "POST" : "READY";

    const handleCtaClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
        setTimeout(() => {
            navigate('/funding');
        }, 600);
      }
    };

    return (
        <section className="main5_container" data-theme="light">
            <div className="main5_inner">
                <div className="main5_clock_area">
                    <div className="classic_clock_outer">
                        <div className="classic_clock_inner">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="clock_mark" style={{ transform: `rotate(${i * 30}deg)` }}></div>
                            ))}
                            
                            <div className={`main5_step_label dev ${activeStep === "DEV" ? "on" : ""}`}>DEV</div>
                            <div className={`main5_step_label prod ${activeStep === "PROD" ? "on" : ""}`}>PROD</div>
                            <div className={`main5_step_label post ${activeStep === "POST" ? "on" : ""}`}>POST</div>
                            <div className={`main5_step_label ready ${activeStep === "READY" ? "on" : ""}`}>READY</div>

                            <div className="main5_hand h_hour" style={{ transform: `rotate(${hourDeg}deg)` }}></div>
                            <div className="main5_hand h_min" style={{ transform: `rotate(${minuteDeg}deg)` }}></div>
                            <div className="main5_hand h_sec" style={{ transform: `rotate(${secondDeg}deg)` }}></div>
                            <div className="main5_center_pin"></div>
                        </div>
                    </div>
                </div>

                <div className="main5_content_area">
                    <div className="main5_status_list">
                        <div className="main5_status_item">
                            <span className="main5_label">Funding Amount</span>
                            <span className="main5_value">₩{displayFunded.toLocaleString()}+</span>
                        </div>
                        <div className="main5_status_item">
                            <span className="main5_label">Active Supporters</span>
                            <span className="main5_value"> {displaySupporters.toLocaleString()}+ </span>
                        </div>
                    </div>                    
                       
                    <p className="main5_question">Want to be part of the scene?</p>

                    <div className="main5_cta_group">
                        <label className="main5_custom_check_btn">
                            <span className="main5_check_label">VIEW OUR LINEUP</span>
                            <div className="checkbox_wrapper">
                                <input type="checkbox" onChange={handleCtaClick} />
                                <span className="main5_check_box">
                                    <img src="/media/etc/check_bold.svg" alt="check" className="check_img" />
                                </span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Main_5;