import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { allMovies } from "./MovieData"; 
import './Signup_3.css';

interface Signup3Props {
    onLogin: () => void;
    onPrev: () => void;
}

const Signup_3: React.FC<Signup3Props> = ({ onLogin, onPrev }) => {
    const navigate = useNavigate();
    const genres = ["Sci-Fi", "Action", "History", "Drama", "Thriller", "Comedy"];

    // 1. 페이지 로드 시 각 장르별로 보여줄 영화를 딱 하나씩만 선정 (고정)
    const [fixedMovieImages, setFixedMovieImages] = useState<{ [key: string]: string }>({});
    // 2. 현재 선택된 장르 (단일 선택)
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    // 3. 현재 마우스가 올라가 있는 장르
    const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);

    useEffect(() => {
        const initialFixed: { [key: string]: string } = {};
        genres.forEach(genre => {
            const filtered = allMovies.filter(m => m.genre === genre);
            if (filtered.length > 0) {
                // 랜덤으로 하나를 뽑지만, 이 상태에 저장되어 페이지 내내 고정됨
                const randomIdx = Math.floor(Math.random() * filtered.length);
                initialFixed[genre] = filtered[randomIdx].img;
            }
        });
        setFixedMovieImages(initialFixed);
    }, []);

    const handleSelect = (genre: string) => {
        // 이미 선택된 걸 누르면 해제, 아니면 새로 선택 (기존 선택은 자동 해제됨)
        setSelectedGenre(prev => (prev === genre ? null : genre));
    };

    const handleCreateAccount = () => {
        onLogin();
        navigate('/');
    };

    return (
        <section className="signup_container" data-theme="light">
            <div className="signup_inner">
                <div className="signup_content">
                    <div className="step">
                        <p>STEP 01</p>
                        <p>STEP 02</p>
                        <p className="st3">STEP 03</p>
                    </div>
                    
                    <div className="box_grid">
                        {genres.map((genre, index) => {
                            const isSelected = selectedGenre === genre;
                            const isHovered = hoveredGenre === genre;
                            
                            // 로직: 선택되었거나 호버 중일 때만 영화 포스터, 아니면 signup_3.png
                            const currentSrc = (isSelected || isHovered) 
                                ? fixedMovieImages[genre] 
                                : "/media/etc/signup_3.png";

                            return (
                                <React.Fragment key={genre}>
                                    {index === 5 && (
                                        <div className="box point">
                                            <p className="point_kr">탐험의 시작점</p>
                                            <p className="point_en">POINT<br />OF<br />DEPARTURE</p>
                                        </div>
                                    )}
                                    <div 
                                        className={`box ${isSelected ? 'active' : ''}`}
                                        onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHoveredGenre(genre); }}
                                        onPointerLeave={(e) => { if (e.pointerType === 'mouse') setHoveredGenre(null); }}
                                        onClick={() => handleSelect(genre)}
                                    >
                                        <img 
                                            src={currentSrc} 
                                            className="sign_img" 
                                            alt={genre}
                                        />
                                        <p className="genre">{genre}</p>
                                        {isSelected && <div className="check_badge">
                                            <img src="/media/check.svg" /></div>}
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                            
                    <div className="link_btn">
                        <div className="before" onClick={onPrev} style={{ cursor: 'pointer' }}>
                            <img src="/media/arrow_b.svg" className="be" />
                            <p>Before</p>
                        </div>
                        <div className="next" onClick={handleCreateAccount} style={{ cursor: 'pointer' }}>
                            <p>Create Account</p>
                            <img src="/media/arrow_b.svg" className="ar" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Signup_3;