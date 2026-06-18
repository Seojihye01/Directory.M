import React, { useState, useEffect, useCallback } from "react";
import { allMovies, type Movie } from "./MovieData";
import './Explore_4.css';

interface ExploreProps {
    onMovieClick: (movie: Movie) => void;
    isModalOpen: boolean;
}

const Explore_4 = ({ onMovieClick }: ExploreProps) => {
    const [selectedFilters, setSelectedFilters] = useState({
        GENRE: "All", YEAR: "2026", COUNTRY: "All", "SORT BY": "Latest"
    });

    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isEditingPage, setIsEditingPage] = useState(false);
    const [pageInput, setPageInput] = useState("");
    const [displayMovies, setDisplayMovies] = useState<any[]>([]);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const totalPages = 1000;

    // 영화 데이터 무작위로 페이지별 매칭하는 로직 유지
    const getMoviesByPage = useCallback((page: number) => {
        const shuffled = [...allMovies]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);
        
        return shuffled.map((movie, i) => ({
            ...movie,
            key: `movie-${page}-${movie.id}-${i}`
        }));
    }, []);

    const handleMovieClick = (e: React.MouseEvent, movie: Movie) => {
        e.preventDefault();
        onMovieClick(movie);
    };

    // 페이지 변경 핸들러 유지 (화살표 버튼 및 엔터 입력 인터랙션용)
    const handlePageChange = useCallback((nextPage: number) => {
        if (nextPage < 1 || nextPage > totalPages || isTransitioning) return;
        setIsTransitioning(true);
        
        setTimeout(() => {
            setCurrentPage(nextPage);
            setDisplayMovies(getMoviesByPage(nextPage));
            setTimeout(() => {
                setIsTransitioning(false);
            }, 50);
        }, 400);
    }, [isTransitioning, getMoviesByPage, totalPages]);

    // 초기 첫 페이지 데이터 바인딩
    useEffect(() => {
        setDisplayMovies(getMoviesByPage(1));
    }, [getMoviesByPage]);

    return (
        <section className="explore_grid_container" data-theme="light">

            <div className="explore_inner_flex">
                <aside className="side_nav_section">
                    <div className="side_filter_container">
                        {Object.keys(filterOptions).map((category) => {
                            const isOpen = activeFilter === category; // 현재 드롭다운이 열려있는지 확인
                            
                            return (
                            <div key={category} className={`filter_group ${isOpen ? 'is-active' : ''}`}>
                                <span className="filter_label">{category}</span>
                                <div className="neu_input_box" onClick={() => setActiveFilter(isOpen ? null : category)}>
                                    <span className="selected_value">
                                        {selectedFilters[category as keyof typeof selectedFilters]}
                                    </span>
                                    {isOpen && (
                                        <ul className="neu_dropdown_list">
                                            {filterOptions[category].map(opt => (
                                                <li key={opt} onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedFilters(prev => ({ ...prev, [category]: opt }));
                                                    setActiveFilter(null);
                                                    handlePageChange(1);
                                                }}>{opt}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    </div>

                    <div className="ex4_pagination">
                        <div className="neu_pagination_bar">
                            <button className="arrow_btn" onClick={() => handlePageChange(currentPage - 1)}>
                                <img src="/media/arrow_b.svg" className="ex4_left" alt="prev" />
                            </button>
                            <div className="page_indicator_box" onClick={() => { setIsEditingPage(true); setPageInput(String(currentPage)); }}>
                                <span className="txt_page">PAGE</span>
                                {isEditingPage ? (
                                    <input 
                                        type="number" 
                                        className="page_direct_input"
                                        value={pageInput}
                                        onChange={(e) => setPageInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                const newPage = parseInt(pageInput);
                                                if (newPage >= 1 && newPage <= totalPages) handlePageChange(newPage);
                                                setIsEditingPage(false);
                                            }
                                        }}
                                        onBlur={() => setIsEditingPage(false)}
                                        autoFocus
                                    />
                                ) : (
                                    <span className="txt_num">{String(currentPage).padStart(2, '0')}</span>
                                )}
                            </div>
                            <button className="arrow_btn" onClick={() => handlePageChange(currentPage + 1)}>
                                <img src="/media/arrow_b.svg" className="ex4_right" alt="next" />
                            </button>
                        </div>
                        <p className="total_page">TOTAL {totalPages} PAGES</p>
                    </div>
                </aside>

                <main className={`ex4_content_area ${isTransitioning ? 'is_switching' : ''}`}>
                    <div className="masonry_layout">
                        {displayMovies.map((movie, idx) => (
                            <div 
                               key={movie.key} 
                               className={`ex4_movie_item 
                               ${idx % 10 === 1 ? 'tall' : ''} 
                               ${idx % 10 === 9 ? 'wide' : ''}`}
                               onClick={(e) => handleMovieClick(e, movie)}
                            >
                                <img src={movie.img} alt={movie.title} loading="lazy" decoding="async" />
                                <div className="movie_hover_overlay">
                                    <span className="movie_hover_title">{movie.title}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </section>
    );
};

const filterOptions: { [key: string]: string[] } = {
    GENRE: ["All", "Sci-Fi", "Drama", "Action", "Documentary", "Romance", "Noir", "Arthouse", "Classic", "Independent", "Short Film"],
    YEAR: ["All", "2026", "2025", "2024", "2023", "2022", "2021", "2020", "2010s", "2000s", "Before 2000"],
    COUNTRY: ["All", "Korea", "USA", "UK", "Europe", "Asia", "Africa", "ETC"],
    "SORT BY": ["-", "Latest", "Most viewed", "Rising"]
};

export default Explore_4;