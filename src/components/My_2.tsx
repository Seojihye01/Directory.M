import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import type { UserProfile } from './My_wrapper';
import './My_2.css';

interface SubSectionProps {
  id: string;
  setActiveSection: (id: string) => void;
  user: UserProfile; 
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const My_2: React.FC<SubSectionProps> = ({ id, setActiveSection, user, setUser }) => {
  const { ref, inView } = useInView({ threshold: 0.6 });

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSelect, setActiveSelect] = useState<string | null>(null);

  // 모달용 로컬 상태 초기값을 상위에서 내려받은 user 정보로 설정
  const [formData, setFormData] = useState({
    email: user.email,
    role: user.role,
    favourite: user.favourite,
  });

  // 모달이 열릴 때마다 인풋창의 값을 현재 상위 데이터 값으로 다시 세팅
  useEffect(() => {
    if (isModalOpen) {
      setFormData({
        email: user.email,
        role: user.role,
        favourite: user.favourite,
      });
      setActiveSelect(null); // 모달 열릴 때 드롭다운 초기화
    }
  }, [isModalOpen, user]);

  useEffect(() => {
    if (inView) setActiveSection(id);
  }, [inView, id, setActiveSection]);

  // 컴포넌트 마운트 시 모바일/터치 환경 검사
  useEffect(() => {
    const checkTouch = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isMobileWidth = window.innerWidth <= 768;
      setIsTouchDevice(hasTouch || isMobileWidth);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      // 모달이 열리면 뒷배경 스크롤 완전 고정
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      // 모달이 닫히면 원래대로 복구
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isModalOpen]);

  // 마우스 좌표를 추적할 모션 값 세팅
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 마우스 움직임에 따라 카드가 입체적으로 기울어지도록 회전값 계산
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

  // 크로매틱 메탈 빛 반사 그래디언트의 위치 계산
  const bgPositionX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const bgPositionY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const shimmerPosition = useTransform([bgPositionX, bgPositionY], ([x, y]) => `${x} ${y}`);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // 모바일/터치 환경일 경우 마우스 트래킹 로직을 아예 실행하지 않음
    if (isTouchDevice || isModalOpen) return;

    const rect = e.currentTarget.getBoundingClientRect();
    
    // 중앙을 0으로 잡고 -0.5 ~ 0.5 사이의 상대 좌표 구하기
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(relativeX);
    mouseY.set(relativeY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    // 카드를 만지고 움직일 때 화면 전체가 스크롤되는 기본 동작을 차단
    if (isModalOpen) return; // 모달 활성화 시 터치 트래킹 중단
    if (e.cancelable) e.preventDefault();

  const rect = e.currentTarget.getBoundingClientRect();
  
  // 터치 이벤트는 e.clientX 대신 e.touches[0]에서 좌표를 가져옵니다.
  const touch = e.touches[0];
  const relativeX = (touch.clientX - rect.left) / rect.width - 0.5;
  const relativeY = (touch.clientY - rect.top) / rect.height - 0.5;

  // 값의 범위를 -0.5 ~ 0.5 사이로 안전하게 제한 (손가락이 카드 밖으로 살짝 나가도 튀지 않게)
  mouseX.set(Math.max(-0.5, Math.min(0.5, relativeX)));
  mouseY.set(Math.max(-0.5, Math.min(0.5, relativeY)));

  };

  const handleMouseLeave = () => {
    if (isModalOpen) return; // 모달이 열려있을 땐 터치 종료 이벤트 무시
    // 마우스가 나가면 부드럽게 원래 정중앙 상태로 복구
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectClick = (e: React.MouseEvent, name: string, value: string) => {
    e.preventDefault();
    e.stopPropagation(); // 드롭다운 아이템 클릭 시 오버레이로 퍼지는 것 완전 차단
    setFormData(prev => ({ ...prev, [name]: value }));
    setActiveSelect(null); // 선택 완료 후 닫기
  };

  const toggleSelect = (e: React.MouseEvent, name: string) => {
    e.preventDefault();
    e.stopPropagation(); // 셀렉트 박스 클릭 시 버블링 방지
    setActiveSelect(prev => (prev === name ? null : name));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 부모 컴포넌트의 상태를 업데이트
    setUser(prev => ({ ...prev, ...formData })); 
    setIsModalOpen(false);
  };

  // 고정 선택지 틀 정의 
  const selectOptions: Record<string, string[]> = {
    role: ['Cinephile', 'Creator', 'Critic / Curator', 'etc'],
    favourite: ['Fantasy', 'Romance', 'Action', 'Thriller', 'Documentary', 'Arthouse', 'Noir', 'Classic', 'Independent', 'Etc']
  };

  return (
    <section id={id} ref={ref} className="my2_account_section">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="my2_inner"
      >
        {/* 크로매틱 카드 본체 */}
        <motion.div 
          className="my2_metal_card"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleTouchMove} // 터치 중일 때 좌표 추적
          onTouchEnd={handleMouseLeave}  
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
          {/* 빛 반사를 담당하는 가상 레이어를 부모 모션 값과 연동 */}
          <motion.div className="my2_shimmer_layer" style={{ backgroundPosition: shimmerPosition }} />

          {/* 카드 내부 텍스트 콘텐츠 보호구역 */}
          <div className="my2_card_contents">
            <div className="my2_card_header">DIRECTORY.M</div>
            <hr className="my2_card_divider" />
            <div className="my2_user_name">{user.name} {user.sirname} | {user.tier}</div>
            <div className="my2_card_number">{user.cardNumber}</div>
            <div className="my2_card_date">SINCE {user.sinceDate}</div>
            
            <div className="my2_card_details">  
              <p>{user.email}</p>
              <p>{user.role}</p>
            </div>
          </div>
        </motion.div>

        <button className="my2_edit_btn" onClick={() => setIsModalOpen(true)} >
          <span>EDIT</span>
          <img src='/media/etc/arrow_f.svg' className='my2_arrow' />
        </button>
      </motion.div>

      {/* 모달 오버레이 및 팝업창 마운트 코드 추가 */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            key="my2_modal_overlay" /* 1. AnimatePresence 내 추적을 위한 고유 key 지정 필수 */
            className="my2_modal_overlay" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsModalOpen(false);
              }
            }}
          >
            <motion.div 
              className="my2_modal_content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 버블링 차단
            >
              <h3>EDIT ACCOUNT</h3>
              <form onSubmit={handleFormSubmit}>
                <div className="my2_input_field">
                  <label>Email</label>
                  <input name="email" value={formData.email} onChange={handleInputChange} autoComplete="off" />
                </div>
                
                {Object.keys(selectOptions).map((category) => (
                  <div className="my2_input_field" key={category}>
                    <label>{category === 'favourite' ? 'Favourite Genre' : category}</label>
                    <div className="custom_select_wrapper">
                      <div 
                        className={`si2_selected_box ${activeSelect === category ? 'active' : ''}`}
                        onClick={(e) => toggleSelect(e, category)}
                      >
                      {/* formData에 들어있는 선택값 표시 */}
                      <span>
                        {formData[category as keyof typeof formData] || `Select ${category}`}
                      </span>
                    <div className={`arrow_icon ${activeSelect === category ? 'up' : ''}`}></div>
                  </div>
        
                  {/* 드롭다운 옵션 리스트 팝업 */}
                  {activeSelect === category && (
                    <ul className="options_list">
                      {selectOptions[category].map((opt) => (
                        <li 
                          key={opt} 
                          onClick={(e) => handleSelectClick(e, category, opt)}
                        >
                          {opt}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
                <div className="my2_modal_actions">
                  <button type="button" className="cancel_btn" onClick={() => setIsModalOpen(false)}>CANCEL</button>
                  <button type="submit" className="save_btn">SAVE</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default My_2;