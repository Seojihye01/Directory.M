import { useState, useEffect, useRef } from "react";
import { allMovies, type Movie } from "./MovieData";
import './Explore_5.css';

interface ExploreProps {
    onMovieClick: (movie: Movie) => void;
    isModalOpen: boolean;
    activeTab: string; // 부모가 관리하는 activeTab을 받음
    setActiveTab: (tab: string) => void; // 탭 변경 함수를 부모로부터 받음
}

const Explore_5 = ({ onMovieClick, isModalOpen, activeTab, setActiveTab }: ExploreProps) => {
    const categoryData: { [key: string]: Movie[] } = {
        "TOP": [allMovies[15], allMovies[10], allMovies[3], allMovies[0], allMovies[8]], 
        "NEW": [allMovies[10], allMovies[0], allMovies[2], allMovies[5], allMovies[12]],
        "WATCHING": [allMovies[1], allMovies[4], allMovies[12], allMovies[15], allMovies[6]],
        "MY PALATE": [allMovies[13], allMovies[14], allMovies[11], allMovies[1], allMovies[16]],
    };

    const [step, setStep] = useState(0);
    const [isInside, setIsInside] = useState(false);
    const [currentDate, setCurrentDate] = useState("");
    const sectionRef = useRef<HTMLElement>(null);
    const isAnimating = useRef(false);

    useEffect(() => {
        const now = new Date();
        setCurrentDate(`${now.toLocaleString('en-US', { month: 'short' }).toUpperCase()}, ${now.getFullYear()}`);
    }, []);

    // 섹션 위치를 강제로 화면 상단에 고정하는 함수
    const forceScrollToSection = () => {
        const isModalActive = document.body.style.overflow === 'hidden' || !!document.querySelector('.modal_backdrop');

        if (isModalActive) return;
        // 모달이 열려있을 때는 절대로 강제 스크롤을 하지 않음
        if (isModalOpen || document.body.style.overflow === 'hidden') return;
        
        if (sectionRef.current) {
            const yOffset = sectionRef.current.offsetTop;
            window.scrollTo({
                top: yOffset,
                behavior: "smooth"
            });
        }
    };

    useEffect(() => {
        const handleScrollControl = (e: WheelEvent) => {
            const isModalActive = document.body.style.overflow === 'hidden' || !!document.querySelector('.modal_backdrop');

            if (isModalActive) return;
            if (!isInside || !sectionRef.current || isModalActive) return;
            
            // 애니메이션 락이 걸려있으면 모든 스크롤 무시
            if (isAnimating.current) {
                e.preventDefault();
                return;
            }

            const scrollingDown = e.deltaY > 0;
            const scrollingUp = e.deltaY < 0;

            // --- [STEP 0: 중앙 제목 상태] ---
            if (step === 0) {
                if (scrollingDown) {
                    // 수정: 휠을 내려도 step 1로 가지 않고 섹션 내에만 머무름 (클릭 유도)
                    e.preventDefault();
                    forceScrollToSection(); 
                }
                // 위로 올릴 때는 자연스럽게 이전 섹션 이동 가능
                return;
            }

            // --- [STEP 1: 콘텐츠 활성화 상태] ---
            if (step === 1) {
                if (scrollingUp) {
                    // 역스크롤 시: 이전 섹션으로 튕기지 않게 막고 step 0으로 복귀
                    e.preventDefault();
                    isAnimating.current = true;
                    forceScrollToSection(); 
                    setStep(0);
                    setTimeout(() => { isAnimating.current = false; }, 1000);
                } 
                // 아래로 내릴 때는 다음 섹션으로 이동 허용
            }
        };

        window.addEventListener('wheel', handleScrollControl, { passive: false });
        return () => window.removeEventListener('wheel', handleScrollControl);
    }, [isInside, step, isModalOpen]);

    // 텍스트 클릭 시에만 Step 전환 실행
    const handleTitleClick = () => {
        if (isAnimating.current) return;
        
        isAnimating.current = true;
        forceScrollToSection();
        setStep(prev => (prev === 0 ? 1 : 0));
        
        // 전환 애니메이션 동안 추가 조작 방지
        setTimeout(() => { isAnimating.current = false; }, 1000);
    };

    return (
        <section 
            ref={sectionRef} data-theme="dark"
            className={`ex5_container step_${step}`} 
            onMouseEnter={() => setIsInside(true)}
            onMouseLeave={() => setIsInside(false)}
        >
            <div className="ex5_inner">
                <div className="ex5_left_area">
                    <div 
                        className={`ex5_black_frame ${step === 1 ? 'visible' : ''}`}
                        style={{ 
                            pointerEvents: step === 1 ? 'auto' : 'none',
                            visibility: step === 1 ? 'visible' : 'hidden' 
                        }}
                    >
                        <div className="ex5_grid">
                            {categoryData[activeTab].map((movie, idx) => (
                                <div key={idx} className={`ex5_slot slot_${idx + 1}`} onClick={() => onMovieClick(movie)}>
                                    <img src={movie.img} alt={movie.title} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="ex5_right_area">
                    <div className="ex5_info_panel">
                        {/* 이 텍스트를 클릭할 때만 step0 <-> step1 전환 가능 */}
                        <p className="ex5_sub_title" onClick={handleTitleClick} style={{ pointerEvents: 'auto', cursor: 'pointer' }}>
                            DISCOVERY FOR YOU
                        </p>

                        <nav 
                            className={`ex5_tabs ${step === 1 ? 'visible' : ''}`}
                            style={{ 
                                pointerEvents: step === 1 ? 'auto' : 'none',
                                visibility: step === 1 ? 'visible' : 'hidden'
                            }}
                        >
                            {Object.keys(categoryData).map((tab) => (
                                <h2 key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>{tab}</h2>
                            ))}
                        </nav>
                        <div className={`ex5_date ${step === 1 ? 'visible' : ''}`}>{currentDate}</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Explore_5;