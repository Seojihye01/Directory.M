import { useState } from "react";
import './Curation_6.css';
import { allMovies, type Movie } from "./MovieData"; // 경로 확인

interface CurationProps {
    onMovieClick: (movie: Movie) => void;
}

const Curation_6 = ({ onMovieClick }: CurationProps) => {

    const categoryMapping: Record<string, number> = {
        "Most Saved": 7,   // Mad Max: Fury Road
        "Most Clicked": 1,  // Dune
        "Most Played": 4    // Interstellar
    };

    const [selectedCate, setSelectedCate] = useState("Most Saved");
    const currentMovie = allMovies.find(m => String(m.id) === String(categoryMapping[selectedCate])) || allMovies[0];

    // 제목 클릭 시 실행될 함수
    const handleTitleClick = () => {
        // App.tsx에서 전달받은 모달 오픈 함수 실행
        onMovieClick(currentMovie);
    };

    return (
        <section className="curation_container" data-theme="light">
            <div className="curation_inner">
                <div className="cu6_header">
                    <h1 className="cu6_identity">ISSUE NO.01 &nbsp; INSIDE THE MOMENT &nbsp; BY &nbsp; DIRECTORY.M</h1>
                </div>

                <div className="cu6_cont">
                    <div className="cu6_main_row">
                        <div className="cu6_category">
                            {Object.keys(categoryMapping).map((name, index) => (
                                <div 
                                    key={name}
                                    className={`cate ${selectedCate === name ? "active" : ""}`}
                                    onClick={() => setSelectedCate(name)}>
                                    <p>{name}</p>
                                    <p className="cate_num">0{index + 1}</p>
                                </div>
                            ))}
                        </div>

                        <div 
                            className="cu6_movie_visual" 
                            key={currentMovie.id}
                            onClick={handleTitleClick}
                            style={{ cursor: 'pointer' }}
                        >
                            <img src={currentMovie.img} alt={currentMovie.title} className="fade_in" />
                        </div>
                    </div>

                    <div className="cu6_movie_cta_row">
                        {/* 텍스트 세트 클릭 시 모달 오픈 */}
                        <div className="cu6_title_set" onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
                            <h3 className="cu6_m_title">{currentMovie.title}</h3>
                            <div className="arrow_group">
                                <img src="/media/etc/arrow_btn.svg" alt="arrow" />
                                <img src="/media/etc/arrow_btn.svg" alt="arrow" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Curation_6;