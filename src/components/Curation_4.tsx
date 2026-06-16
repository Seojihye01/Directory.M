import React, { useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
import './Curation_4.css';

import { allMovies, type Movie } from "./MovieData";
import MovieModal from "./Moviemodal"; 

const Curation_4: React.FC = () => {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const navMovies = allMovies.slice(0, 10);
    const renderMovies = navMovies.filter(m => m.id !== 1);

    const navigateMovie = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedMovie) return;
        const currentIndex = navMovies.findIndex(m => m.id === selectedMovie.id);
        
        // 단순 원형 네비게이션 구조로 통일 (Curation_4 내부 카드 전환 간소화 혹은 Modal 전용 핸들러 분리)
        const nextIndex = (currentIndex + 1) % navMovies.length;
        setSelectedMovie(navMovies[nextIndex]);
    };

    const handleOpenModal = (e: React.MouseEvent, movie: Movie) => {
        // Swiper 드래그 엔진의 터치 가로채기 방지 핵심
        e.preventDefault();
        e.stopPropagation();
        setSelectedMovie(movie);
        setIsDetailOpen(false); // 처음엔 1차 요약창 상태
    };

    const handleMoreClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDetailOpen(true); // 2차 상세 모달 open
    };

    return (
        <section className="curation_container" data-theme="light">
            <div className="cu4_inner">
                <p className="cu4_key">INSIDE THE MOMENT</p>
            </div>

            <div className="mySwiper_wrapper">
                <Swiper
                    effect={'cards'}
                    grabCursor={true}
                    loop={true}
                    modules={[EffectCards]}
                    className="mySwiper"
                    watchSlidesProgress={true} 
                    lazyPreloadPrevNext={1}
                    updateOnWindowResize={true}
                    cardsEffect={{
                        perSlideOffset: 12, 
                        perSlideRotate: 2,
                    }}
                >
                    {renderMovies.map((m, idx) => (
                        <SwiperSlide key={m.id} className="m_stack_slide">
                            <div className="m_card_content">
                                <div className="m_img_area">
                                    <img src={m.img} alt={m.title} />
                                    {/* onTouchEnd에서 터치가 유실되지 않도록 캡처링 조치 */}
                                    <button 
                                        className="m_view_btn" 
                                        onClick={(e) => handleOpenModal(e, m)}
                                        onTouchEnd={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <img src="/media/view_w.svg" className="m_view_w" alt="view" />
                                    </button>
                                </div>
                                <div className="m_info_area">
                                    <div className="m_info_left">
                                        <h2 className="m_index_num">{(idx + 2).toString().padStart(2, '0')}</h2>
                                    </div>
                                    <div className="m_text_bundle">
                                        <h3 className="m_movie_title">{m.title}</h3>
                                        <div className="m_movie_meta">
                                            <p>{m.direc}</p>
                                            <p>Release : {m.rel}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* 1차 요약 모달창 (상세 페이지 열릴 땐 조건부 렌더링으로 확실히 분리해 터치 간섭 해제) */}
            {selectedMovie && !isDetailOpen && (
                <div className="movie_modal">
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
                                <div className="m_arrow" onClick={navigateMovie}>
                                    <img src="/media/arrow_b.svg" className="m_left" alt="prev" />
                                    <img src="/media/arrow_b.svg" className="m_right" alt="next" />
                                </div>
                                <button className="m_more_btn" onClick={handleMoreClick}>MORE</button>
                                <span className="m_cancel" onClick={() => setSelectedMovie(null)}>✕</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2차 상세 모달창 */}
            {isDetailOpen && selectedMovie && (
                <div className="detail_modal_wrapper">
                    <MovieModal 
                        movie={selectedMovie} 
                        onClose={() => {
                            setIsDetailOpen(false);
                        }} 
                        onMovieClick={(next) => setSelectedMovie(next)} 
                    />
                </div>
            )}
        </section>
    );
};

export default Curation_4;