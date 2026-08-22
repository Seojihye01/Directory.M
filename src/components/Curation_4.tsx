import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
import './Curation_4.css';

import { allMovies, type Movie } from "./MovieData";
import MovieModal from "./Moviemodal"; 

const Curation_4: React.FC = () => {
    const [currentMovie] = useState<Movie>(allMovies[0]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const navMovies = allMovies.slice(0, 10);
    const renderMovies = navMovies.filter(m => m.id !== 1);

    const handleOpenModal = (e: React.MouseEvent, movie: Movie) => {
        // Swiper 드래그 엔진의 터치 가로채기 방지 핵심
        e.preventDefault();
        e.stopPropagation();
        setSelectedMovie(movie);
        setIsDetailOpen(true); 
    };

    return (
        <section className="cu4_container" data-theme="light">
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
                                        <img src="/media/etc/view_w.svg" className="m_view_w" alt="view" />
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

            {/* 영화 상세 모달창 */}
            {isDetailOpen && selectedMovie && createPortal(
                <div className="detail_modal_wrapper">
                    <MovieModal 
                        movie={selectedMovie} 
                        onClose={() => {
                            setIsDetailOpen(false);
                            setSelectedMovie(null);
                        }} 
                        onMovieClick={(next) => setSelectedMovie(next)} 
                    />
                </div>,
                document.body
            )}
        </section>
    );
};

export default Curation_4;