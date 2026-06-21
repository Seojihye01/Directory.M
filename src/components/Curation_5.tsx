import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { allMovies } from "./MovieData"; //
import "./Curation_5.css";

const Curation_5 = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  // 상위 10개 영화만 사용
  const movies = allMovies.slice(0, 10);

  return (
    <section className="cu5_section">
      {/* 배경용 금속판 (시안의 일체감을 위해 추가) */}
      <div className="cu5_bg_metal"></div> 

      <div className="cu5_grid_container">
        {/* Row 1: 4칸 */}
        <div className="cu5_row">
          {movies.slice(0, 4).map((movie, i) => (
            <LockerItem key={movie.id} movie={movie} openId={openId} setOpenId={setOpenId} pos={`row1-${i}`} />
          ))}
        </div>

        {/* Row 2: 영화 - 타이틀 - 영화 */}
        <div className="cu5_row second_row">
          <LockerItem movie={movies[4]} openId={openId} setOpenId={setOpenId} pos="row2-0" />
          <div className="cu5_center_title">
            <h2 className="cu5_inside_text">INSIDE THE MOMENT</h2>
          </div>
          <LockerItem movie={movies[5]} openId={openId} setOpenId={setOpenId} pos="row2-1" />
        </div>

        {/* Row 3: 4칸 */}
        <div className="cu5_row">
          {movies.slice(6, 10).map((movie, i) => (
            <LockerItem key={movie.id} movie={movie} openId={openId} setOpenId={setOpenId} pos={`row3-${i}`} />
          ))}
        </div>
      </div>
    </section>
  );
};

// LockerItem 컴포넌트
const LockerItem = ({ movie, openId, setOpenId, pos }: any) => {
  const isOpen = openId === movie.id;
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // 모바일에서 셔터가 올라가는 속도와 비디오 재생 타이밍을 완벽하게 동기화
  React.useEffect(() => {
    if (!videoRef.current) return;
    if (isOpen) {
      // 열리면 즉시 비디오 재생 실행
      videoRef.current.play().catch((err) => console.log("자동재생 제한 차단 방지:", err));
    } else {
      // 닫히면 일시정지하고 처음으로 되돌림
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);

  return (
    <div className={`cu5_locker_item ${pos} ${isOpen ? 'is_open' : ''}`} 
      onClick={() => setOpenId(isOpen ? null : movie.id)} data-theme="dark">
      <div className="cu5_inner_content">
          <video ref={videoRef} src={movie.symbol} loop muted playsInline preload="auto"/>
      </div>

      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="shutter"
            className="cu5_shutter"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <h3 className="cu5_engraved_title">{movie.title}</h3>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Curation_5;