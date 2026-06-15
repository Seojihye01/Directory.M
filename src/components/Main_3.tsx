import { useState, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Link } from "react-router-dom";
import './Main_3.css';

const Main_3 = () => {
  const [isMatched, setIsMatched] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (_event: any, info: any) => {
    const isMobile = window.innerWidth <= 1024; // 모바일 여부 확인(브라우저 너비 기준)
    // 모바일은 화면 중앙보다 아래로만 드래그해도 성공으로 간주
    const thresholdX = isMobile ? window.innerWidth * 0.3 : window.innerWidth * 0.7;
    const thresholdY = isMobile ? window.innerHeight * 0.4 : window.innerHeight * 0.5;

    if (info.point.x > thresholdX && info.point.y > thresholdY) {
        setIsMatched(true);
        }
    };

  // 1. Variants 타입을 명시하여 animate 속성 오류 방지
  const fadeVariants: Variants = {
    initial: { opacity: 0 },
    show: { 
      opacity: 1, 
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };

  const logoVariants: Variants = {
    initial: { opacity: 0, scale: 0.9 },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2 } 
    }
  };

  return (
    <div className='main_container' ref={constraintsRef} data-theme="light">
      <div className="grid_wrapper">
        <div className='grid_top'>
          {/* 2. animate에 직접 객체를 넣는 대신 문자열(variant name) 사용 */}
          {isMatched && (
            <>
          <motion.div 
                className='box_black wide'
                variants={fadeVariants}
                initial="initial"
                animate="show"
              >
                <p className='main3_dear'>Dear,</p>
            </motion.div>
          </>
          )}

          <motion.div 
            className='title_box_wrapper'
            variants={fadeVariants}
            initial="initial"
            animate={isMatched ? "show" : "initial"}
            style={{ 
            pointerEvents: isMatched ? 'auto' : 'none', 
            cursor: isMatched ? 'pointer' : 'default'
            }}
          >
            <Link to='/curation' className="title_box">
              <h1>A curator's view<br /> of cinema</h1>
              <img src='/media/arrow_w.svg' alt="arrow" />
            </Link>
          </motion.div>
        </div>

        <div className='grid_bottom'>
          <motion.div 
            className='subtitle_box'
            variants={fadeVariants}
            initial="initial"
            animate={isMatched ? "show" : "initial"}
          >
            <p>Films<br />selected<br />for you</p>
          </motion.div>
          
          <motion.div 
            className='video_box2'
            variants={fadeVariants}
            initial="initial"
            animate={isMatched ? "show" : "initial"}
          >
            {isMatched && (
              <video autoPlay muted loop playsInline className="main_video2 color">
                <source src="/media/main3.mp4" type="video/mp4" />
              </video>
            )}
            <div className='video_overlay'></div>
          </motion.div>

          {isMatched && (
            <>
              <motion.div 
                className='box_black narrow'
                variants={fadeVariants}
                initial="initial"
                animate="show"
              />
              <motion.div 
                layoutId="logo-piece" 
                className="logo_box matched"
                variants={logoVariants}
                initial="initial"
                animate="show"
              >
                <p className='brand_name'>Directory.M</p>
              </motion.div>
            </>
          )}

          {!isMatched && (
            <div className="target_dropzone">
              <p className="drop_text">Target</p>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!isMatched && (
            <motion.div
              key="draggable-logo"
              layoutId="logo-piece"
              drag={window.innerWidth <= 1024 ? "y" : true}
              dragConstraints={constraintsRef}
              onDragEnd={handleDragEnd}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="logo_box draggable"
            >
              <p className='brand_name'>Directory.M</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Main_3;