import Explore_1 from './Explore_1';
import Explore_2 from './Explore_2';
import Explore_3 from './Explore_3';
import Explore_4 from './Explore_4';
import Explore_5 from './Explore_5';
import { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import { type Movie } from "./MovieData";
import MovieModal from "./Moviemodal";

interface ExploreProps {
    onMovieClick: (movie: Movie) => void;
}

const Explore_wrapper = ({ onMovieClick }: ExploreProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    
    // 마지막으로 이동했던 섹션을 저장하여 중복 이동 방지
    const lastSection = useRef<string | null>(null);

    const handleMovieSelect = (movie: Movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
        if (onMovieClick) onMovieClick(movie);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
    };

    // 💡 URL 파라미터에 따른 스크롤 이동 로직 최적화
    useEffect(() => {
        // 모달이 열려있거나 전환 애니메이션 중일 때는 이동 차단
        if (isModalOpen) return;

        const params = new URLSearchParams(location.search);
        const sectionIndex = params.get('section');

        // 같은 섹션으로의 반복 이동 명령은 무시 (튕김 방지 핵심)
        if (sectionIndex === lastSection.current) return;

        if (sectionIndex !== null && wrapperRef.current) {
            const indexMap: { [key: string]: number } = {
                "0": 0, "1": 1, "2": 2, "3": 3, "4": 4 // 실제 컴포넌트 순서에 맞게 조정
            };

            const actualIndex = indexMap[sectionIndex];
            const target = wrapperRef.current.children[actualIndex] as HTMLElement;

            if (target) {
                lastSection.current = sectionIndex; // 현재 섹션 저장
                const offsetPosition = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }, [location.search, isModalOpen]); // isModalOpen도 체크하여 안전하게 실행

    return (
        <div className='explore_page_wrapper' ref={wrapperRef}>
            <div id="explore_1_section"><Explore_1 /></div>
            {/* Explore_2는 이제 내부에서 자체적으로 다음 섹션 아이디를 찾아 이동함 */}
            <div id="explore_2_section">
                <Explore_2 />
            </div>
            <div id="explore_3_section">
                <Explore_3 onMovieClick={handleMovieSelect} isModalOpen={isModalOpen} />
            </div>
            <div id="explore_4_section">
                <Explore_4 onMovieClick={handleMovieSelect} isModalOpen={isModalOpen} />
            </div>
            <div id="explore_5_section">
                <Explore_5 onMovieClick={handleMovieSelect} isModalOpen={isModalOpen} />
            </div>

            {isModalOpen && selectedMovie && (
                <MovieModal 
                    movie={selectedMovie} 
                    onClose={handleCloseModal} 
                    onMovieClick={handleMovieSelect} 
                />
            )}
        </div>
    );
}

export default Explore_wrapper;