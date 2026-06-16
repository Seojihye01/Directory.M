import React, { useState, useRef, useEffect, useMemo } from "react"; 
import './Curation_3.css';
import './Curation_4.css';
import { allMovies, type Movie } from "./MovieData";
import MovieModal from "./Moviemodal"; 

const Curation_3 = () => {
    const [currentMovie] = useState<Movie>(allMovies[0]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false); 
    const [isEnded, setIsEnded] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const startTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const endTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 🌟 [최적화] 이퀄라이저 바 컴포넌트가 리렌더링될 때마다 DOM 요소를 재생성하지 않도록 메모이제이션
    const renderedEqualizer = useMemo(() => {
        return (
            <div className="equalizer_wrapper">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="eq_bar"></div>
                ))}
            </div>
        );
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
        setIsStarted(false);
        setIsPlaying(false);
        setIsEnded(false);

        if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
        if (endTimeoutRef.current) clearTimeout(endTimeoutRef.current);
    }, [currentMovie]);

    useEffect(() => {
        return () => {
            if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
            if (endTimeoutRef.current) clearTimeout(endTimeoutRef.current);
        };
    }, []);

    const navigateMovie = (direction: 'prev' | 'next') => {
        const baseMovie = selectedMovie || currentMovie;
        const currentIndex = allMovies.findIndex(m => m.id === baseMovie.id);
        let nextIndex = direction === 'prev' 
            ? (currentIndex - 1 + limitedData.length) % limitedData.length 
            : (currentIndex + 1) % limitedData.length;
    
        const nextMovie = allMovies[nextIndex];
        setSelectedMovie(nextMovie);
    };

    const handleStart = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.muted = false;
            
            setIsStarted(true); 
            setIsEnded(false);
            setIsPlaying(false);

            startTimeoutRef.current = setTimeout(() => {
                setIsPlaying(true); 

                const playPromise = videoRef.current?.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {})
                        .catch(error => {
                            console.error("재생 실패:", error);
                            setIsPlaying(false);
                            setIsStarted(false);
                        });
                }
            }, 1200);
        }
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
        handleStart();
    };

    const openModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedMovie(currentMovie);
        setIsDetailOpen(false);
    };

    const handleMoreClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDetailOpen(true);
    };

    const limitedData = allMovies.filter(movie => Number(movie.id) >= 1 && Number(movie.id) <= 10);

    return (
        <section className="cu3_container" data-theme="light">
            <div className="cu3_inner">    
                <div className="cu3_cont">
                    <div className={`cu3_top ${isPlaying ? 'bg_black' : ''}`}>
                        
                        {/* 시작 전 가이드 (이퀄라이저) */}
                        {!isStarted && !isEnded && (
                            <div className="video_guide" onClick={handleStart} style={{ zIndex: 10, pointerEvents: 'auto' }}>
                                <div className="cu3_play">
                                    <img src="/media/play_b.svg" className="play_btn" alt="play" />
                                </div>
                                {/* 🌟 메모이제이션된 이퀄라이저 주입 */}
                                {renderedEqualizer}
                            </div>
                        )}

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

                        <video
                            ref={videoRef}
                            className="curation_video"
                            onEnded={handleVideoEnd}
                            playsInline
                            style={{ 
                                opacity: isStarted ? 1 : 0,
                                pointerEvents: isPlaying ? 'auto' : 'none'
                            }}>
                            <source src="/media/Curation/Dune_ex.mp4" type="video/mp4" />
                            브라우저가 비디오를 지원하지 않습니다.
                        </video>
                    </div>
        
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
                            <p className="info_title">RUNNING TIME</p>
                            <h3 className="cu3_run">{currentMovie.runtime}</h3>
                        </div>
                        <div className="cu3_info_row">
                            <p className="info_title">RELEASE</p>
                            <h3 className="cu3_rel">{currentMovie.rel}</h3>
                        </div>
                    </div>
                </div>

                {selectedMovie && (
                    <div className="movie_modal" style={{ 
                        zIndex: 1000, 
                        opacity: isDetailOpen ? 0 : 1,
                        pointerEvents: isDetailOpen ? 'none' : 'auto' 
                    }}>
                        <div className="modal_bg" style={{ backgroundImage: `url(${selectedMovie.img})` }}></div>
                        <div className="modal_content">
                            <div className="modal_header_row">
                                <h1 className="m_title">{selectedMovie.title}</h1>
                                <div className="m_info_right">
                                    <p className="m_direc_name">{selectedMovie.direc}</p>
                                    <p>Running Time : {selectedMovie.runtime}</p>
                                    <p>Release : {selectedMovie.rel}</p>
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
                                    <button className="m_more_btn" onClick={handleMoreClick}>MORE</button>
                                    <span className="m_cancel" onClick={() => { setSelectedMovie(null); setIsDetailOpen(false); }}>✕</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {isDetailOpen && selectedMovie && (
                    <div className="detail_modal_wrapper">
                        <MovieModal 
                            movie={selectedMovie} 
                            onClose={() => setIsDetailOpen(false)} 
                            onMovieClick={(next) => setSelectedMovie(next)} 
                        />
                    </div>
                )}
            </div>
        </section>
    );
};

export default Curation_3;