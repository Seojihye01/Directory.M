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

  // 스크롤 가둠 및 터치 흐름 완전 통제 시스템
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
      const delayTime = isLastDown ? 600 : 400;

      setTimeout(() => { 
        if (isLastDown) {
          // 마지막 단계에서 아래로 스크롤 시 부드럽게 다음 섹션 전송
          const nextSection = document.getElementById('funding_5_section') || targetSection.nextElementSibling;
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          // 완전히 스크롤이 넘어갈 시간을 벌어준 뒤 애니메이션 락 해제
          setTimeout(() => { isAnimating.current = false; }, 500);
        } else {
          isAnimating.current = false;
        }
      }, delayTime);
    };

    // 1. 데스크톱 휠 가둠 제어
    const handleGlobalWheel = (e: WheelEvent) => {
      const rect = targetSection.getBoundingClientRect();
      // 섹션이 화면 중앙 부근에 걸쳐있지 않다면 가둠을 발동하지 않음
      const inView = rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
      if (!inView) return;

      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;
      const currentIdx = indexRef.current;

      // 상하단 완전히 끝에 도달했을 때 탈출 패스 허용
      if (currentIdx === -3 && scrollingUp) return;
      if (currentIdx === 4 && scrollingDown && !isAnimating.current) return;

      // 내부 단계 전환 중에는 무조건 브라우저 휠 정지
      e.preventDefault();
      targetSection.scrollIntoView({ behavior: 'auto', block: 'center' });

      if (isAnimating.current) return;
      isAnimating.current = true;
      changeStepFlow(scrollingDown);
    };

    // 2. 모바일 터치 가둠 스타트
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    // 3. 모바일 터치 무브 (★핵심 락킹 알고리즘)
    const handleTouchMove = (e: TouchEvent) => {
      const rect = targetSection.getBoundingClientRect();
      // 섹션이 모바일 화면을 덮고 있는 상태인지 확인
      const inView = rect.top <= window.innerHeight * 0.3 && rect.bottom >= window.innerHeight * 0.3;
      if (!inView) return;

      const currentIdx = indexRef.current;
      const touchEndY = e.touches[0].clientY;
      const diffY = touchStartY.current - touchEndY; // 양수: 쓸어올림(Down), 음수: 쓸어내림(Up)

      const scrollingDown = diffY > 0;
      const scrollingUp = diffY < 0;

      // 첫 단계에서 위로 스크롤하거나, 마지막 단계에서 완전히 아래로 탈출할 때가 아니라면
      // '모든 터치 무브'를 완전 차단하여 모바일 고무줄 스크롤(Bounce)을 원천 봉쇄합니다.
      const isFirstStepExit = currentIdx === -3 && scrollingUp;
      const isLastStepExit = currentIdx === 4 && scrollingDown && !isAnimating.current;

      if (!isFirstStepExit && !isLastStepExit) {
        if (e.cancelable) {
          e.preventDefault(); // 네이티브 모바일 스크롤 정지 권한 획득
        }
      } else {
        // 탈출 조건 만족 시 가둠을 풀고 브라우저 스크롤 흐름에 맡김
        return;
      }

      // 너무 예민한 스크롤 방지를 위한 픽셀 임계값 (30px 이상 움직였을 때만 판정)
      if (Math.abs(diffY) < 30) return;

      // 내부 스텝 유지 관리용 강제 센터링
      targetSection.scrollIntoView({ behavior: 'auto', block: 'center' });

      if (isAnimating.current) return;
      isAnimating.current = true;

      touchStartY.current = touchEndY; // 기준점 갱신
      changeStepFlow(scrollingDown);
    };

    // ⭐️ 전역 window와 타겟 섹션에 { passive: false }로 리스너를 직접 주입하여 브라우저 가로채기 방지
    window.addEventListener('wheel', handleGlobalWheel, { passive: false });
    targetSection.addEventListener('touchstart', handleTouchStart, { passive: true });
    targetSection.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleGlobalWheel);
      targetSection.removeEventListener('touchstart', handleTouchStart);
      targetSection.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  const isPointTarget = (r: number, c: number) => 
    TARGET_COORDS.some(coord => coord.r === r && coord.c === c);

  const handleTabClick = (tabId: number) => {
    if (isAnimating.current) return;
    setIndex(tabId);
    indexRef.current = tabId;
  };

  return (
    <section 
      ref={sectionRef} 
      data-theme="light" 
      id="funding_4_section"
      className="funding_section funding_full_page" 
      onMouseEnter={() => setIsInside(true)} 
      onMouseLeave={() => setIsInside(false)}
      onMouseMove={handleMouseMove}
    >
      <div className={`custom_cursor_wrapper ${isInside ? 'active' : ''}`} style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}>
        <div className="custom_cursor_visual"><img src='/media/etc/cursor_b.svg' alt="scroll" /></div>
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