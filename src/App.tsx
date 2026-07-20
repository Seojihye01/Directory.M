import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import "./App.css";

// 기존 컴포넌트들
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from "./components/Signup";
import Curation from "./components/Curation";
import Explore from "./components/Explore";
import { type Movie } from "./components/MovieData";
import MovieModal from "./components/Moviemodal";
import Player from "./components/Player";
import Funding from "./components/Funding";
import FundingEx from "./components/FundingEx";
import About from "./components/About";
import ScrollToTop from "./components/ScrollToTop";
import TopButton from "./components/TopBtn";
import Navigation from "./components/Nav"; // 엘리베이터 버튼
import My from "./components/My"; 
import Member from './components/Member';

function App() {
  const location = useLocation(); // 현재 경로 파악을 위해 추가
  const [scrollWidth, setScrollWidth] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("TOP");


  
  // 1. 스크롤 진행 바 로직 (기존 유지)
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollWidth(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. 핸들러 함수들 (기존 유지)
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);
  const openModal = (movie: Movie) => setSelectedMovie(movie);
  const closeModal = () => setSelectedMovie(null);

  // 3. 메인 페이지 여부 확인
  const isMainPage = location.pathname === '/';

 
  return (
    <>
      {/* 진행 상태 바 (기존 유지) */}
      <div className="progress_container">
        <div style={{
          position: 'fixed', top: 0, left: 0, width: `${scrollWidth}%`, height: '4px',
          backgroundColor: '#f9f9f9', zIndex: 10000, transition: 'width 0.1s ease-out'
        }} className="progress_bar" />
      </div>

      <ScrollToTop />
      
      {/* [수정 포인트] 메인 페이지일 때만 엘리베이터 네비게이션 노출 */}
      {isMainPage && <Navigation />}
      
      <TopButton />
      
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
        <Route path="/curation" element={<Curation onMovieClick={openModal} isSaved={isSaved} setIsSaved={setIsSaved} />} />
        <Route path="/explore" element={<Explore onMovieClick={openModal} activeTab={activeTab} setActiveTab={setActiveTab} />} />
        <Route path="/player/:movieId" element={<Player />} />
        <Route path="/funding" element={<Funding />} />
        <Route path="/funding/:id" element={<FundingEx />} />
        <Route path="/about/" element={<About />} />
        <Route path="/mypage/" element={<My isSaved={isSaved} activeTab={activeTab} 
                                            onMovieClick={openModal}  />} />
        <Route path="/membership/" element={<Member isLoggedIn={isLoggedIn} />} />
      </Routes>

      <Footer />

      {/* 영화 상세 모달 (기존 유지) */}
      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={closeModal} 
          onMovieClick={openModal}
        />
      )}
    </>
  );
}

export default App;