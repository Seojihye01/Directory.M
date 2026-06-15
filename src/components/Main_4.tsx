import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import './Main_4.css';

const Main_4 = () => {
    const navigate = useNavigate(); 
    const [mousePos, setMousePos] = useState({ x: 150, y: 300 });
    const containerRef = useRef<HTMLDivElement>(null);

    const allGenres = [
        "ACTION", "ROMANCE", "THRILLER", "COMEDY", "DRAMA", 
        "SCI-FI", "HORROR", "DOCUMENTARY", "ANIMATION", "NOIR", 
        "FANTASY", "CRIME", "MYSTERY", "ADVENTURE"
    ];

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // 브라우저의 기본 터치 스크롤 동작을 완전히 무효화함
        const preventDefaultTouch = (e: TouchEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('.bottom_right.clickable')) {
                return; 
            }

            if (e.cancelable) e.preventDefault();
        };

        // passive: false를 주어야만 preventDefault가 완벽하게 동작
        container.addEventListener('touchmove', preventDefaultTouch, { passive: false });
        container.addEventListener('touchstart', preventDefaultTouch, { passive: false });

        return () => {
            container.removeEventListener('touchmove', preventDefaultTouch);
            container.removeEventListener('touchstart', preventDefaultTouch);
        };
    }, []);

    const displayGenres = Array.from({ length: 10 }, () => allGenres).flat();

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (!containerRef.current) return;

      if (e.cancelable) e.preventDefault();
      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      setMousePos({
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top
      });
    };

    const [currentTime, setCurrentTime] = useState<string>("");

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
            const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setCurrentTime(`${dateStr} / ${timeStr}`);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleExploreClick = () => {
        navigate('/explore'); 
    };

    return (
        <div className="genre_container" ref={containerRef} onMouseMove={handleMouseMove} 
               onTouchMove={handleTouchMove} onTouchStart={handleTouchMove} data-theme="dark">
          <div className="hud_overlay">
            <div className="hud_item top_left">
                <span className="blink_icon">●</span> SYSTEM: SCANNING DATA
                <span className="blink_icon"></span> // SOURCE: MOVIEDATA.TS
            </div>

            <div className="hud_item bottom_left">
              <div className="loc_data">LOC: [ {mousePos.x.toFixed(0)}, {mousePos.y.toFixed(0)} ]</div>
              <div className="time_data">{currentTime}</div>
              <div className="hud_title">PROJECT_DIRECTORY.M</div>
            </div>

            <div className="hud_item bottom_right clickable" onClick={handleExploreClick}
                onTouchEnd={(e) => {
                    e.stopPropagation(); // 이벤트가 부모 캔버스로 퍼져서 차단되는 걸 막음
                    handleExploreClick();
                    }}>
                <div className="hud_main_cta">MISSION: EXPLORE</div>
            </div>
          </div>
            <div className="base_white_bg" />

            <div className="text_layer_black">
                <div className="genre_grid">
                    {displayGenres.map((genre, i) => (
                        <span key={`black-${i}`} className="genre_item">{genre}</span>
                    ))}
                </div>
            </div>

            <motion.div 
                className="mask_layer_black"
                style={{
                    WebkitMaskImage: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, black 100%)`,
                    maskImage: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, black 100%)`
                }}
            />
            
            <div 
                className="focus_layer"
                style={{
                    WebkitMaskImage: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
                    maskImage: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`
                }}
            >
                <div className="genre_grid">
                    {displayGenres.map((genre, i) => (
                        <span key={`focus-${i}`} className="genre_item focus">{genre}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Main_4;