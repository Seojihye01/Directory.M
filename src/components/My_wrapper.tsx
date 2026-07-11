import React, { useState, useEffect } from 'react';
import './My_wrapper.css';
import { type Movie } from "./MovieData";
import MovieModal from "./Moviemodal";
import My_1 from './My_1';
import My_2 from './My_2';
import My_3 from './My_3';
import My_4 from './My_4';
import My_5 from './My_5';
import My_6 from './My_6';


// App.tsx로부터 전달받을 props 인터페이스 선언
interface MyWrapperProps {
  onMovieClick: (movie: Movie) => void;
  isSaved: boolean;
  activeTab: string;

}

// 공통으로 사용할 유저 데이터 타입 정의
export interface UserProfile {
  name: string;
  sirname: string;
  email: string;
  role: string;
  tier: string;
  cardNumber: string;
  sinceDate: string;
  favourite: string;
}

const MyWrapper: React.FC<MyWrapperProps> = ({ onMovieClick, isSaved, activeTab }) => {
  // 초기 기본값 세팅
  const [user, setUser] = useState<UserProfile>({
    name: "James",
    sirname : "dean",
    email: "jamesdeann@gmail.com",
    role: "Creator",
    tier: "PLATINUM",
    cardNumber: "000 001 2025 1201",
    sinceDate: "01 / 12 / 2025",
    favourite: "Fantasy"
  });

  const SECTIONS = [
  { id: 'account', label: 'ACCOUNT' }, 
  { id: 'library', label: 'LIBRARY' },
  { id: 'timeline', label: 'TIMELINE' },
  { id: 'project', label: 'PROJECT' },
  { id: 'username', label: `DIRECTORY.${user.sirname.toUpperCase()}` },
  ];
  
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleMenuClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleMovieSelect = (movie: Movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
        if (onMovieClick) onMovieClick(movie);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
    };

  useEffect(() => {
    if (selectedMovie) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    // 모달이 열리면 뒷배경 스크롤 완전 차단
      document.body.style.overflow = 'hidden';

      if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    } else {
    // 모달이 닫히면 스크롤 원상 복구
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    // 컴포넌트가 언마운트될 때를 대비한 클린업 코드
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [selectedMovie]);

  return (
    <div className="my-page-scroll-container" data-theme="light">
      <nav className={`mypage_navigation sticky_nav ${activeSection !== 'intro' ? 'visible' : 'hidden'}`}>
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => handleMenuClick(section.id)}
            className={`my_menu_item ${activeSection === section.id ? 'active' : 'inactive'}`}
          >
            {section.label}
          </button>
        ))}
      </nav>
      {/* 1번 섹션: 웰컴 타이틀과 메뉴바가 있는 메인 화면 */}
      <My_1 
        id="intro" 
        sections={SECTIONS} 
        handleMenuClick={handleMenuClick} 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <My_2 id="account" setActiveSection={setActiveSection} user={user} setUser={setUser} />
      <My_3 id="library" setActiveSection={setActiveSection} isSaved={isSaved} />
      <My_4 id="timeline" setActiveSection={setActiveSection} activeTab={activeTab} 
                          onMovieClick={handleMovieSelect} />
      <My_5 id="project" setActiveSection={setActiveSection} />
      <My_6 id="username" setActiveSection={setActiveSection} onMovieClick={handleMovieSelect}  user={user} />
  
      {isModalOpen && selectedMovie && (
                <MovieModal 
                    movie={selectedMovie} 
                    onClose={handleCloseModal} 
                    onMovieClick={handleMovieSelect} 
                />
        )}
    </div>
  );
};

export default MyWrapper;