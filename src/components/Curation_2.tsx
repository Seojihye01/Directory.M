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

  // 2. 클릭으로만 사라짐
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

      // 1. 커버 상태
      if (!isOpened) {
        if (scrollingDown) {
          e.preventDefault(); // 아래로 못 내려가게 락
          // 위치가 어긋나지 않게 섹션 시작점에 고정
          window.scrollTo({ top: sectionRef.current.offsetTop, behavior: 'auto' });
        }
        return; // 위로 가는 것은 허용
      }

      if (scrollingDown && stepRef.current === 3) {
        // 애니메이션 중이거나 이미 락이 걸려있다면 이벤트 차단
        if (isAnimating.current && !sectionRef.current.classList.contains('delay_ended')) {
          e.preventDefault();
          window.scrollTo({ top: sectionRef.current.offsetTop, behavior: 'auto' });
          return;
        }

        // 지연 완료 상태가 아니라면 첫 휠 동작 시 0.8초간 강력 락
        if (!sectionRef.current.classList.contains('delay_ended')) {
          e.preventDefault();
          window.scrollTo({ top: sectionRef.current.offsetTop, behavior: 'auto' });
          
          isAnimating.current = true;
          sectionRef.current.classList.add('delay_ended'); // 지연 시작됨을 표시

          setTimeout(() => {
            isAnimating.current = false; // 락 해제
            // 클래스는 유지하여 다음 휠 동작 때 이 조건문을 통과하고 자연스럽게 내려가도록 함
          }, 800); 

          return;
        }
        
        // delay_ended 클래스가 붙은 상태에서 들어온 휠은 락을 걸지 않고 자연스럽게 다음 섹션으로 보냄
        return;
      }

      // 3. 마지막 단계 하행을 제외한 나머지 모든 스텝 락 (이동할 때마다 delay_ended 초기화)
      e.preventDefault();
      sectionRef.current.classList.remove('delay_ended'); 
      window.scrollTo({ top: sectionRef.current.offsetTop, behavior: 'auto' });
      moveStep(scrollingDown ? 'next' : 'prev');
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!isInside) return;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isInside || !sectionRef.current) return;
      const deltaY = touchStartY.current - e.touches[0].clientY;
      const scrollingDown = deltaY > 0;

      if (!isOpened) {
        if (scrollingDown) e.preventDefault();
        return;
      }

      if (!(scrollingDown && stepRef.current === 3)) {
        if (Math.abs(deltaY) > 5) {
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
      className="cu2_section" 
      onMouseEnter={() => setIsInside(true)} 
      onMouseLeave={() => setIsInside(false)}
      onTouchStart={() => setIsInside(true)} 
      onTouchMove={() => setIsInside(true)}
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
                  <ListItem n={3} curr={step} title="03 경외감의 본질 탐구" desc="인간이 스크린 앞에서 느끼는 압도적인 경외감은 감독이 설계한 
                        단 한 프레임에서 시작된다 우리는 그 시작점이 되는 순간을 따라간다" />
                </div>
              </div>
              <div className="cu2_bottom_bar">
                <span>SEO JIHYE, Lead Curator at Directory.M</span>
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