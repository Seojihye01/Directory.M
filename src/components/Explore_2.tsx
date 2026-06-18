import { useState, useEffect, useRef } from 'react';
import './Explore_2.css';

interface ExploreProps {
    isModalOpen: boolean;
}

const Explore_2 = ({ isModalOpen }: ExploreProps) => {
    const [progress, setProgress] = useState(0);
    const [isInside, setIsInside] = useState(false);
    const [isIntersecting, setIsIntersecting] = useState(false);
    
    const sectionRef = useRef<HTMLElement>(null);
    const progressRef = useRef(0);
    const isAnimating = useRef(false);

    const getFormattedDate = () => {
        const now = new Date();
        const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
        return `${monthNames[now.getMonth()]} ${now.getFullYear()} ISSUE`;
    };

    // 1. 관찰자 설정
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]) => { // 타입을 명시적으로 지정
                const [entry] = entries;
                setIsIntersecting(entry.isIntersecting);
                // 모바일 터치 대응을 위해 IntersectionObserver로 진입 판정 일치화
                if (entry.isIntersecting) {
                    setIsInside(true);
                } else {
                    setIsInside(false);
                }
            },
            { threshold: 0.8 }
        );

        const currentSection = sectionRef.current;
        if (currentSection) observer.observe(currentSection);
        return () => observer.disconnect();
    }, []);

    // 2. 휠 이벤트 핸들러
    useEffect(() => {
        const handleGlobalWheel = (e: WheelEvent) => {
            // [방어 1] 모달 상태 체크 (props와 DOM 상태 둘 다 확인)
            const isModalActive = isModalOpen || document.body.style.overflow === 'hidden' || !!document.querySelector('.modal_backdrop');
            if (isModalActive) return;

            // [방어 2] 물리적 위치 체크
            if (!sectionRef.current) return; // Null 체크 먼저 수행
            
            const rect = sectionRef.current.getBoundingClientRect();
            if (Math.abs(rect.top) > 250) return; 

            // 상태 체크
            if (!isInside || !isIntersecting) return;

            const scrollingDown = e.deltaY > 0;
            const scrollingUp = e.deltaY < 0;

            if (scrollingUp && progressRef.current <= 0) return;
            

            if (scrollingDown && progressRef.current >= 1) {
                if (!isAnimating.current) {return;
            }
        }

            if (isAnimating.current) {
                e.preventDefault();
                return;
            }

            // [핵심] 스크롤 고정 시도
            e.preventDefault();
            sectionRef.current.scrollIntoView({ behavior: 'auto', block: 'center' });

            isAnimating.current = true;
            const step = 0.125;
            let nextProgress = scrollingDown 
                ? Math.min(progressRef.current + step, 1) 
                : Math.max(progressRef.current - step, 0);

            setProgress(nextProgress);
            progressRef.current = nextProgress;

            if (nextProgress === 1 && scrollingDown) {
            const extraDelay = (nextProgress === 1 && scrollingDown) ? 300 : 0;
            setTimeout(() => {
                setIsInside(false);
                if (nextProgress === 1 && scrollingDown) setIsInside(false);
                setTimeout(() => {
                    const nextSection = document.getElementById('explore_3_section');
                    if (nextSection) {
                        // behavior: 'smooth'를 주면 클릭했을 때처럼 부드럽게 넘어갑니다.
                        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } isAnimating.current = false;
                }, 100);
            }, 400 + extraDelay); 
            } else {
                setTimeout(() => {
            isAnimating.current = false;
        }, 600);
            }
        };

        window.addEventListener('wheel', handleGlobalWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleGlobalWheel);
        
    }, [isInside, isIntersecting, isModalOpen]); // 의존성 배열에 모두 포함

    const activeProgress = Math.max(0, (progress - 0.3) / 0.7);
    const moonScale = 1 + (activeProgress * 14);

    return (
        <section ref={sectionRef} data-theme="dark" className="explore_2_wrapper">
            <div className="ex2_sticky_box">
                <div className="bg_stars_fixed" />
                <div 
                    className="bg_lunar_layer" 
                    style={{ 
                        transform: `translate(-50%, -50%) scale(${moonScale})`,
                        opacity: 1,
                        transition: 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease'
                    }}
                />
                <div className="ex2_text_layer" style={{ opacity: 1 - progress }}>
                    <h2 className="ex2_float t1">
                        {getFormattedDate()}
                        <span><br/>: BEYOND THE SPACE</span>
                    </h2>
                </div>
            </div>
        </section>
    );
};

export default Explore_2;