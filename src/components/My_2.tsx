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

  const [formData, setFormData] = useState({
    email: user.email,
    role: user.role,
    favourite: user.favourite,
  });

  useEffect(() => {
    if (isModalOpen) {
      setFormData({
        email: user.email,
        role: user.role,
        favourite: user.favourite,
      });
      setActiveSelect(null);
    }
  }, [isModalOpen, user]);

  useEffect(() => {
    if (inView) setActiveSection(id);
  }, [inView, id, setActiveSection]);

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
      document.body.style.overflow = 'hidden';
      // touchAction: 'none'이 모달 내부 인풋 터치까지 막아버릴 수 있으므로 'unset' 처리하거나 제거합니다.
      document.body.style.touchAction = 'unset'; 
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isModalOpen]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

  const bgPositionX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const bgPositionY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const shimmerPosition = useTransform([bgPositionX, bgPositionY], ([x, y]) => `${x} ${y}`);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || isModalOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(relativeX);
    mouseY.set(relativeY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isModalOpen) return; 
    if (e.cancelable) e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const relativeX = (touch.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (touch.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(Math.max(-0.5, Math.min(0.5, relativeX)));
    mouseY.set(Math.max(-0.5, Math.min(0.5, relativeY)));
  };

  const handleMouseLeave = () => {
    if (isModalOpen) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // e.preventDefault() 완전 제거 및 이벤트 버블링 차단 정비
  const handleSelectClick = (e: React.MouseEvent | React.TouchEvent, name: string, value: string) => {
    e.stopPropagation(); 
    setFormData(prev => ({ ...prev, [name]: value }));
    setActiveSelect(null); 
  };

  const toggleSelect = (e: React.MouseEvent | React.TouchEvent, name: string) => {
    e.stopPropagation(); 
    setActiveSelect(prev => (prev === name ? null : name));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({ ...prev, ...formData })); 
    setIsModalOpen(false);
  };

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
        <motion.div 
          className="my2_metal_card"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseLeave}  
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
          <motion.div className="my2_shimmer_layer" style={{ backgroundPosition: shimmerPosition }} />

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
          <img src='/media/etc/arrow_f.svg' className='my2_arrow' alt="arrow" />
        </button>
      </motion.div>

      {/* [확정 문제 해결 모달 구조] */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            key="my2_modal_overlay"
            className="my2_modal_overlay" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)} /* 바깥 레이어 클릭 시 무조건 닫힘 */
          >
            <motion.div 
              className="my2_modal_content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              onClick={(e) => e.stopPropagation()} /* 내부 클릭이 바깥 오버레이로 유출되는 것 완벽 차단 */
            >
              <h3>EDIT ACCOUNT</h3>
              <form onSubmit={handleFormSubmit}>
                <div className="my2_input_field">
                  <label>Email</label>
                  <input 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    autoComplete="off"
                  />
                </div>
                
                {Object.keys(selectOptions).map((category) => (
                  <div className="my2_input_field" key={category}>
                    <label>{category === 'favourite' ? 'Favourite Genre' : category}</label>
                    <div className="custom_select_wrapper">
                      <div 
                        className={`si2_selected_box ${activeSelect === category ? 'active' : ''}`}
                        onClick={(e) => toggleSelect(e, category)}
                        onTouchEnd={(e) => toggleSelect(e, category)} /* 모바일 터치 대응 추가 */
                      >
                        <span>
                          {formData[category as keyof typeof formData] || `Select ${category}`}
                        </span>
                        <div className={`arrow_icon ${activeSelect === category ? 'up' : ''}`}></div>
                      </div>
        
                      {activeSelect === category && (
                        <ul className="options_list">
                          {selectOptions[category].map((opt) => (
                            <li 
                              key={opt} 
                              onClick={(e) => handleSelectClick(e, category, opt)}
                              onTouchEnd={(e) => handleSelectClick(e, category, opt)} /* 모바일 터치 대응 추가 */
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