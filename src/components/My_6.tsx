import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { allMovies, type Movie } from './MovieData';
import type { UserProfile } from './My_wrapper';
import './My_6.css';


interface TimelineSectionProps {
  id: string;
  setActiveSection: (id: string) => void;
  onMovieClick: (movie: Movie) => void;
  user: UserProfile;
}

interface TimelineMovie extends Movie {
  date: string; // "YY.MM.DD"
}

export const My_6: React.FC<TimelineSectionProps> = ({ id, setActiveSection, onMovieClick, user }) => {
  const { ref, inView } = useInView({ threshold: 0.1 });

  
  // 3단계 스테이지 상태 관리 (1 | 2 | 3)
  const [stage, setStage] = useState<number>(1);
  
  // 선택된 시간 필터 상태
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
  
  // 티켓 단계 전용 페이지네이션 인덱스
  const [ticketIndex, setTicketIndex] = useState<number>(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    if (inView) setActiveSection(id);
  }, [inView, id, setActiveSection]);

  // My_4 watching 데이터셋 바인딩
  const watchingDataset: TimelineMovie[] = [
    { ...allMovies[1], date: "26.07.03" }, { ...allMovies[4], date: "26.07.03" },
    { ...allMovies[12], date: "26.05.15" }, { ...allMovies[15], date: "26.04.02" },
    { ...allMovies[0], date: "26.02.11" }, { ...allMovies[7], date: "26.02.11" },
    { ...allMovies[8], date: "26.02.11" }, { ...allMovies[3], date: "25.12.22" },
    { ...allMovies[6], date: "25.12.14" }, { ...allMovies[10], date: "25.12.01" }
  ];

  // 데이터셋에서 유일한 연도 리스트 자동 추출하여 내림차순 정렬
  const uniqueYears = Array.from(
    new Set(watchingDataset.map(m => 2000 + parseInt(m.date.split('.')[0], 10)))
  ).sort((a, b) => a - b);

  // 특정 연도에 속하는 전체 아이템 개수 계산
  const getYearCount = (year: number) => {
    const prefix = `${String(year).slice(-2)}.`;
    return watchingDataset.filter(m => m.date.startsWith(prefix)).length;
  };

  // 특정 연/월/일에 매핑되는 영화 필터링
  const getMoviesByDate = (year: number, month: number, day: number) => {
    const targetPrefix = `${String(year).slice(-2)}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
    return watchingDataset.filter(m => m.date === targetPrefix);
  };


  // 이용자가 '해당 연도'에 본 영화 중 몇 번째(No.) 영화인지 계산하는 함수
  const getYearlyChronologicalNo = (movie: TimelineMovie) => {
    const yearPrefix = movie.date.split('.')[0];
    const yearlyMovies = [...watchingDataset]
      .filter(m => m.date.startsWith(yearPrefix))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    const index = yearlyMovies.findIndex(m => m.id === movie.id);
    return index !== -1 ? String(index + 1).padStart(2, '0') : "01";
  };

  // 별점 생성기 (5점 만점 임의 부여 - 가상 알고리즘)
  const renderStars = (movieId: number) => {
    const rating = (movieId % 3) + 3; // 3점 ~ 5점 사이 랜덤 부여
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  // 12개월 가로 선택 컴포넌트 렌더링용 배열
  const monthsArray = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // 현재 선택된 연/월의 총 일수 동적 계산
  const daysInMonth = Array.from(
    { length: new Date(selectedYear, selectedMonth, 0).getDate() },
    (_, i) => i + 1
  );

  // 3단계 현재 활성화된 티켓 데이터
  const activeTickets = selectedDay ? getMoviesByDate(selectedYear, selectedMonth, selectedDay) : [];
  const currentTicket = activeTickets[ticketIndex];

  // SNS 웹사이트 공유 텍스트 전달 함수
  const shareToSNS = (platform: 'instagram' | 'twitter') => {
    const shareText = `Ticket for [Directory.${user.sirname}] - ${currentTicket?.title} (No. ${getYearlyChronologicalNo(currentTicket)})`;
    const shareUrl = window.location.href;

    if (platform === 'twitter') {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    } else if (platform === 'instagram') {
      const instagramUrl = `https://www.instagram.com/`;
      window.open(instagramUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // 클립보드 복사 및 문구 변경 핸들러
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    
    // 2초 후에 복구
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  return (
    <section id={id} ref={ref} className="my6_archive_section">
      <div className="my6_inner">
        <div className="my6_content_window">
          <AnimatePresence mode="wait">

            {/* [STAGE 1] 연도별 총계 화면 */}
            {stage === 1 && (
              <motion.div
                key="stage1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="my6_stage1_zone"
              >
                <div className="my6_year_row">
                  {uniqueYears.map((year) => (
                    <div 
                      key={year} 
                      className={`my6_year_box ${selectedYear === year ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedYear(year);
                        // 연도 선택 시, 해당 연도 데이터가 존재하는 가장 최신 월 혹은 기본 월(12월/7월)로 가드 설정
                        setSelectedMonth(year === 2025 ? 12 : 7);
                        setStage(2);
                      }}
                    >
                      <span className="my6_year_txt">{year}</span>
                      <span className="my6_count_txt">( {getYearCount(year)} )</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* [STAGE 2] 월간 일자별 도형 그래픽화 화면 */}
            {stage === 2 && (
              <motion.div
                key="stage2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="my6_stage2_zone"
              >
                <div className="my6_stage_header target_ticket_header">
                  {/* 화살표와 연도 영역 전체를 클릭하면 Stage 1 단계(뒤로가기)로 이동 */}
                  <div className="my6_back_year" onClick={() => setStage(1)}>
                    <span className="my6_arrow_btn">
                      <img src='/media/etc/arrow_b.svg' />
                    </span>
                    <span className="my6_month_title"> {selectedYear} </span>
                  </div>
                </div>

                {/* 중단 가로 배치형 1~12월 숫자 선택 바 */}
                <div className="my6_months_bar">
                  {monthsArray.map((m) => {
                    // 해당 월에 영화 데이터가 하나라도 존재하는지 체크 (스타일 다크닝용)
                    const monthPrefix = `${String(selectedYear).slice(-2)}.${String(m).padStart(2, '0')}`;
                    const hasDataInMonth = watchingDataset.some(movie => movie.date.startsWith(monthPrefix));
                    
                    return (
                      <span
                        key={m}
                        className={`my6_month_tab_num ${selectedMonth === m ? 'selected' : ''} ${hasDataInMonth ? 'has_history' : ''}`}
                        onClick={() => {
                          setSelectedMonth(m);
                          setSelectedDay(null); // 월 변경 시 일자 선택 초기화
                        }}
                      >
                        {m}
                      </span>
                    );
                  })}
                </div>

                {/* 시안의 미니멀한 가로 타임라인 레이아웃 구현 */}
                <div className="my6_timeline_container">
                  <div className="my6_calendar_grid">
                    {daysInMonth.map((day) => {
                      const dayMovies = getMoviesByDate(selectedYear, selectedMonth, day);
                      const hasMovies = dayMovies.length > 0;
                      const isSelected = selectedDay === day;

                      return (
                        <div
                          key={day}
                          className={`my6_day_column ${hasMovies ? 'active_records' : ''} ${isSelected ? 'focused_day' : ''}`}
                          onClick={() => {
                            if (hasMovies) {
                              setSelectedDay(day);
                              setTicketIndex(0);
                              setStage(3);
                            }
                          }}
                        >
                          <span className="my6_day_num">{day}</span>
                          <div className="my6_dot_stack">
                            {dayMovies.map((_, idx) => (
                              <span key={idx} className="my6_graphic_dot"></span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* [STAGE 3] 미니멀 티켓 화면 */}
            {stage === 3 && currentTicket && (
              <motion.div
                key="stage3"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="my6_stage3_zone"
              >
                <div className="my6_stage_header">
                  <div className="my6_nav_left">
                    <div className='my6_nav_set'>
                      <div className="my6_ticket_nav" onClick={() => setStage(2)}>
                        <span className="my6_arrow_btn" onClick={(e) => { 
                          e.stopPropagation();
                          setTicketIndex(prev => Math.max(0, prev - 1));}}>
                          <img src='/media/etc/arrow_b.svg' />
                        </span>
                        <span className="my6_ticket_cal"> {String(selectedMonth).padStart(2, '0')} / {selectedYear} </span>
                      </div>
                    
                      {/* 도형 모양 페이지네이션 인디케이터 */}
                      <div className="my6_bullet_pagination">
                        {activeTickets.map((_, idx) => (
                          <span 
                            key={idx} 
                            className={`my6_bullet ${ticketIndex === idx ? 'active' : ''}`}
                            onClick={() => setTicketIndex(idx)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <button className='nav_right' onClick={() => setIsShareModalOpen(true)}>
                    <img src='/media/etc/share.svg' />
                  </button>
                </div>

                {/* 질감이 적용된 티켓 */}
                <motion.div 
                  className="my6_paper_ticket"
                  whileHover={{ y: -4, boxShadow: "0 12px 35px rgba(0, 0, 0, 0.28)", scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => onMovieClick(currentTicket)}
                >
                  <div className="my6_ticket_poster_side">
                    {/* 실사 스틸컷/포스터 영역 */}
                    <div className="my6_poster_img_wrap">
                      <div className="my6_poster_placeholder_filter"></div>
                      <img src={currentTicket.img} alt={currentTicket.title} onError={(e)=>{
                        // 포스터 누락 시 시안과 유사한 무드의 분위기 연출용 대체 이미지
                        e.currentTarget.src="https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?auto=format&fit=crop&w=600&q=80"
                      }} />
                    </div>
                  </div>

                  <div className="my6_ticket_info_side">
                    <div className="my6_ticket_emboss">Directory.M</div>
                    <div className="my6_info_meta_grid">
                      <div className="meta_row">
                        <span className="meta_label">Genre</span>
                        <span className="meta_value">{currentTicket.genre}</span>
                      </div>
                      <div className="meta_row">
                        <span className="meta_label">Released</span>
                        <span className="meta_value">{currentTicket.rel}</span>
                      </div>
                      <div className="meta_row">
                        <span className="meta_label">Director / Actors</span>
                        <span className="meta_value">{currentTicket.direc} <br/> 
                                                     {Array.isArray(currentTicket.actors) 
                                                        ? currentTicket.actors.join(', ') 
                                                        : (currentTicket.actors as string)?.split(' ').join(', ') ?? ''}
                        </span>
                      </div>
                      <div className="meta_row">
                        <span className="meta_label">star rating</span>
                        <span className="meta_value rating_stars">{renderStars(Number(currentTicket.id))}</span>
                      </div>
                    </div>

                    <div className="my6_ticket_footer_title">
                      <div className='my6_footer_date'>
                        <span className="my6_ticket_date">
                          {String(selectedDay).padStart(2, '0')} / {String(selectedMonth).padStart(2, '0')} / {selectedYear}
                        </span>
                      </div>
                      <div className='my6_footer_titleset'>
                        <span className="my6_movie_no">No. {getYearlyChronologicalNo(currentTicket)}</span>
                        <h2 className="my6_movie_main_title">{currentTicket.title}</h2>
                      </div>                               
                    </div>
                  </div>
                </motion.div>
                
                <span className="my6_ticket_branding">Ticket for Directory.{user.sirname}</span>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isShareModalOpen && (
          <motion.div 
            className="my6_modal_overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsShareModalOpen(false)} // 배경 클릭 시 닫힘
          >
            <motion.div 
              className="my6_share_modal"
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫힘 방지
            >
              <div className="my6_modal_header">
                <h3>Share Ticket</h3>
                <button className="my6_modal_close" onClick={() => setIsShareModalOpen(false)}>✕</button>
              </div>
              <div className="my6_sns_grid">
                <button className="my6_sns_btn instagram" onClick={() => shareToSNS('instagram')}>
                  <span>To Instagram</span>
                </button>
                <button className="my6_sns_btn twitter" onClick={() => shareToSNS('twitter')}>
                  <span>To X (Twitter)</span>
                </button>
                <button className={`my6_sns_btn link_copy ${isCopied ? 'copied' : ''}`} onClick={handleCopyLink}>
                  <span>{isCopied ? 'Copied' : 'Copy Link'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default My_6;