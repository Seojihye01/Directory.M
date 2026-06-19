import React, { useState, useEffect, useMemo, useRef } from 'react';
import './Funding_1.css';

const JOBS = [
  "cinematographer", "makeup artist", "photographer director", "costume designer",
  "sound engineer", "editor", "choreographer", "film critic", "actress", "producer",
  "sfx", "stroyboard artist", "gaffer", "screen writer", "production designer",
  "lighting technician", "assistant director", "script supervisor", "location manager",
  "foley artist", "colourist", "music supervisor", "Line Producer", "Key Grip", 
  "Script Supervisor", "unit publicist", "set decorator", "Armorer", "greenman",
  "concept artist", "dit", "animal wrangler", "director", "investor"
];

const Funding_1 = () => {
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const touchStartY = useRef(0);

  // 실시간 progress 값을 이벤트 리스너 안에서 최신으로 참조하기 위한 래핑
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // 가로로 더 넓게 흩어지도록 배치
  const jobPositions = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth < 1024;

    return JOBS.map((_, idx) => {
      const layer = idx % 3; 
      let radiusX = [300, 500, 800][layer]; 
      let radiusY = [150, 250, 350][layer]; 

      if (isMobile) {
        radiusX = [120, 220, 350][layer]; 
        radiusY = [80, 150, 250][layer];
      } else if (isTablet) {
        radiusX = [200, 350, 550][layer]; 
        radiusY = [120, 200, 300][layer];
      }

      const angle = (idx / (JOBS.length / 3)) * Math.PI * 2 + (Math.random() * 0.5);

      return {
        initialX: Math.cos(angle) * radiusX + (Math.random() - 0.5) * 100,
        initialY: Math.sin(angle) * radiusY + (Math.random() - 0.5) * 50,
      };
    });
  }, []);

  // ⭐️ [핵심 교정] PC 휠 스크롤 및 모바일 터치 무브 스크롤 통합 락 로직
  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;

    // 공통 프로그레스 변경 함수
    const updateProgress = (deltaY: number, factor: number) => {
      setProgress((prev) => {
        const next = prev + deltaY * factor;
        return Math.min(Math.max(next, 0), 100);
      });
    };

    // 1. 데스크톱 마우스 휠 제어
    const handleWheel = (e: WheelEvent) => {
      const currentProgress = progressRef.current;

      if (currentProgress < 100) {
        if (e.cancelable) e.preventDefault();
        updateProgress(e.deltaY, 0.08);
        window.scrollTo({ top: target.offsetTop, behavior: 'auto' });
      } 
      else if (currentProgress === 100) {
        const scrollingUp = e.deltaY < 0;
        const scrollingDown = e.deltaY > 0;

        if (scrollingUp) {
          if (e.cancelable) e.preventDefault();
          setProgress(99); 
          return;
        }

        if (scrollingDown && !target.classList.contains('delay_ended')) {
          if (e.cancelable) e.preventDefault();
          window.scrollTo({ top: target.offsetTop, behavior: 'auto' });
          target.classList.add('delay_ended');
          return;
        }
      }
    };

    // 2. 모바일 터치 스타트 (처음 터치한 지점 저장)
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    // 3. 모바일 터치 무브 (드래그 스크롤 제어 및 수치 변환)
    const handleTouchMove = (e: TouchEvent) => {
      const currentProgress = progressRef.current;
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY.current - currentY; // 쓸어올리면 양수(다운스크롤), 내리면 음수(업스크롤)

      if (currentProgress < 100) {
        // 프로그레스가 다 차기 전에는 모바일 기본 브라우저 스크롤 강제 차단
        if (e.cancelable) e.preventDefault();
        
        // 터치 감도를 조절하여 자연스럽게 프로그레스가 쌓이도록 설정 (0.4)
        updateProgress(deltaY, 0.4); 
        touchStartY.current = currentY; // 연속적인 드래그 계산을 위해 터치 시작점 갱신
        
        window.scrollTo({ top: target.offsetTop, behavior: 'auto' });
      } 
      else if (currentProgress === 100) {
        const scrollingUp = deltaY < 0;
        const scrollingDown = deltaY > 0;

        if (scrollingUp) {
          if (e.cancelable) e.preventDefault();
          setProgress(99);
          target.classList.remove('delay_ended');
          return;
        }

        // 마지막 홀딩 연출 처리
        if (scrollingDown && !target.classList.contains('delay_ended')) {
          if (e.cancelable) e.preventDefault();
          window.scrollTo({ top: target.offsetTop, behavior: 'auto' });
          target.classList.add('delay_ended');
          return;
        }
      }
    };

    // 글로벌 이벤트 바인딩
    target.addEventListener('wheel', handleWheel, { passive: false });
    target.addEventListener('touchstart', handleTouchStart, { passive: true });
    target.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      target.removeEventListener('wheel', handleWheel);
      target.removeEventListener('touchstart', handleTouchStart);
      target.removeEventListener('touchmove', handleTouchMove);
    };
  }, []); // 의존성 배열을 비워 리스너가 중복 중첩 생성되는 현상을 차단합니다.

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    });
  };

  const getScaleProgress = () => {
    const threshold = 30; 
    if (progress < threshold) return 0;
    return (progress - threshold) / (100 - threshold);
  };

  const scaleProgress = getScaleProgress();

  return (
    <section className="supporter_section" ref={containerRef} onMouseMove={handleMouseMove} data-theme="light">
      <div className="interaction_wrapper">
        {JOBS.map((job, idx) => {
          const pos = jobPositions[idx];
          if (!pos) return null;
          
          const scatterFactor = window.innerWidth < 768 ? 0.015 : 0.03;
          let tx = pos.initialX * (1 + progress * scatterFactor);
          let ty = pos.initialY * (1 + progress * scatterFactor);

          const dx = tx - mousePos.x;
          const dy = ty - mousePos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const push = dist < 150 ? (150 - dist) * 0.6 : 0;
          
          tx += (dx / (dist || 1)) * push;
          ty += (dy / (dist || 1)) * push;

          return (
            <span
              key={idx}
              className="job_tag"
              style={{
                transform: `translate(${tx}px, ${ty}px)`,
                opacity: 1 - progress / 90,
                fontSize: window.innerWidth < 768 ? '10px' : '14px',
                transition: 'transform 0.4s ease-out'
              }}
            >
              {job}
            </span>
          );
        })}

        <h1 
          className="center_supporter"
          style={{
            transform: `scale(${1 + scaleProgress * (window.innerWidth < 768 ? 3 : 8)})`, // ⭐️ 모바일 scale 배율 최적화 (터짐 방지)
            fontWeight: 300 + Math.floor(scaleProgress * 500),
            letterSpacing: `${scaleProgress * 10}%`,
          }}
        >
          SUPPORTER
        </h1>
      </div>
    </section>
  );
};

export default Funding_1;