import React, { useState, useRef, useEffect } from "react"; 
import { createPortal } from "react-dom"; // 추가된 부분
import { motion, AnimatePresence } from 'framer-motion';
import './Curation_3.css';
import { allMovies, type Movie } from "./MovieData";
import MovieModal from "./Moviemodal"; 

const Curation_3 = () => {
    const [currentMovie] = useState<Movie>(allMovies[0]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    
    // 재생 상태 관리
    const [isStarted, setIsStarted] = useState(false); // 인트로 버튼 클릭 유무
    const [isPlaying, setIsPlaying] = useState(false); // 실제 비디오 재생 유무
    const [isEnded, setIsEnded] = useState(false);     // 영상 종료 유무
    const [isMuted, setIsMuted] = useState(true);      // 사운드 토글 상태 (기본 뮤트)

    const videoRef = useRef<HTMLVideoElement>(null);
    const startTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const endTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
        setIsStarted(false);
        setIsPlaying(false);
        setIsEnded(false);
        setIsMuted(true);

        if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
        if (endTimeoutRef.current) clearTimeout(endTimeoutRef.current);
    }, [currentMovie]);

    useEffect(() => {
        return () => {
            if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
            if (endTimeoutRef.current) clearTimeout(endTimeoutRef.current);
        };
    }, []);

    // 사운드 토글 핸들러
    const handleSoundToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    // 인트로 클릭 시 시퀀스 시작
    const handleRoomEnter = () => {
        setIsStarted(true); 
        setIsEnded(false);
        setIsPlaying(false);

        startTimeoutRef.current = setTimeout(() => {
            setIsPlaying(true); 
            if (videoRef.current) {
                videoRef.current.muted = false;
                setIsMuted(false);
                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error("재생 실패:", error);
                        setIsPlaying(false);
                        setIsStarted(false);
                    });
                }
            }
        }, 1200);
    };

    const handleVideoEnd = () => {
        setIsPlaying(false);
        endTimeoutRef.current = setTimeout(() => {
            setIsStarted(false);
            setIsEnded(true);
        }, 800);
    };

    const handleReplay = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleRoomEnter();
    };

    const openModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedMovie(currentMovie);
        setIsDetailOpen(false); // 처음엔 1차 요약창 상태
    };

    const navigateMovie = (direction: 'prev' | 'next') => {
        const baseMovie = selectedMovie || currentMovie;
        const currentIndex = allMovies.findIndex(m => m.id === baseMovie.id);
        const limitedData = allMovies.filter(movie => Number(movie.id) >= 1 && Number(movie.id) <= 10);
        
        let nextIndex = direction === 'prev' 
            ? (currentIndex - 1 + limitedData.length) % limitedData.length 
            : (currentIndex + 1) % limitedData.length;
    
        setSelectedMovie(allMovies[nextIndex]);
    };

    // Framer-motion 애니메이션 배리언트
    const roomBtnVariants = {
        start: { scale: 1, opacity: 1, z: 0 },
        exit: { 
            scale: 0.15,
            z: -600, 
            opacity: [1, 0],
            filter: 'blur(4px)',
            transition: { duration: 0.8, ease: [0.7, 0, 0.3, 1] as const } 
        }
    };

    return (
        <section className="cu3_container" data-theme="light">
            <div className="cu3_inner">    
                <div className="cu3_cont">
                    {/* 상단 뷰포트 */}
                    <div className={`cu3_top ${isStarted ? 'bg_black' : 'bg_room_init'}`}>
                        
                        <AnimatePresence mode="wait">
                            {!isStarted && !isEnded && (
                                <motion.div 
                                    className="room_entry_overlay"
                                    variants={roomBtnVariants}
                                    initial="start"
                                    exit="exit"
                                    key="entry_button"
                                >
                                    <button className="room_entry_btn" onClick={handleRoomEnter}>
                                        <motion.span exit={{ opacity: 0, transition: { duration: 0.3 } }}>
                                            Room No.01
                                        </motion.span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* 영상 종료 후 오버레이 */}
                        {isEnded && (
                            <div className="video_guide ended_overlay" style={{ zIndex: 10 }}>
                                <div className="ended_controls_container">
                                    <div className="control_item" onClick={handleReplay}>
                                        <div className="pill_icon_button">
                                            <img src="/media/replay.svg" alt="replay" className="replay" />
                                        </div>
                                    </div>
                                    <div className="control_item" onClick={openModal}>
                                        <div className="pill_icon_button">
                                            <img src="/media/view.svg" alt="info" className="view" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 비디오 플레이어 */}
                        <video
                            ref={videoRef}
                            className="curation_video"
                            onEnded={handleVideoEnd}
                            playsInline
                            style={{ 
                                opacity: isPlaying ? 1 : 0,
                                pointerEvents: isPlaying ? 'auto' : 'none'
                            }}
                        >
                            <source src="/media/Curation/Dune_ex.mp4" type="video/mp4" />
                            브라우저가 비디오를 지원하지 않습니다.
                        </video>

                        {/* 우측 하단 사운드 바 토글 버튼 */}
                        {isPlaying && (
                            <button 
                                className={`cu3_sound_wave_btn ${isMuted ? "muted" : "playing"}`}
                                onClick={handleSoundToggle}
                                aria-label="Toggle Sound"
                            >
                                <div className="cu3_sound_wave_bars">
                                    <span className="cu3_sound_bar bar1"></span>
                                    <span className="cu3_sound_bar bar2"></span>
                                    <span className="cu3_sound_bar bar3"></span>
                                </div>
                                <span className="cu3_sound_text">SOUND</span>
                            </button>
                        )}
                    </div>
        
                    {/* 하단 메타데이터 영역 */}
                    <div className="cu3_bot">
                        <div className="cu3_title_row">
                            <p className="issue">ISSUE NO. 01</p>
                            <h1 className="key_phrase">INSIDE THE MOMENT</h1>
                        </div>
                        <div className="cu3_info_row bold">
                            <p className="info_title">TITLE</p>
                            <h3 className="cu3_ti">{currentMovie.title}</h3>
                        </div>
                        <div className="cu3_info_row">
                            <p className="info_title">DIRECTOR</p>
                            <h3 className="cu3_direc">{currentMovie.direc}</h3>
                        </div>
                        <div className="cu3_info_row">
                            <p className="info_title">GENRE</p>
                            <h3 className="cu3_gen">{currentMovie.genre}</h3>
                        </div>
                    </div>
                </div>

                {/* 1차 요약 모달창 (isDetailOpen이 false일 때만 보이도록 차단하여 터치/포커스 겹침 방지) */}
                {selectedMovie && !isDetailOpen && createPortal(
                    <div className="movie_modal">
                        <div className="modal_bg" style={{ backgroundImage: `url(${selectedMovie.img})` }}></div>
                        <div className="modal_content">                                                    
                            <div className="modal_header_top">
                                <h1 className="m_title">{selectedMovie.title}</h1>
                            </div>
                            <div className="modal_header_bot">
                                <div className="m_info_right">
                                    <p className="m_direc_name">{selectedMovie.direc}</p>
                                    <p>Running Time : {selectedMovie.runtime}</p>
                                    <p>Release : {selectedMovie.rel}</p>
                                    <p>Genre : {selectedMovie.genre}</p>
                                </div>
                            </div>
                            <div className="modal_body_row">
                                <div className="m_description">
                                    <h3>{selectedMovie.subTitle}</h3>
                                    <p>{selectedMovie.desc}</p>
                                </div>
                            </div>
                            <div className="m_video_preview">
                                <img src={selectedMovie.img} alt="preview" />
                                <div className="m_control_bar">
                                    <div className="m_arrow">
                                        <img src="/media/arrow_b.svg" className="m_left" onClick={() => navigateMovie('prev')} alt="prev" />
                                        <img src="/media/arrow_b.svg" className="m_right" onClick={() => navigateMovie('next')} alt="next" />
                                    </div>
                                    <button className="m_more_btn" onClick={(e) => { e.stopPropagation(); setIsDetailOpen(true); }}>MORE</button>
                                    <span className="m_cancel" onClick={() => { setSelectedMovie(null); setIsDetailOpen(false); }}>✕</span>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}

                {/* 2차 상세 모달창 (MORE 버튼 클릭 시 열림) */}
                {isDetailOpen && selectedMovie && createPortal(
                    <div className="detail_modal_wrapper">
                        <MovieModal 
                            movie={selectedMovie} 
                            onClose={() => {
                                setIsDetailOpen(false);
                            }} 
                            onMovieClick={(next) => setSelectedMovie(next)} 
                        />
                    </div>,
                    document.body
                )}
            </div>
        </section>
    );
};

export default Curation_3;