import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { allMovies, type Movie } from './MovieData';
import { useTranslation } from 'react-i18next';
import './My_4.css';

interface TimelineSectionProps {
  id: string;
  setActiveSection: (id: string) => void;
  activeTab?: string;
  onMovieClick: (movie: Movie) => void;
}

interface TimelineMovie extends Movie {
  date: string;
}

type TabType = 'watching' | 'myPalate' | 'saved';

export const My_4: React.FC<TimelineSectionProps> = ({ id, setActiveSection, onMovieClick }) => {
  const { t } = useTranslation();
  const { ref, inView } = useInView({ threshold: 0.2 });
  const [currentTab, setCurrentTab] = useState<TabType>('watching');

  // 실제 현재 날짜 기반 초기화 및 기간 가드 보정
  const getInitialDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    // 데이터가 존재하는 가드 범위 검증
    if (year < 2025 || (year === 2025 && month < 12)) {
      return { year: 2025, month: 12 };
    }
  
    // 그 외에는 현재 실제 연/월을 그대로 반환 (9월이면 2026년 9월이 됨)
    return { year, month };
  };

  const initialDate = getInitialDate();
  // 달력 탐색 연도/월/선택일 상태 관리 (현재 2026년 7월 기준)
  const [currentYear, setCurrentYear] = useState<number>(initialDate.year);
  const [currentMonth, setCurrentMonth] = useState<number>(initialDate.month);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    if (inView) setActiveSection(id);
  }, [inView, id, setActiveSection]);

  const dataset: Record<TabType, TimelineMovie[]> = {
    watching: [
      { ...allMovies[1], date: "26.07.03" }, { ...allMovies[10], date: "26.07.03" },
      { ...allMovies[12], date: "26.05.15" }, { ...allMovies[15], date: "26.04.02" },
      { ...allMovies[0], date: "26.02.11" }, { ...allMovies[7], date: "26.02.11" },
      { ...allMovies[8], date: "26.02.11" }, { ...allMovies[3], date: "25.12.22" },
      { ...allMovies[6], date: "25.12.14" }, { ...allMovies[4], date: "25.12.01" }
    ],
    myPalate: [
      { ...allMovies[13], date: "26.07.03" }, { ...allMovies[14], date: "26.06.20" },
      { ...allMovies[11], date: "26.05.08" }, { ...allMovies[2], date: "26.05.08" },
      { ...allMovies[6], date: "26.05.08" }, { ...allMovies[15], date: "26.03.12" },
      { ...allMovies[1], date: "26.03.12" }, { ...allMovies[9], date: "25.12.19" },
      { ...allMovies[4], date: "25.12.15" }
    ],
    saved: [
      { ...allMovies[5], date: "26.07.01" }, { ...allMovies[3], date: "26.06.12" },
      { ...allMovies[9], date: "26.06.12" }, { ...allMovies[10], date: "26.02.14" },
      { ...allMovies[16], date: "26.01.05" }, { ...allMovies[2], date: "25.12.18" },
      { ...allMovies[12], date: "25.12.09" }, { ...allMovies[14], date: "25.12.01" },
      { ...allMovies[0], date: "25.12.01" }
    ]
  };

  const emptyMessages: Record<TabType, string> = {
  watching: t('my4.text1'),
  myPalate: t('my4.text2'),
  saved: t('my4.text3') 
  };

  const trackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  
  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const currentPercent = useRef<number>(0); 
  const startPercent = useRef<number>(0);

  // 탭 전환 시 초기화 (달력 연월은 유저 데이터 흐름 유지를 위해 고정하되, 선택된 일자만 초기화)
  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    setSelectedDay(null);
    currentPercent.current = 0;
    if (thumbRef.current) thumbRef.current.style.left = '0%';
    if (railRef.current) railRef.current.scrollLeft = 0;
  };

  const handleDragStart = (clientX: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (e.cancelable) e.preventDefault();
    isDragging.current = true;
    startX.current = clientX;
    startPercent.current = currentPercent.current;
    if (railRef.current) railRef.current.classList.add('dragging');

    document.addEventListener('mousemove', handleDragMoveGlobal);
    document.addEventListener('mouseup', handleDragEndGlobal);
    document.addEventListener('touchmove', handleDragMoveGlobal, { passive: false });
    document.addEventListener('touchend', handleDragEndGlobal);
  };

  const handleDragMoveGlobal = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.current) return;
    if (e.cancelable) e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const track = trackRef.current;
    const rail = railRef.current;
    const thumb = thumbRef.current;
    if (!track || !rail || !thumb) return;

    const trackWidth = track.clientWidth;
    const deltaX = clientX - startX.current;
    const deltaPercent = (deltaX / trackWidth) * 100;
    const newPercent = Math.min(Math.max(startPercent.current + deltaPercent, 0), 100);
    currentPercent.current = newPercent;

    thumb.style.left = `${newPercent}%`;
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    if (maxScroll > 0) {
      rail.scrollLeft = (newPercent / 100) * maxScroll;
    }
  };

  const handleDragEndGlobal = () => {
    isDragging.current = false;
    if (railRef.current) railRef.current.classList.remove('dragging');
    document.removeEventListener('mousemove', handleDragMoveGlobal);
    document.removeEventListener('mouseup', handleDragEndGlobal);
    document.removeEventListener('touchmove', handleDragMoveGlobal);
    document.removeEventListener('touchend', handleDragEndGlobal);
  };

  // 날짜 가드 로직 
  const isValidPeriod = (year: number, month: number) => {
  const today = new Date();
  const currentMaxYear = today.getFullYear();
  const currentMaxMonth = today.getMonth() + 1; // 0~11로 반환되므로 +1

  // 시작점인 2025년 12월 이전은 막기
  if (year < 2025 || (year === 2025 && month < 12)) return false;

  // 미래 날짜(오늘 기준 연/월을 초과하는 범위) 막기
  if (year > currentMaxYear || (year === currentMaxYear && month > currentMaxMonth)) return false;

  return true;
};

  const handlePrevMonth = () => {
    let nextMonth = currentMonth - 1;
    let nextYear = currentYear;
    if (nextMonth < 1) {
      nextMonth = 12;
      nextYear -= 1;
    }
    if (isValidPeriod(nextYear, nextMonth)) {
      setCurrentYear(nextYear);
      setCurrentMonth(nextMonth);
      setSelectedDay(null);
    }
  };

  const handleNextMonth = () => {
    let nextMonth = currentMonth + 1;
    let nextYear = currentYear;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }
    if (isValidPeriod(nextYear, nextMonth)) {
      setCurrentYear(nextYear);
      setCurrentMonth(nextMonth);
      setSelectedDay(null);
    }
  };

  // 연/월 직접 변경 드롭다운 핸들러
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetYear = parseInt(e.target.value, 10);
    const today = new Date();

    // 연도 이동 시 유효한 월 범위 유지 연산
    let targetMonth = currentMonth;
    if (targetYear === 2025) {
      targetMonth = 12;
    } else if (targetYear === today.getFullYear()) {
      // 이동하려는 연도가 올해라면, 현재 월을 넘지 않도록 상한 보정
      targetMonth = Math.min(currentMonth, today.getMonth() + 1);
    }
  
    setCurrentYear(targetYear);
    setCurrentMonth(targetMonth);
    setSelectedDay(null);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetMonth = parseInt(e.target.value, 10);
    if (isValidPeriod(currentYear, targetMonth)) {
      setCurrentMonth(targetMonth);
      setSelectedDay(null);
    }
  };

  // 현재 연/월에 해당하는 탭별 동적 activeDays 연산
  const targetDatePrefix = `${String(currentYear).slice(-2)}.${String(currentMonth).padStart(2, '0')}`;
  
  const activeDays = dataset[currentTab]
    .filter(movie => movie.date.startsWith(targetDatePrefix))
    .map(movie => parseInt(movie.date.split('.')[2], 10));

  // 유저가 선택한 일자의 영화 목록 배열 필터링
  const selectedMovies = selectedDay 
    ? dataset[currentTab].filter(movie => movie.date === `${targetDatePrefix}.${String(selectedDay).padStart(2, '0')}`)
    : [];

  // JS Date 객체를 통한 월별 일수 및 시작 요일 동적 연산
  const daysInMonth = Array.from({ length: new Date(currentYear, currentMonth, 0).getDate() }, (_, i) => i + 1);
  // 월요일 시작 인덱싱 보정 (0: 월, 1: 화 ... 6: 일)
  const startDayIndex = (new Date(currentYear, currentMonth - 1, 1).getDay() + 6) % 7; 
  const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // 특정 영화 노드로 레일과 슬라이더를 부드럽게 스크롤하는 함수
  const scrollToMovie = (targetMovie: TimelineMovie) => {
    const rail = railRef.current;
    const thumb = thumbRef.current;
    const track = trackRef.current;
    if (!rail || !thumb || !track) return;

    // 현재 활성화된 탭 배열에서 클릭한 영화의 인덱스 검색
    const currentMovies = dataset[currentTab];
    const targetIndex = currentMovies.findIndex(
      movie => movie.id === targetMovie.id && movie.date === targetMovie.date
    );

    if (targetIndex !== -1) {
      // 1. 레일 내부에서 실제 자식 노드(영화 포스터 노드)들을 가져옵니다.
      const movieNodes = rail.querySelectorAll('.my4_movie_node');
      const targetNode = movieNodes[targetIndex] as HTMLElement;

      if (targetNode) {
        // 부모 레일의 기준 좌측 좌표(getBoundingClientRect)를 차감하여 보정
        const railRect = rail.getBoundingClientRect();
        const nodeRect = targetNode.getBoundingClientRect();
        const targetScrollLeft = rail.scrollLeft + (nodeRect.left - railRect.left);

        // 2. 레일을 보정된 타겟 위치로 부드럽게 스크롤
        rail.scrollTo({
          left: targetScrollLeft,
          behavior: 'smooth'
        });

        // 3. 상단 슬라이더 핸들(Thumb) 위치도 현재 스크롤된 비율에 맞춰 동기화
        const maxScroll = rail.scrollWidth - rail.clientWidth;
        if (maxScroll > 0) {
          // 첫 번째 요소(인덱스 0)이거나 계산된 좌측 스크롤이 0 이하일 때는 정확히 0%로 강제 정렬
          let newPercent = 0;
          if (targetIndex > 0 && targetScrollLeft > 0) {
            const scrollRatio = Math.min(targetScrollLeft / maxScroll, 1);
            newPercent = scrollRatio * 100;
          }

          currentPercent.current = newPercent;
          thumb.style.left = `${newPercent}%`;
          thumb.style.transition = 'left 0.3s ease';

          setTimeout(() => {
            if (thumbRef.current) thumbRef.current.style.transition = 'none';
          }, 300);
        }
      }
    }
  };

  // 날짜 클릭 시 해당 날짜의 첫 번째 영화로 자동 스크롤 연동
  const handleDayClick = (day: number) => {
    const isSelected = selectedDay === day;
    if (isSelected) {
      setSelectedDay(null);
    } else {
      setSelectedDay(day);
      // 해당 날짜에 매칭되는 영화들 탐색
      const targetMovies = dataset[currentTab].filter(
        movie => movie.date === `${targetDatePrefix}.${String(day).padStart(2, '0')}`
      );
      // 영화가 존재하면 첫 번째 영화 위치로 레일 이동 트리거
      if (targetMovies.length > 0) {
        scrollToMovie(targetMovies[0]);
      }
    }
  };

  return (
    <section id={id} ref={ref} className="my4_timeline_section">
      <div className="my4_inner">
        <motion.div
          key="permanent_timeline_view"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="my4_container"
        >
          {/* 1. 상단 단일 가로 축선 & 타원 슬라이더 */}
          <div ref={trackRef} className="my4_axis_track">
            <div 
              ref={thumbRef}
              className="my4_slider_thumb"
              style={{ left: `${currentPercent.current}%` }}
              onMouseDown={(e) => handleDragStart(e.clientX, e)}
              onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e)}
            />
          </div>

          {/* 2. 중앙 영화 일대기 타임라인 레일 */}
          <div ref={railRef} className="my4_scroll_rail">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentTab}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.5 }}
                transition={{ duration: 0.2, ease: "linear" }}
                className="my4_rail_inner_motion"
              >
                {dataset[currentTab].map((movie, idx) => {
                  const isSameDateAsPrevious = idx > 0 && dataset[currentTab][idx - 1].date === movie.date;
                  return (
                    <div key={idx} className="my4_movie_node">
                      <div className="my4_movie_date">{isSameDateAsPrevious ? "" : movie.date}</div>
                      <div className="my4_movie_poster" onClick={() => onMovieClick(movie)}>
                        <img src={movie.img} alt={movie.title} draggable="false" loading="lazy" />
                        <div className="my4_poster_hover_overlay">
                          <span className="my4_hover_title">{movie.title}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 3. 하단 구조: 탭메뉴 / 시네마 캘린더 / 리스트 병렬 구성 */}
          <div className="my4_bottom_wrapper">
            
            {/* 왼쪽 카테고리 탭 메뉴 */}
            <div className="my4_tab_menu">
              <button 
                className={`my4_tab_btn ${currentTab === 'watching' ? 'active' : ''}`}
                onClick={() => handleTabChange('watching')}
              >
                <span className="my4_indicator">[ <span className="dot">●</span> ]</span>
                <span className="my4_label">{t('my4.title1')}</span>
              </button>

              <button 
                className={`my4_tab_btn ${currentTab === 'myPalate' ? 'active' : ''}`}
                onClick={() => handleTabChange('myPalate')}
              >
                <span className="my4_indicator">[ <span className="dot">●</span> ]</span>
                <span className="my4_label">{t('my4.title2')}</span>
              </button>

              <button 
                className={`my4_tab_btn ${currentTab === 'saved' ? 'active' : ''}`}
                onClick={() => handleTabChange('saved')}
              >
                <span className="my4_indicator">[ <span className="dot">●</span> ]</span>
                <span className="my4_label">{t('my4.title3')}</span>
              </button>
            </div>

            {/* 중앙 시네마 캘린더 */}
            <div className="my4_cinema_calendar">
              <div className="my4_cal_header">
                <span className="my4_cal_arrow is_prev" onClick={handlePrevMonth}>
                  <img src="/media/etc/arrow_b.svg" alt="before" />
                </span>
                
                {/* 드롭다운 선택 렌더러 */}
                <div className="my4_cal_selectors">
                  <select value={currentYear} onChange={handleYearChange} className="my4_cal_select">
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                  </select>
                  <select value={currentMonth} onChange={handleMonthChange} className="my4_cal_select">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m} disabled={!isValidPeriod(currentYear, m)}>
                        {String(m).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>

                <span className="my4_cal_arrow is_next" onClick={handleNextMonth}>
                  <img src="/media/etc/arrow_b.svg" alt="next" />
                </span>
              </div>
              
              {/* 요일 행 */}
              <div className="my4_cal_weekdays">
                {weekdays.map((day, i) => (
                  <span key={i} className="my4_cal_week_label">{day}</span>
                ))}
              </div>

              {/* 날짜 그리드 */}
              <div className="my4_cal_grid">
                {/* 시작 요일에 따른 가변 빈 칸 매핑 */}
                {Array.from({ length: startDayIndex }).map((_, i) => (
                  <span key={`empty-${i}`} className="my4_cal_empty"></span>
                ))}
                
                {daysInMonth.map((day) => {
                  const isActed = activeDays.includes(day);
                  const isSelected = selectedDay === day;
                  return (
                    <span 
                      key={day} 
                      className={`my4_cal_day ${isActed ? 'is_active' : ''} ${isSelected ? 'is_selected' : ''}`}
                      onClick={() => isActed && handleDayClick(day)}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* 우측 액티브 데이 필터링 결과 리스트 */}
            <div className="my4_cal_movie_list">
              <div className="my4_list_header">
                [ {selectedDay ? `${String(currentMonth).padStart(2, '0')}.${String(selectedDay).padStart(2, '0')}` : 'LIST'} ]
              </div>
              <div className="my4_list_content">
                <AnimatePresence mode="wait">
                  {selectedDay && selectedMovies.length > 0 ? (
                    <motion.ul 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="my4_movie_titles"
                    >
                      {selectedMovies.map((movie, index) => (
                        <li key={index} className="my4_title_item" onClick={() => {
                                                                    scrollToMovie(movie); // 레일 스크롤 이동
                                                                    onMovieClick(movie);  // 기존 팝업/상세 모달 트리거 유지
                                                                  }}>
                          {movie.title}
                        </li>
                      ))}
                    </motion.ul>
                  ) : (
                    <span className="my4_empty_log_msg">{emptyMessages[currentTab]}</span>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default My_4;