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

  // 1. 가로로 더 넓게 흩어지도록 배치
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

  // ⭐️ 괄호 구조 및 휠 스크롤 고정 로직 정밀 수정
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const target = containerRef.current;
      if (!target) return;

      // [상황 1] 프로그레스가 0 ~ 99.99일 때: 무조건 스크롤을 막고 줌인 애니메이션 진행
      if (progress < 100) {
        if (e.cancelable) e.preventDefault();

        const sensitivity = 0.08;
        setProgress((prev) => {
          const next = prev + e.deltaY * sensitivity;
          return Math.min(Math.max(next, 0), 100);
        });

        window.scrollTo({ top: target.offsetTop, behavior: 'auto' });
      } 
      // [상황 2] 프로그레스가 100에 완전히 도달했을 때
      else if (progress === 100) {
        const scrollingDown = e.deltaY > 0;
        const scrollingUp = e.deltaY < 0;

        if (scrollingUp) {
          if (e.cancelable) e.preventDefault();
          setProgress(99); // 위로 올리면 즉시 다시 스크롤 락을 걸고 연출 복구
          return;
        }

        // 아래로 스크롤할 때: delay_ended 클래스가 없으면 한 번 홀딩 후 강제 부여
        if (scrollingDown && !target.classList.contains('delay_ended')) {
          if (e.cancelable) e.preventDefault();
          window.scrollTo({ top: target.offsetTop, behavior: 'auto' });
          target.classList.add('delay_ended');
          return;
        }
        
        // delay_ended가 추가된 상태에서 한 번 더 아래로 휠을 굴리면 락 해제되어 다음 섹션으로 이동함
      }
    };

    const target = containerRef.current;
    if (target) {
      target.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (target) target.removeEventListener('wheel', handleWheel);
    };
  }, [progress]);

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
          if (!pos) return null; // 안전장치 추가
          
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
            transform: `scale(${1 + scaleProgress * (window.innerWidth < 768 ? 4 : 8)})`,
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