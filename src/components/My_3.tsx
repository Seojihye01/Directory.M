import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import './My_3.css';

interface LibrarySectionProps {
  id: string;
  setActiveSection: (id: string) => void;
  // 기존 props는 에러 방지용으로 남겨두되 내부에서 사용하지 않습니다.
  isSaved?: boolean; 
}

const My_3: React.FC<LibrarySectionProps> = ({ id, setActiveSection }) => {
  const { ref, inView } = useInView({ threshold: 0.6 });
  const navigate = useNavigate();

  const [selectedCuration, setSelectedCuration] = useState<number>(1);
  const [pageGroup, setPageGroup] = useState<number>(0); // 0: 1~10번, 1: 11~20번

  const maxGroup = 1; // 11~20번까지 테스트 가능하도록 설정

  useEffect(() => {
    if (inView) setActiveSection(id);
  }, [inView, id, setActiveSection]);

  const filterNumbers = Array.from({ length: 10 }, (_, i) => pageGroup * 10 + (i + 1));

  const handleGoToCuration = (num: number) => {
    if (num === 1) {
      navigate('/curation?section=1'); // 해당 컴포넌트 위치로 스크롤 이동
    }
  };

  const handlePrevGroup = () => {
    if (pageGroup > 0) {
      const prevGroup = pageGroup - 1;
      setPageGroup(prevGroup);
      setSelectedCuration(prevGroup * 10 + 1); 
    }
  };

  const handleNextGroup = () => {
    if (pageGroup < maxGroup) {
      const nextGroup = pageGroup + 1;
      setPageGroup(nextGroup);
      setSelectedCuration(nextGroup * 10 + 1); 
    }
  };

  return (
    <section id={id} ref={ref} className="my3_library_section">
      <div className="my3_inner">
        <motion.div
          key="permanent_archive_view"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="my3_archive_container"
        >
          {/* 1. 상단 숫자 인덱서 (01 ~ 10) */}
          <div className="my3_index_row">
            {filterNumbers.map((num) => (
              <button
                key={num}
                className={`my3_index_num ${selectedCuration === num ? 'active' : ''}`}
                onClick={() => setSelectedCuration(num)}
              >
                {String(num).padStart(2, '0')}
              </button>
            ))}
          </div>

          {/* 2. 중앙 컨텐츠 바 Area (애니메이션 전환 유지) */}
          <div className="my3_content_window">
            <AnimatePresence mode="wait">
              {selectedCuration === 1 ? (
                <motion.div
                  key="curation_01"
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.4 }}
                  transition={{ duration: 0.2 }}
                  className="my3_accordion_bar"
                >
                  <div className="my3_accordion_left">
                    <span className="my3_curation_badge">[ CURATION 01 ]</span>
                    <span className="my3_curation_title">INSIDE THE MOMENT</span>
                  </div>
                  <button 
                    className="my3_plus_btn" 
                    onClick={() => handleGoToCuration(1)}
                    aria-label="View Curation"
                  >
                    <span>+</span>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={`prepared_${selectedCuration}`}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.4 }}
                  transition={{ duration: 0.2 }}
                  className="my3_accordion_bar prepared"
                >
                  <span className="my3_prepared_msg">
                    CURATION {String(selectedCuration).padStart(2, '0')} IS BEING PREPARED
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. 하단 화살표 무브먼트 (< , >) */}
          <div className="my3_nav_pagination">
            <button 
              className={`my3_nav_arrow arrow_left ${pageGroup === 0 ? 'disabled' : ''}`}
              onClick={handlePrevGroup}
              disabled={pageGroup === 0}
            >
              <img src="/media/etc/arrow_b.svg" alt="Previous Group" style={{ transform: 'rotate(180deg)' }} />
            </button>
            <button 
              className={`my3_nav_arrow arrow_right ${pageGroup === maxGroup ? 'disabled' : ''}`} 
              onClick={handleNextGroup}
              disabled={pageGroup === maxGroup} 
            >
              <img src="/media/etc/arrow_b.svg" alt="Next Group" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default My_3;