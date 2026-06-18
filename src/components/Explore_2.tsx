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

    // 1. 관찰자 설정 (진입 감지)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                setIsIntersecting(entry.isIntersecting);
                setIsInside(entry.isIntersecting);
                // 섹션을 벗어나면 진행도 초기화 (다시 들어왔을 때 재클릭 가능하게)
                if (!entry.isIntersecting) {
                    setProgress(0);
                    progressRef.current = 0;
                }
            },
            { threshold: 0.5 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // 2. 클릭 시 줌인 핵심 함수
    const handleLunarZoom = () => {
        if (isAnimating.current || progressRef.current === 1) return;

        isAnimating.current = true;
        setProgress(1); // 진행도를 1로 즉시 변경 (CSS에서 확대됨)
        progressRef.current = 1;

        // 1.2초 동안 Lunar가 화면을 덮는 연출 후 다음 섹션으로 이동
        setTimeout(() => {
            const nextSection = document.getElementById('explore_3_section');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            // 이동 후 애니메이션 상태 해제
            setTimeout(() => {
                isAnimating.current = false;
            }, 1000);
        }, 1500); // CSS transition 시간(1.5s)보다 약간 짧게 설정하여 몰입감 조절
    };

    // 스케일 계산: progress가 1이 되면 35배까지 커지며 암전 효과
    const moonScale = 1 + (progress * 34);

    return (
        <section ref={sectionRef} data-theme="dark" className="explore_2_wrapper">
            <div className="ex2_sticky_box">
                <div className="bg_stars_fixed" />
                <div 
                    className="bg_lunar_layer" 
                    onClick={handleLunarZoom}
                    style={{ 
                        transform: `translate(-50%, -50%) scale(${moonScale})`,
                        opacity: 1,
                        // 확대 시 가속도를 붙여 빨려 들어가는 느낌 극대화
                        transition: progress === 1 
                            ? 'transform 2.5s cubic-bezier(0.7, 0, 0.3, 1)' 
                            : 'transform 0.8s ease-out',
                        animation: progress === 1 ? 'none' : 'pulseBlink 2s infinite ease-in-out'
                    }}
                />
                
                {/* 텍스트는 줌이 시작되면 빠르게 사라지게 설정 */}
                <div className="ex2_text_layer" style={{ 
                    opacity: progress === 1 ? 0 : 1,
                    transition: 'opacity 0.4s ease'
                }}>
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