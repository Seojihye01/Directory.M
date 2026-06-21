import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Main_4.css';

// 장르 그리드 컴포넌트 (리렌더링 차단용 Memo)
const GenreGrid = React.memo(({ genres, isFocus }: { genres: string[], isFocus: boolean }) => {
  return (
    <div className="genre_grid">
      {genres.map((genre, i) => (
        <span key={`${isFocus ? 'focus' : 'black'}-${i}`} className={`genre_item ${isFocus ? 'focus' : ''}`}>
          {genre}
        </span>
      ))}
    </div>
  );
});
GenreGrid.displayName = 'GenreGrid';

const Main_4 = () => {
    const navigate = useNavigate(); 
    const containerRef = useRef<HTMLDivElement>(null);
    
    // 🌟 1. 좌표를 직접 꽂아넣을 돔(DOM) 참조 지점 생성
    const locRef = useRef<HTMLDivElement>(null);
    const [currentTime, setCurrentTime] = useState<string>("");

    const allGenres = useMemo(() => [
        "ACTION", "ROMANCE", "THRILLER", "COMEDY", "DRAMA", 
        "SCI-FI", "HORROR", "DOCUMENTARY", "ANIMATION", "NOIR", 
        "FANTASY", "CRIME", "MYSTERY", "ADVENTURE"
    ], []);

    const displayGenres = useMemo(() => Array.from({ length: 10 }, () => allGenres).flat(), [allGenres]);

    // 🌟 2. 마스크 위치를 바꿀 때, locRef를 이용해 글자도 같이 리렌더링 없이 바꿔줍니다.
    const updateMaskPosition = (clientX: number, clientY: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        // GPU 가속용 CSS 변수 설정 (리렌더링 X)
        containerRef.current.style.setProperty('--mouse-x', `${x}px`);
        containerRef.current.style.setProperty('--mouse-y', `${y}px`);

        // 🌟 돔에 직접 텍스트를 밀어 넣어 컴포넌트가 멈칫하는 현상을 원천 차단합니다.
        if (locRef.current) {
            locRef.current.textContent = `LOC: [ ${x.toFixed(0)}, ${y.toFixed(0)} ]`;
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        updateMaskPosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length > 0) {
            updateMaskPosition(e.touches[0].clientX, e.touches[0].clientY);
        }
    };

    // 모바일 터치 스크롤 방지
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const preventDefaultTouch = (e: TouchEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('.bottom_right.clickable')) return;
            if (e.cancelable) e.preventDefault();
        };

        container.addEventListener('touchmove', preventDefaultTouch, { passive: false });
        return () => container.removeEventListener('touchmove', preventDefaultTouch);
    }, []);

    // 시계 타이머
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
            const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setCurrentTime(`${dateStr} / ${timeStr}`);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="genre_container" ref={containerRef} onMouseMove={handleMouseMove} 
               onTouchMove={handleTouchMove} onTouchStart={handleTouchMove} data-theme="dark">
          <div className="hud_overlay">
            <div className="hud_item top_left">
                <span className="blink_icon">●</span> SYSTEM: SCANNING DATA // SOURCE: MOVIEDATA.TS
            </div>
            
            <div className="hud_item bottom_left">
              <div className="loc_data" ref={locRef}>LOC: [ 150, 300 ]</div>
              <div className="time_data">{currentTime}</div>
              <div className="hud_title">PROJECT_DIRECTORY.M</div>
            </div>
            
            <div className="hud_item bottom_right clickable" onClick={() => navigate('/explore')} onTouchEnd={(e) => { e.stopPropagation(); navigate('/explore'); }}>
                <div className="hud_main_cta">MISSION: EXPLORE</div>
            </div>
          </div>
          
          <div className="base_white_bg" />

          <div className="text_layer_black">
              <GenreGrid genres={displayGenres} isFocus={false} />
          </div>

          <div className="mask_layer_black" />
            
          <div className="focus_layer">
              <GenreGrid genres={displayGenres} isFocus={true} />
          </div>
        </div>
    );
};

export default Main_4;