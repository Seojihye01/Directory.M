import React, { useState, useEffect, useRef } from 'react';
import './Funding_2.css';

const MOVING_IMAGES = [
  { src: '/media/Funding/camera.jpg', pos: { top: '14%', left: '10%' } }, 
  { src: '/media/Funding/camera_set.jpg', pos: { top: '45%', left: '55%' } },
  { src: '/media/Funding/director.jpg', pos: { top: '50%', left: '15%' } },
];

const SLATE_DATA = {
  PRODUCTION: "Directory.M",
  SCENE: "01",
  TAKE: "FUNDING",
  DIRECTOR: "",
  DATE: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
};

const Funding_2 = () => {
  const [step, setStep] = useState(0);
  const [xy, setXY] = useState({ x: 0, y: 0 }); 
  const [count, setCount] = useState(5); 
  const [isVideoActive, setIsVideoActive] = useState(false); 
  const [isMuted, setIsMuted] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stepRef = useRef(0);
  const isVideoActiveRef = useRef(false); // 이벤트 핸들러 내부 즉시 판정용
  const isAnimating = useRef(false);
  const touchStartY = useRef(0);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    isVideoActiveRef.current = isVideoActive;
  }, [isVideoActive]);

  // 카운트다운 타이머 로직
  useEffect(() => {
    let timer: number;
    if (step === 6 && !isVideoActive && count > 0) {
      timer = window.setInterval(() => {
        setCount((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, isVideoActive, count]);

  // 스텝이 바뀌면 카운트다운 초기화
  useEffect(() => {
    if (step < 6) setCount(5);
  }, [step]);

  // 스크롤 가둠 및 모바일 터치 완벽 통제 타워
  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;

    const changeStep = (direction: 'next' | 'prev') => {
      if (isAnimating.current || isVideoActiveRef.current) return;
      const currentStep = stepRef.current;

      if (direction === 'next' && currentStep < 6) {
        isAnimating.current = true;
        setStep(currentStep + 1);
        setTimeout(() => { isAnimating.current = false; }, 800);
      } else if (direction === 'prev' && currentStep > 0) {
        isAnimating.current = true;
        setStep(currentStep - 1);
        setTimeout(() => { isAnimating.current = false; }, 800);
      }
    };

    // 1. 데스크톱 휠 스크롤 제어
    const handleGlobalWheel = (e: WheelEvent) => {
      if (isVideoActiveRef.current) return;
      const rect = target.getBoundingClientRect();
      const inView = rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
      if (!inView) return;

      const currentStep = stepRef.current;
      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      // 0단계에서 위로 탈출 허용
      if (currentStep === 0 && scrollingUp) return;
      
      // 6단계 카운트다운 중이거나 아직 영상 전이면 하단 탈출 잠금
      if (currentStep === 6 && !isVideoActiveRef.current) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'auto', block: 'center' });
        if (scrollingUp && !isAnimating.current) changeStep('prev');
        return;
      }

      // 영상 재생 중일 때는 가둠을 완전히 풀어 브라우저 스크롤 흐름 제공

      // 인터랙션 내부 스텝 전환 가둠
      e.preventDefault();
      target.scrollIntoView({ behavior: 'auto', block: 'center' });
      if (isAnimating.current) return;
      changeStep(scrollingDown ? 'next' : 'prev');
    };

    // 2. 모바일 터치 스타트
    const handleTouchStart = (e: TouchEvent) => {
      if (isVideoActiveRef.current) return;
      const rect = target.getBoundingClientRect();
      const inView = rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4;
      if (!inView) return;

      touchStartY.current = e.touches[0].clientY;
    };

    // 3. 모바일 터치 무브 알고리즘 (★완전 교정)
    const handleTouchMove = (e: TouchEvent) => {
      if (isVideoActiveRef.current) return;
      const rect = target.getBoundingClientRect();
      const inView = rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4;
      if (!inView) return;

      const currentStep = stepRef.current;
      const deltaY = touchStartY.current - e.touches[0].clientY; 
      const scrollingDown = deltaY > 0;
      const scrollingUp = deltaY < 0;

      // 영상이 이미 재생 중이면 터치 무브 락을 풀어 다음 섹션으로 가도록 유도

      // 0단계에서 위로 탈출할 때가 아니라면 모바일 네이티브 스크롤 강제 차단
      if (!(currentStep === 0 && scrollingUp)) {
        if (e.cancelable) e.preventDefault();
      } else {
        return; // 탈출
      }

      if (Math.abs(deltaY) < 40) return; // 감도 조절

      if (currentStep === 6 && !isVideoActiveRef.current) {
        target.scrollIntoView({ behavior: 'auto', block: 'center' });
        if (scrollingUp && !isAnimating.current) {
          changeStep('prev');
          touchStartY.current = e.touches[0].clientY;
        }
        return;
      }

      target.scrollIntoView({ behavior: 'auto', block: 'center' });
      if (isAnimating.current) return;

      touchStartY.current = e.touches[0].clientY;
      changeStep(scrollingDown ? 'next' : 'prev');
    };

    // passive: false 명시 주입으로 모바일 사파리 하이재킹 권한 탈환
    window.addEventListener('wheel', handleGlobalWheel, { passive: false });
    target.addEventListener('touchstart', handleTouchStart, { passive: true });
    target.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleGlobalWheel);
      target.removeEventListener('touchstart', handleTouchStart);
      target.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // 비디오 스타트 통합 핸들러 (PC/모바일 동일하게 안전 트리거링)
  const triggerStartVideo = () => {
    if (stepRef.current !== 6 || isVideoActiveRef.current || count > 0) return;
    
    setIsVideoActive(true);
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.play().catch(() => {
        // 브라우저 자동재생 거부 대응 오토 뮤트 백업
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play();
        }
      });
    }
  };

  const handleActionClick = (e: React.MouseEvent | React.TouchEvent) => {
    // 사운드 버튼 클릭 시 영상 멈춤 방지
    if ((e.target as HTMLElement).closest('.fu2_sound_wave_btn')) return;
    triggerStartVideo();
  };

  const handleSoundToggle = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation(); 
    if (videoRef.current && isVideoActiveRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const getTranslateX = () => {
    if (step <= 1) return 0;
    return (step - 1) * 100;
  };

  const [isResponsive, setIsResponsive] = useState(false);
  useEffect(() => {
    const checkDevice = () => {
      const responsive = window.innerWidth <= 1024;
      setIsResponsive(responsive);
      if (responsive) {
        setXY({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      }
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (step === 6 && !isResponsive) {
      setXY({ x: e.clientX, y: e.clientY });
    }
  };

  return (
    <section 
      ref={sectionRef} 
      data-theme="dark" 
      id="funding_2_section"
      className={`funding_3_section step_${step} ${step >= 5 ? 'is_dimmed' : ''} ${isVideoActive ? 'video_playing' : ''}`}
      onMouseMove={handleMouseMove} 
      onClick={handleActionClick} // 모바일 터치 중복을 피하기 위해 통합 클릭 핸들러 사용
      style={{ cursor: step === 6 && !isVideoActive && !isResponsive ? 'none' : 'default' }}
    >
      {/* PC 전용 커스텀 커서 */}
      {step === 6 && !isVideoActive && !isResponsive && (
        <div 
          className="fu2_custom_cursor" 
          style={{ left: xy.x, top: xy.y, position: 'fixed', pointerEvents: 'none', zIndex: 9999 }}
        >
          <div className="fu2_cursor_circle">
            <span key={count} className="fu2_cursor_text">
              {count > 0 ? count : "ACTION"}
            </span>
          </div>
        </div>
      )}

      {/* 모바일/태블릿 전용 액션 힌트 (이제 터치 클릭 유도 레이어로 작동) */}
      {isResponsive && step === 6 && !isVideoActive && (
        <div className="responsive_action_hint">
          <span key={count} className='hint_text'>{count > 0 ? `${count}` : 'ACTION'}</span>
        </div>
      )}

      <video
        ref={videoRef}
        className={`overlay_video ${isVideoActive ? 'active' : ''}`}
        src="/media/Funding/funding_.mp4"
        loop
        playsInline
      />

      <button 
        className={`fu2_sound_wave_btn ${isVideoActive ? 'visible' : ''} ${isMuted ? "muted" : "playing"}`}
        onClick={handleSoundToggle}
        onTouchEnd={handleSoundToggle} 
        aria-label="Toggle Sound"
      >
        <div className="fu2_wave_container">
          <span className="fu2_bar fu2_bar1"></span>
          <span className="fu2_bar fu2_bar2"></span>
          <span className="fu2_bar fu2_bar3"></span>
        </div>
        <span className="fu2_wave_btn_text">SOUND</span>
      </button>

      <div className="funding_viewport">
        <div 
          className="free_image_track" 
          style={{ 
            transform: `translateX(-${getTranslateX()}%)`,
            opacity: (step >= 2 && step <= 4) ? 1 : 0,
            transition: 'all 1.2s cubic-bezier(0.19, 1, 0.22, 1)'
          }}
        >
          <div className="image_frame_wrapper" />
          {MOVING_IMAGES.map((img, i) => {
            const isVisible = step >= i + 2;
            return (
              <div key={i} className="image_frame_wrapper">
                <div 
                  className="image_frame" 
                  style={{ 
                    top: img.pos.top, 
                    left: img.pos.left,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'opacity 0.8s ease, transform 1s ease'
                  }}
                >
                  <img src={img.src} alt={`scene ${i}`} />
                </div>
              </div>
            );
          })}
          <div className="image_frame_wrapper" />
        </div>

        {/* 슬레이트 보드 */}
        <div className={`glass_slate_fixed ${step === 6 ? 'active_click' : ''} ${isVideoActive ? 'fade_out' : ''}`}>
          <div className="glass_slate_board">
            <div className="slate_header">
              <h1>{SLATE_DATA.PRODUCTION}</h1>
            </div>
            <div className="slate_info_grid">
              <div className="info_item"><span>SCENE</span><p>{SLATE_DATA.SCENE}</p></div>
              <div className="info_item"><span>TAKE</span><p>{SLATE_DATA.TAKE}</p></div>
              <div className="info_item">
                <span>DIRECTOR</span>
                <p>{SLATE_DATA.DIRECTOR || <>&nbsp;</>}</p>
              </div>
              <div className="info_item">
                <span>CAMERA</span>
                <p>&nbsp;</p>
              </div>
              <div className="info_item long"><span>DATE</span><p>{SLATE_DATA.DATE}</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Funding_2;