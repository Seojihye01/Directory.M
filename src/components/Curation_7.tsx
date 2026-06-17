import { useState } from "react";
import { allMovies, type Movie } from "./MovieData"; 
import './Curation_7.css';

const Curation_7 = () => {
    const [isSaved, setIsSaved] = useState(false);
    const [activePage, setActivePage] = useState<number | null>(null);

    const handlePageClick = (num: number) => {
        // 이미 활성화된 페이지를 다시 누르면 닫히고, 아니면 해당 페이지 활성화
        setActivePage(activePage === num ? null : num);
    };

    const handleToggleSave = () => {
        setIsSaved(!isSaved);
    };

    const movieList = allMovies
        .filter((movie: Movie) => {
            const idAsNumber = typeof movie.id === 'string' ? parseInt(movie.id) : movie.id;
            return idAsNumber >= 1 && idAsNumber <= 10;
        })
        .map((movie: Movie) => movie.title.toUpperCase());

    return (
        <section className="curation7_container" data-theme="light">
            <div className="curation_inner">
                <div className="file_stack_container">
                    {[1, 2, 3].map((num) => (
                        <div 
                            key={num}
                            className={`file_page page_0${num} ${activePage === num ? "active" : ""}`}
                            style={{ zIndex: 11 - num }} 
                            onClick={() => handlePageClick(num)}
                        >
                            <div className="index_tab">
                                <span className="index_label">CURATION &nbsp; 0{num}</span>
                            </div>

                            <div className="paper_inner">
                                <div className="header_row">
                                    <div className={`archive_btn ${isSaved ? "saved" : ""}`} 
                                        onMouseDown={handleToggleSave}>
                                        <span>Archive in Library</span>
                                        <div className="icon_img_wrap">
                                            <img 
                                                src={isSaved ? "/media/check.svg" : "/media/save.svg"} 
                                                alt="save icon" 
                                                className="cta_icon"/>
                                        </div>
                                    </div>
                                </div>

                                <div className="main_content">
                                    {num === 1 ? (
                                        <div className="c7_view">
                                            <div className="c7_issue">
                                                <p className="issue_no">ISSUE NO. 01</p>
                                                <h1 className="issue_title">INSIDE THE MOMENT</h1>
                                            </div>
                                            <ul className="movie_list">
                                                {movieList.map((m) => <li key={m}>{m}</li>)}
                                            </ul>
                                        </div>
                                    ) : (
                                        <div className="locked_view">
                                            <p className="locked_msg">
                                                CURATION &nbsp; 0{num} &nbsp; IS &nbsp; BEING &nbsp; PREPARED</p>
                                        </div>
                                    )}
                                </div>

                                {num === 1 && (
                                    <div className="cu7_curator">
                                        <div className="curator_tag">
                                            <span className="cu7_name">SEO JIHYE,</span>
                                            <span className="cu7_team_mem">Lead Curator at Directory.M</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Curation_7;