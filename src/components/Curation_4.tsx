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

    const navigateMovie = (e: React.MouseEvent, direction: 'prev' | 'next') => {
        e.stopPropagation();
        if (!selectedMovie) return;
        const currentIndex = navMovies.findIndex(m => m.id === selectedMovie.id);
        let nextIndex = direction === 'prev' 
            ? (currentIndex - 1 + navMovies.length) % navMovies.length 
            : (currentIndex + 1) % navMovies.length;
        setSelectedMovie(navMovies[nextIndex]);
    };

    const handleMoreClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDetailOpen(true);
    };

    return (
        <section className="curation_container" data-theme="light">
            {/* 배경 텍스트 섹션 */}
            <div className="cu4_inner">
                <p className="cu4_key">INSIDE THE MOMENT</p>
            </div>

            {/* 카드 스택 영역: 정렬을 위해 래퍼 추가 */}
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
                                    <button className="m_view_btn" onClick={() => setSelectedMovie(m)}>
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

            {/* 모달 로직 */}
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
                            <div className="m_keywords_list">
                                {selectedMovie.keywords.map(kw => <p key={kw}>{kw}</p>)}
                            </div>
                        </div>
                        <div className="m_video_preview">
                            <img src={selectedMovie.img} alt="preview" />
                            <div className="m_control_bar">
                                <div className="m_arrow">
                                    <img src="/media/arrow_b.svg" className="m_left" onClick={(e) => navigateMovie(e, 'prev')} alt="prev" />
                                    <img src="/media/arrow_b.svg" className="m_right" onClick={(e) => navigateMovie(e, 'next')} alt="next" />
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
                    <MovieModal movie={selectedMovie} onClose={() => setIsDetailOpen(false)} onMovieClick={(next) => setSelectedMovie(next)} />
                </div>
            )}
        </section>
    );
};

export default Curation_4;