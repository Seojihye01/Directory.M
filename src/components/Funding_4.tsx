import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Funding_4.css';

const TAB_DATA = [
  { id: 0, label: "Start", en: "Where Independent Films Begin", kr: "독립영화는 상업 시스템 밖에서 만들어진다.\n후원은 제작의 동력을 확보하는 첫 번째 기틀을 마련한다." },
  { id: 1, label: "Participation", en: "You Become Part of the Process", kr: "단순히 완성된 결과물을 소비하는 관람의 형태를 넘어선다.\n영화가 만들어지는 스크린 뒤편의 과정에 관객이 직접 참여하고 연결되는 방식이다." },
  { id: 2, label: "Selection", en: "Focusing on Meaningful Stories", kr: "무분별한 나열 대신 검증된 프로젝트만 엄선한다.\n작품이 가진 가치와 미장센의 깊이, 그리고 데이터 투명성이 검증된 서사에만 가치를 연결한다." },
  { id: 3, label: "Result", en: "Bringing Frames to the Screen", kr: "후원자들의 지지는 스크린 위 하나의 프레임으로 실현된다.\n완성된 작품은 이 페이지의 결과가 된다." }
];

const GRID_LETTERS = [
  ['W', 'H', 'Y', 'A', 'E'],
  ['F', 'Q', 'D', 'M', 'Z'],
  ['C', 'W', 'E', 'S', 'U'],
  ['O', 'G', 'N', 'E', 'K'],
  ['A', 'F', 'U', 'N', 'D']
];

const TARGET_COORDS = [
  { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, 
  { r: 2, c: 1 }, { r: 2, c: 2 },                  
  { r: 4, c: 1 }, { r: 4, c: 2 }, { r: 4, c: 3 }, { r: 4, c: 4 } 
];

const Funding_4 = () => {
  const [index, setIndex] = useState(-3);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);
  
  const isAnimating = useRef(false);
  const indexRef = useRef(-3);
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartY = useRef(0);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    if (isInside && index === -3) {
      isAnimating.current = true;
      const introDelay = 1300; 
      setTimeout(() => {
        isAnimating.current = false;
      }, introDelay);
    }
  }, [isInside]);

  // 모바일 터치 및 휠 제어 최적화 타워
  useEffect(() => {
    const targetSection = sectionRef.current;
    if (!targetSection) return;

    const changeStepFlow = (scrollingDown: boolean) => {
      setIndex(prev => {
        let next: number;
        if (scrollingDown) {
          if (prev >= 4) next = 4;
          else next = prev + 1;
        } else {
          if (prev <= -3) next = -3;
          else next = prev - 1;
        }
        indexRef.current = next;
        return next;
      });

      const isLastDown = indexRef.current === 4 && scrollingDown;
      const delayTime = isLastDown ? 700 : 500; // 빠른 반응형 인터랙션을 위해 딜레이 약간 단축

      setTimeout(() => { 
        if (isLastDown) {
          setIsInside(false);
          setTimeout(() => {
            const nextSection = targetSection?.nextElementSibling || document.getElementById('funding_5_section');
            if (nextSection) {
              nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            isAnimating.current = false;
          }, 50);
        } else {
          isAnimating.current = false;
        }
      }, delayTime);
    };

    // 1. 데스크톱 휠 스크롤 제어
    const handleGlobalWheel = (e: WheelEvent) => {
      if (!isInside) return;

      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      // 상단 경계선 탈출 (첫 단계에서 위로 스크롤할 때)
      if (indexRef.current === -3 && scrollingUp) {
        setIsInside(false);
        return;
      }

      // 하단 경계선 탈출 (마지막 단계에서 아래로 스크롤할 때)
      if (indexRef.current === 4 && scrollingDown) {
        if (!isAnimating.current) {
          setIsInside(false);
          return;
        }
      }

      // 내부 단계 전환 구간 스크롤 락 및 가둠
      if ((scrollingDown && indexRef.current < 4) || (scrollingUp && indexRef.current > -3)) {
        e.preventDefault();
        targetSection.scrollIntoView({ behavior: 'auto', block: 'center' });
      }

      if (isAnimating.current) return;
      isAnimating.current = true;

      changeStepFlow(scrollingDown);
    };

    // 2. 모바일 터치 스타트
    const handleTouchStart = (e: TouchEvent) => {
      if (!isInside) return;
      touchStartY.current = e.touches[0].clientY;
    };

    // 3. 모바일 터치 무브 
    const handleTouchMove = (e: TouchEvent) => {
      if (!isInside) return;

      const currentIdx = indexRef.current;
      const touchEndY = e.touches[0].clientY;
      const diffY = touchStartY.current - touchEndY;

      // 가둠 상태에 있는 모든 핵심 단계에서는 모바일 네이티브 스크롤 전면 원천 차단
      if ((diffY > 0 && currentIdx < 4) || (diffY < 0 && currentIdx > -3)) {
        if (e.cancelable) e.preventDefault();
      }
      // 터치 감도 임계값 조절 (35px 이상 쓸어올리거나 내렸을 때 움직임으로 인정)
      if (Math.abs(diffY) < 30) return;

      const scrollingDown = diffY > 0; 
      const scrollingUp = diffY < 0;   

      // 첫 스텝에서 위로 스크롤 시 패스를 열어주어 이전 섹션으로 이동 허용
      if (currentIdx === -3 && scrollingUp) {
        setIsInside(false);
        return;
      }

      // 마지막 스텝에서 아래로 스크롤 시 패스를 열어주어 다음 섹션으로 이동 허용
      if (currentIdx === 4 && scrollingDown) {
        if (!isAnimating.current) {
          setIsInside(false);
          return;
        }
      }

      // 가둠 상태 내부 전환 시에만 네이티브 스크롤을 막아 튕김 현상 방지
      if ((scrollingDown && currentIdx < 4) || (scrollingUp && currentIdx > -3)) {
        if (e.cancelable) e.preventDefault();
        targetSection.scrollIntoView({ behavior: 'auto', block: 'center' });
      }

      if (isAnimating.current) return;
      isAnimating.current = true;

      // 새 터치 시작 기준점 갱신으로 연속 팅김 제어
      touchStartY.current = touchEndY; 
      changeStepFlow(scrollingDown);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('wheel', handleGlobalWheel, { passive: false });
    targetSection.addEventListener('touchstart', handleTouchStart, { passive: true });
    targetSection.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('wheel', handleGlobalWheel);
      targetSection.removeEventListener('touchstart', handleTouchStart);
      targetSection.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isInside]);

  const isPointTarget = (r: number, c: number) => 
    TARGET_COORDS.some(coord => coord.r === r && coord.c === c);

  const handleTabClick = (tabId: number) => {
    if (isAnimating.current) return;
    setIndex(tabId);
    indexRef.current = tabId;
  };

  return (
    <section 
      ref={sectionRef} data-theme="light" id="funding_4_section"
      className="funding_section funding_full_page" 
      onMouseEnter={() => setIsInside(true)} 
      onMouseLeave={() => setIsInside(false)}
      onTouchStart={() => setIsInside(true)} 
    >
      <div className={`custom_cursor_wrapper ${isInside ? 'active' : ''}`} style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}>
        <div className="custom_cursor_visual"><img src='/media/cursor_b.svg' alt="scroll" /></div>
      </div>

      <div className="funding_container">
        <AnimatePresence mode="wait">
          {index < 0 && (
            <motion.div 
              key="grid-layer"
              className="fu4_inner_content" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid_wrapper">
                {GRID_LETTERS.map((row, r) => (
                  <div key={r} className="grid_row">
                    {row.map((char, c) => {
                      const target = isPointTarget(r, c);
                      return (
                        <motion.span
                          key={`${r}-${c}`}
                          className={`grid_char ${target ? 'target' : ''}`}
                          animate={{
                            opacity: index === -3 ? 1 : (target ? 1 : (index === -2 ? 0.2 : 0)),
                            y: index === -1 && target ? (2 - r) * (window.innerWidth < 768 ? 60 : 110) : 0,
                          }}
                          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        >
                          {char}
                        </motion.span>
                      );
                    })}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {index >= 0 && (
            <motion.div 
              key="main-content"
              className="fu4_content_step main_flow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="static_title">WHY WE FUND</h2>

              <AnimatePresence mode="wait">
                <motion.div 
                  className="fu4_bottom_tab"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 30, opacity: 0 }}
                >
                  <div className="tab_left">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={index}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                      >
                        <p className="tab_en">{TAB_DATA[index]?.en}</p>
                        <h3 className="tab_kr">
                          {TAB_DATA[index]?.kr.split('\n').map((line, i) => (
                            <span key={i}>{line}<br /></span>
                          ))}
                        </h3>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="tab_right">
                    <div className="nav_list">
                      {TAB_DATA.map((item) => (
                        <div key={item.id} className="list_item" onClick={() => handleTabClick(item.id)}>
                          <span className={`list_label ${index === item.id ? 'active' : ''}`}>
                            {item.label}
                          </span>
                          <div className={`indicator_line ${index === item.id ? 'active' : ''}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Funding_4;