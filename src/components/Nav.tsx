import { useState, useEffect } from 'react';
import './Nav.css';

interface NavProps {
    isMenuOpen?: boolean; // 헤더 메뉴가 열렸는지 여부를 props로 받음
}

const Nav = ({ isMenuOpen }: NavProps) => {
    const [isDarkSection, setIsDarkSection] = useState(true); // 기본값은 어두운 배경(흰색 아이콘)
    const [activeSection, setActiveSection] = useState('hero'); // 현재 활성화된 섹션 상태
    
    // 반응형 라벨용: 최근에 클릭(터치)된 섹션 ID를 저장하는 상태
    const [clickedSectionId, setClickedSectionId] = useState<string | null>(null);

    if (isMenuOpen) return null;

    const sections = [
        { id: 'hero', label: 'DIRECTORY.M' },
        { id: 'about', label: 'ABOUT' },
        { id: 'curation', label: 'CURATION' },
        { id: 'explore', label: 'EXPLORE' },
        { id: 'funding', label: 'FUNDING' }
    ];

    // IntersectionObserver를 이용한 스크롤 감지
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // 섹션의 data-theme 속성을 확인
                        const theme = entry.target.getAttribute('data-theme');
                        setIsDarkSection(theme === 'dark' || !theme); 

                        // 현재 교차된 섹션의 ID를 active 상태로 저장
                        const id = entry.target.id;
                        if (id) setActiveSection(id);
                    }
                });
            },
            { threshold: 0.5 } // 섹션이 절반 이상 보일 때 변경
        );

        const sectionElements = document.querySelectorAll('[data-theme], #hero, #about, #curation, #explore, #funding');
        sectionElements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    // 부드러운 스크롤 이동 함수
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = element.offsetTop; 
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    };

    // 버튼 클릭 시 실행될 헨들러
    const handleBtnClick = (sectionId: string) => {
        scrollToSection(sectionId); // 1. 스크롤 이동
        setClickedSectionId(sectionId); // 2. 클릭된 아이디 저장하여 라벨 오픈
    };

    // 3초 뒤에 클릭 상태를 초기화하여 라벨을 숨기는 타이머
    useEffect(() => {
        if (!clickedSectionId) return;

        const timer = setTimeout(() => {
            setClickedSectionId(null);
        }, 3000); 

        return () => clearTimeout(timer);
    }, [clickedSectionId]);

    return (
        <nav className={`elevator_nav ${isDarkSection ? 'theme_dark' : 'theme_light'}`}>
            {sections.map((sec) => {
                const isActive = activeSection === sec.id; // 현재 화면에 위치한 섹션인지 여부
                
                // 현재 위치한 섹션 + 클릭해서 이동된 상태일 때만 true
                const showLabel = isActive && clickedSectionId === sec.id;

                return (
                    <button 
                        key={sec.id} 
                        onClick={() => handleBtnClick(sec.id)}
                        className={`elevator_btn ${isActive ? 'active' : ''} ${showLabel ? 'show-label' : ''}`}
                    >
                        <span className="label">{sec.label}</span>
                        <span className="dot" />
                    </button>
                );
            })}
        </nav>
    );
};

export default Nav;