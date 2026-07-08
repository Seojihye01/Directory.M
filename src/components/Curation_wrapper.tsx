import Curation_1 from './Curation_1';
import Curation_2 from './Curation_2';
import Curation_3 from './Curation_3';
import Curation_4 from './Curation_4';
import Curation_5 from './Curation_5';
import Curation_6 from './Curation_6';
import Curation_7 from './Curation_7';
import { useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import { type Movie } from "./MovieData";


interface CurationProps {
    onMovieClick: (movie: Movie) => void;
    isSaved: boolean;
    setIsSaved: React.Dispatch<React.SetStateAction<boolean>>;
}


const Curation_wrapper =({ onMovieClick, isSaved, setIsSaved }: CurationProps) => {

    // 영화를 클릭했을 때 실행되는 함수
    const handleMovieSelect = (movie: Movie) => {
        
        if (onMovieClick) onMovieClick(movie);
    };

    const wrapperRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const sectionIndex = params.get('section');

        if (sectionIndex !== null && wrapperRef.current) {
            const target = wrapperRef.current.children[Number(sectionIndex)] as HTMLElement;

            if (target) {
        // 3. 해당 위치로 부드럽게 이동
        const headerOffset = 70; // 헤더 높이만큼 제외
        const elementPosition = target.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [location]); // URL이 바뀔 때마다 실행


    return (
        <div className='curation_page_wrapper' ref={wrapperRef}>
        <Curation_1/>
        <div id='cu2_section'>
            <Curation_2/>
        </div>
        <Curation_3/>
        <Curation_4/>
        <Curation_5 />
        <Curation_6 onMovieClick={handleMovieSelect}/>
        <Curation_7 isSaved={isSaved} setIsSaved={setIsSaved} />
        </div>
    );
}

export default Curation_wrapper;