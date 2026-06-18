import React, { useState, useEffect } from "react";
import { allMovies, type Movie } from "./MovieData"; // 1. Movie 타입 추가
import './Explore_3.css';

// 2. Props 인터페이스 정의
interface ExploreProps {
    onMovieClick: (movie: Movie) => void;
    isModalOpen: boolean;
}

const Explore_3 = ({ onMovieClick, isModalOpen }: ExploreProps) => { // 3. props 받기
    const targetTitles = ["Project Hail Mary", "The Martian", "Interstellar", "Gravity"];
    
    const exploreMovies = allMovies.filter(movie => 
        targetTitles.includes(movie.title)
    );

    const sortedMovies = [...exploreMovies].sort((a, b) => 
        targetTitles.indexOf(a.title) - targetTitles.indexOf(b.title)
    );

    const [selectedMovie, setSelectedMovie] = useState(sortedMovies[0]);
    const [isInside, setIsInside] = useState(false);
    
    useEffect(() => {
        if (sortedMovies.length > 0) {
            setSelectedMovie(sortedMovies[0]);
        }
    }, []);

    
    // 4. 클릭 핸들러 (모달 오픈용)
    const handleOpenModal = (e: React.MouseEvent) => {
        // 이벤트 전파 방지 및 기본 동작 차단
        e.preventDefault();
        e.stopPropagation();

        const isModalActive = isModalOpen || document.body.style.overflow === 'hidden';
        if (isModalActive) {
        // 모달이 켜지는 순간 모든 섹션의 판정을 꺼버림
            if (isInside) setIsInside(false); 
            return;
        }

        if (selectedMovie) {
            onMovieClick(selectedMovie);
        }
    };

    if (sortedMovies.length === 0) return null;

    return (
        <section className="explore_b_container" data-theme="dark">
            <div className="ex3_video">
                <video autoPlay muted loop playsInline>
                    <source src="/media/Explore/ex_bg.mp4" type="video/mp4" />
                </video>
            </div>
            <div className="explore_inner">
                <div className="ex3_cont">
                    
                    {/* 타이틀 클릭 시에도 모달 오픈 */}
                    <div className="ex3_title_list">
                        {sortedMovies.map((movie) => (
                            <h2 
                                key={movie.id}
                                className={selectedMovie?.id === movie.id ? "active" : ""}
                                onMouseEnter={() => setSelectedMovie(movie)}
                                onClick={handleOpenModal} // 추가
                                style={{ cursor: 'pointer' }} // 추가
                            >
                                {movie.title}
                            </h2>
                        ))}
                    </div>

                    {/* 이미지 클릭 시 모달 오픈 */}
                    <div 
                        className="ex3_image_wrap" 
                        onClick={handleOpenModal} 
                        style={{ cursor: 'pointer' }} // 추가
                    >
                        {selectedMovie && (
                            <img 
                                src={selectedMovie.img} 
                                alt={selectedMovie.title} 
                                key={selectedMovie.id}
                            />
                        )}
                    </div>

                    <div className="ex3_info">
                        {selectedMovie && (
                            <>
                                <div className="ex3_director">{selectedMovie.direc}</div>
                                <div className="ex3_release">{selectedMovie.rel}</div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Explore_3;