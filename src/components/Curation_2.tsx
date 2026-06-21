import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Curation_2.css';

const Curation_2 = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [step, setStep] = useState(0);
  const [isInside, setIsInside] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const stepRef = useRef(0);
  const isAnimating = useRef(false);
  const touchStartY = useRef(0);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const handleOpen = () => {
    setIsOpened(true);
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
    }, 50);
  };

  useEffect(() => {
    const moveStep = (direction: 'next' | 'prev') => {
      if (isAnimating.current) return;
      
      const scrollingDown = direction === 'next';
      const scrollingUp = direction === 'prev';

      // 첫 단계에서 위로 올리면 커버로 복구
      if (scrollingUp && stepRef.current === 0 && isOpened) {
        setIsOpened(false);
        return;
      }

      if ((scrollingDown && stepRef.current < 3) || (scrollingUp && stepRef.current > 0)) {
        isAnimating.current = true;
        setStep(prev => scrollingDown ? prev + 1 : prev - 1);
        setTimeout(() => { isAnimating.current = false; }, 600);
      }
    };

    const handleGlobalWheel = (e: WheelEvent) => {
      if (!isInside || !sectionRef.current) return;

      const scrollingDown = e.deltaY > 0;

      // 커버 상태일 때는 아래로 내려가려는 첫 동작만 차단하고, 
      // 마우스가 완전히 다른 섹션으로 스크롤되어 나가는 상행 스크롤 등은 락 x
      if (!isOpened) {
        if (scrollingDown) {
          e.preventDefault(); 
          window.scrollTo({ top: sectionRef.current.offsetTop, behavior: 'auto' });
        }
        return; 
      }

      if (scrollingDown && stepRef.current === 3) {
        if (isAnimating.current && !sectionRef.current.classList.contains('delay_ended')) {
          e.preventDefault();
          window.scrollTo({ top: sectionRef.current.offsetTop, behavior: 'auto' });
          return;
        }

        if (!sectionRef.current.classList.contains('delay_ended')) {
          e.preventDefault();
          window.scrollTo({ top: sectionRef.current.offsetTop, behavior: 'auto' });
          
          isAnimating.current = true;
          sectionRef.current.classList.add('delay_ended');

          setTimeout(() => {
            isAnimating.current = false; 
          }, 800); 

          return;
        }
        return;
      }

      // 나머지 중간 스텝 진행 중일 때는 스크롤 고정
      e.preventDefault();
      sectionRef.current.classList.remove('delay_ended'); 
      window.scrollTo({ top: sectionRef.current.offsetTop, behavior: 'auto' });
      moveStep(scrollingDown ? 'next' : 'prev');
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!isInside) return;
      touchStartY.current = e.touches[0].clientY;
    };

    // 모바일 터치이동 해결 핵심 로직
    const handleTouchMove = (e: TouchEvent) => {
      if (!isInside || !sectionRef.current) return;
      
      const deltaY = touchStartY.current - e.touches[0].clientY;
      const scrollingDown = deltaY > 0;

      // 1. 커버가 닫혀있을 때는 터치 무브 스크롤을 아예 건드리지 않음 (다른 섹션으로 자유롭게 이동 가능)
      if (!isOpened) {
        return; 
      }

      // 2. 안쪽 콘텐츠가 열렸을 때만 인터랙션 통제
      // 마지막 3단계에서 아래로 스크롤해서 빠져나가는 상황이 '아닐 때만' 스크롤 락
      if (!(scrollingDown && stepRef.current === 3)) {
        if (Math.abs(deltaY) > 10) {
          // 확실하게 이 큐레이션 영역 안에 갇혀서 탭을 넘겨야 하는 상황에서만 prevent와 고정 실행
          e.preventDefault();
          window.scrollTo({ top: sectionRef.current.offsetTop, behavior: 'auto' });
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isInside || !isOpened) return;
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) > 40) moveStep(deltaY > 0 ? 'next' : 'prev');
    };

    window.addEventListener('wheel', handleGlobalWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleGlobalWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isInside, isOpened]);

  return (
    <section 
      ref={sectionRef} 
      className={`cu2_section ${isOpened ? 'opened' : ''}`} // opened 클래스 동적 추가
      // 모바일에서 터치가 끝나 바깥 영역을 돌아다닐 때는 확실히 내부 판정을 취소하도록 초기화 추가
      onMouseEnter={() => setIsInside(true)} 
      onMouseLeave={() => setIsInside(false)}
      onTouchStart={() => setIsInside(true)} 
      onTouchEnd={() => {
        // 터치가 끝났을 때 스텝이 3번이거나 커버 상태라면 inside 판정을 해제해 다른 구역 스크롤을 보장
        if (!isOpened || step === 3) {
          setIsInside(false);
        }
      }}
      data-theme="light"
    >
      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div 
            key="cover" 
            className="cu2_cover" 
            exit={{ x: "-100%" }} 
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          >
            <h1 className="cu2_cover_text" onClick={handleOpen}>CURATION 01</h1>
          </motion.div>
        ) : (
          <div className="cu2_inner">
            <motion.div key="content" className="cu2_contents" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="cu2_top_bar">
                <span>ISSUE NO. 01</span>
                <span>April, 2026</span>
              </div>
              <div className='cu2_top2_bar'>
                <h2 className="cu2_main_title">INSIDE THE MOMENT</h2>
              </div>
              <div className="cu2_middle_wrap">
                <div className="cu2_left_col">
                  <p className="cu2_main_desc">
                    영화는 본질적으로 시간의 흐름이지만, 어떤 장면은 멈춘 채로 기억에 남는다. <br/>
                    이 큐레이션은 영화라는 거대한 시공간 속에서 스크린이 보여줄 수 있는 시각적 정점의 순간들을 기록했다. <br />
                    서사를 잠시 멈추고 오직 프레임이 가진 연출과 비주얼에 집중한다.
                  </p>
                </div>
                <div className="cu2_divider" />
                <div className="cu2_right_col">
                  <ListItem n={1} curr={step} title="01 시각적 정점의 기록" desc="Dune의 웅장함부터 Whiplash의 날카로운 긴장감까지 영화적 미학이 가장 밀도 있게 응축된 순간을 기록한다" />
                  <ListItem n={2} curr={step} title="02 시간의 공간화" desc="순간의 장면 구도와 빛, 공간감을 마치 전시된 작품처럼 깊이 있게 관찰하는 경험을 제안한다" />
                  <ListItem n={3} curr={step} title="03 경외감의 본질 탐구" desc="인간이 스크린 앞에서 느끼는 압도적인 경외감은 감독이 설계한 단 한 프레임에서 시작된다 우리는 그 시작점이 되는 순간을 따라간다" />
                </div>
              </div>
              <div className="cu2_bottom_bar">
                <span>SEO JIHYE, AI Chief Curator at Directory.M</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

const ListItem = ({ n, curr, title, desc }: any) => (
  <div className="cu2_list_item">
    <h3 className="cu2_item_title">{title}</h3>
    <div className="cu2_item_desc_box">
      <motion.p 
        initial={{ opacity: 0 }} 
        animate={curr >= n ? { opacity: 1 } : { opacity: 0 }} 
        transition={{ duration: 0.5 }}
      >
        {desc}
      </motion.p>
    </div>
  </div>
);

export default Curation_2;