import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fundingProjects, type FundingProject } from './FundingData'; 
import './My_5.css';

interface ProjectSectionProps {
  id: string;
  setActiveSection: (id: string) => void;
}

type MenuType = 'interest' | 'projectList' | null;
type SortOrder = 'asc' | 'desc';

interface MyProject extends FundingProject {
  tier: string;
}

export const My_5: React.FC<ProjectSectionProps> = ({ id, setActiveSection }) => {
  const { ref, inView } = useInView({ threshold: 0.4 });
  const [activeMenu, setActiveMenu] = useState<MenuType>(null);
  
  const [movies, setMovies] = useState<MyProject[]>(() => 
    fundingProjects.map((project, index) => {
      const tierNumber = (index % 3) + 1; 
      return { ...project, tier: `0${tierNumber}` };
    })
  );

  const [statusOrder, setStatusOrder] = useState<SortOrder>('asc');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  // 페이지네이션 상태 추가 (Interest / Project List 각각 독립 관리)
  const [interestPage, setInterestPage] = useState<number>(1);
  const [projectPage, setProjectPage] = useState<number>(1);
  const itemsPerPage = 5;

  const [interestIds, setInterestIds] = useState<number[]>(() => 
  fundingProjects.map(project => project.id) // 초기값은 전체 프로젝트 ID 바인딩
  );

  useEffect(() => {
    if (inView) setActiveSection(id);
  }, [inView, id, setActiveSection]);

  // 메뉴 전환 시 상태 초기화
  const handleMenuChange = (menu: MenuType) => {
    setActiveMenu(menu);
    setSelectedIds([]); 
    setInterestPage(1);
    setProjectPage(1);
  };

  // --- [데이터 정렬 및 필터링] ---
  const interestMovies = [...movies]
  .filter(movie => interestIds.includes(movie.id)) // 신설된 ID 리스트 필터링 조건 추가
  .sort((a, b) => a.remainingDays - b.remainingDays);  
  const projectListMovies = [...movies].sort((a, b) => {
    return statusOrder === 'asc' 
      ? a.progressState.localeCompare(b.progressState) 
      : b.progressState.localeCompare(a.progressState);
  });

  // 현재 페이지 데이터 슬라이싱 로직
  const indexOfLastInterest = interestPage * itemsPerPage;
  const indexOfFirstInterest = indexOfLastInterest - itemsPerPage;
  const currentInterestMovies = interestMovies.slice(indexOfFirstInterest, indexOfLastInterest);

  const indexOfLastProject = projectPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjectMovies = projectListMovies.slice(indexOfFirstProject, indexOfLastProject);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // --- [체크박스 핸들러] ---
  const handleSelectOne = (movieId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(movieId) ? prev.filter(item => item !== movieId) : [...prev, movieId]
    );
  };

  const handleSelectAll = (visibleMovies: MyProject[]) => {
    const visibleIds = visibleMovies.map(m => m.id);
    const isAllSelected = visibleIds.every(id => selectedIds.includes(id));

    if (isAllSelected) {
      setSelectedIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...visibleIds])]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (activeMenu === 'interest') {
    // Interest 탭에서 삭제 시: 원본을 지우지 않고 관심 등록 상태 ID 목록에서만 제외 처리
    setInterestIds(prev => prev.filter(id => !selectedIds.includes(id)));
  } else {
    // Project List 탭에서 삭제 시: 기존 전체 프로젝트 목록에서 완전 제외 처리
    setMovies(prev => prev.filter(movie => !selectedIds.includes(movie.id)));
  }
  
  setSelectedIds([]);
  setInterestPage(1);
  setProjectPage(1);
  setIsModalOpen(false);
  };

  // 페이지네이션 렌더러 함수
  const renderPagination = (totalItems: number, currentPage: number, setPage: (p: number) => void) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    return (
      <div className="my5_pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
          <button
            key={pageNum}
            className={`my5_page_btn ${currentPage === pageNum ? 'active' : ''}`}
            onClick={() => setPage(pageNum)}
          >
            {pageNum}
          </button>
        ))}
      </div>
    );
  };

  return (
    <section id={id} ref={ref} className="my5_project_section">
      <div className="my5_inner">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="my5_container"
        >
          {selectedIds.length > 0 && (
            <button className="my5_delete_btn" onClick={handleDeleteSelected}>
              Delete Selected ( {selectedIds.length} )
            </button>
          )}

          <div className="my5_content_window">
            <AnimatePresence mode="wait">
              
              {/* [STAGE 1] 기본 메인 메뉴 화면 */}
              {activeMenu === null && (
                <motion.div
                  key="menu_root"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="my5_menu_root_zone"
                >
                  <div className="my5_root_row" onClick={() => handleMenuChange('interest')}>
                    <span className="my5_root_indicator"></span>
                    <span className="my5_root_label">Interest</span>
                  </div>
                  <div className="my5_root_row" onClick={() => handleMenuChange('projectList')}>
                    <span className="my5_root_indicator"></span>
                    <span className="my5_root_label">Project List</span>
                  </div>
                </motion.div>
              )}

              {/* [STAGE 2-A] Interest 상세 화면 */}
              {activeMenu === 'interest' && (
                <motion.div
                  key="interest_board"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="my5_table_wrapper"
                >
                  <div className="my5_table_header">
                    <div className="col_title back_trigger" onClick={() => handleMenuChange(null)}>
                      <img src="/media/etc/arrow_b.svg" alt="Back" className='my5_arrow' /> 
                      Interest
                    </div>
                    
                    <div className="col_check" onClick={(e) => { e.stopPropagation(); handleSelectAll(currentInterestMovies); }}>
                      <label className="my5_custom_check_btn" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          checked={interestMovies.length > 0 && currentInterestMovies.every(m => selectedIds.includes(m.id))}
                          onChange={(e) => { e.stopPropagation(); handleSelectAll(currentInterestMovies); }}
                        />
                        <span className="my5_check_box">
                          <img src="/media/etc/check_bold.svg" alt="check" className="my5_check_img" />
                        </span>
                      </label>
                    </div>
                    
                    <div className="col_name">Title</div>
                    <div className="col_rate">Achieved Rate</div>
                    <div className="col_days sorted">Remained Days</div>
                  </div>
                  
                  {/* 탭 구분을 위해 전용 클래스(mode_interest) 부여 */}
                  <div className="my5_table_body mode_interest">
                    {currentInterestMovies.map(movie => (
                      <div key={movie.id} className="my5_table_row" onClick={() => window.location.href = `/funding/${movie.id}`}>
                        {/* 체크박스 영역 클릭 시 로우 호버 스케일/컬러 깨짐 방지를 위해 클래스 분리 */}
                        <div className="col_check custom_check_zone" onClick={(e) => handleSelectOne(movie.id, e)}>
                          <label className="my5_custom_check_btn" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={selectedIds.includes(movie.id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleSelectOne(movie.id, e as any);
                              }}
                            />
                            <span className="my5_check_box">
                              <img src="/media/etc/check_bold.svg" alt="check" className="my5_check_img" />
                            </span>
                          </label>
                        </div>
                        <div className="col_name font_korean">{movie.title}</div> 
                        <div className="col_rate">{movie.achievedRate}%</div>
                        <div className="col_days">{movie.remainingDays} days</div>
                      </div>
                    ))}
                  </div>
                  {/* 페이지네이션 배치 */}
                  {renderPagination(interestMovies.length, interestPage, setInterestPage)}
                </motion.div>
              )}

              {/* [STAGE 2-B] Project List 상세 화면 */}
              {activeMenu === 'projectList' && (
                <motion.div
                  key="project_list_board"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="my5_table_wrapper"
                >
                  <div className="my5_table_header">
                    <div className="col_title back_trigger" onClick={() => handleMenuChange(null)}>
                      <img src="/media/etc/arrow_b.svg" alt="Back" className='my5_arrow' /> 
                      Project List
                    </div>
                    
                    {/* interestMovies로 오매핑되어 작동 안 하던 인자값을 projectListMovies로 교정 */}
                    <div className="col_check" onClick={(e) => { e.stopPropagation(); handleSelectAll(currentProjectMovies); }}>
                      <label className="my5_custom_check_btn" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          checked={currentProjectMovies.length > 0 && currentProjectMovies.every(m => selectedIds.includes(m.id))}
                          onChange={(e) => { e.stopPropagation(); handleSelectAll(currentProjectMovies); }}
                        />
                        <span className="my5_check_box">
                          <img src="/media/etc/check_bold.svg" alt="check" className="my5_check_img" />
                        </span>
                      </label>
                    </div>
                    
                    <div className="col_name">Title</div>
                    <div className="col_status sortable_header" onClick={() => setStatusOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
                      Status <span className="sort_arrow">{statusOrder === 'asc' ? '↓' : '↑'}</span>
                    </div>
                    <div className="col_tier">Genre</div>
                    <div className="col_tier">Tier</div>
                  </div>
                  
                  {/* 탭 구분을 위해 전용 클래스(mode_project) 부여 */}
                  <div className="my5_table_body mode_project">
                    {currentProjectMovies.map(movie => (
                      <div key={movie.id} className="my5_table_row" onClick={() => window.location.href = `/funding/${movie.id}`}>
                        <div className="col_check custom_check_zone" onClick={(e) => handleSelectOne(movie.id, e)}>
                          <label className="my5_custom_check_btn" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={selectedIds.includes(movie.id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleSelectOne(movie.id, e as any);
                              }}
                            />
                            <span className="my5_check_box">
                              <img src="/media/etc/check_bold.svg" alt="check" className="my5_check_img" />
                            </span>
                          </label>
                        </div>
                        <div className="col_name font_korean">{movie.title}</div>
                        <div className="col_status">
                          <span className={`status_badge ${movie.progressState}`}>{movie.progressState}</span>
                        </div>
                        <div className="col_tier">{movie.genre}</div>
                        <div className="col_tier">{movie.tier}</div>
                      </div>
                    ))}
                  </div>
                  {/* 페이지네이션 배치 */}
                  {renderPagination(projectListMovies.length, projectPage, setProjectPage)}
                </motion.div>
              )}
              
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* 커스텀 삭제 확인 모달 */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="my5_modal_overlay" onClick={() => setIsModalOpen(false)}>
            <motion.div 
              className="my5_modal_content"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫힘 방지
            >
              <h3 className="my5_modal_title">프로젝트 삭제</h3>
              <p className="my5_modal_text">
                선택한 <strong>{selectedIds.length}개</strong>의 프로젝트를 삭제하시겠습니까?
              </p>
              <div className="my5_modal_btns">
                <button className="my5_modal_btn cancel" onClick={() => setIsModalOpen(false)}>취소</button>
                <button className="my5_modal_btn confirm" onClick={handleConfirmDelete}>삭제하기</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </section>
  );
};

export default My_5;