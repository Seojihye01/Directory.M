import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import type { UserProfile } from './My_wrapper';
import './My_2.css';

interface SubSectionProps {
  id: string;
  setActiveSection: (id: string) => void;
  user: UserProfile; 
  openAccountModal: () => void;
}

const My_2: React.FC<SubSectionProps> = ({ id, setActiveSection, user, openAccountModal }) => {
  const { ref, inView } = useInView({ threshold: 0.6 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

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

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
  const bgPositionX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const bgPositionY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);
  const shimmerPosition = useTransform([bgPositionX, bgPositionY], ([x, y]) => `${x} ${y}`);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(relativeX);
    mouseY.set(relativeY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const relativeX = (touch.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (touch.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(Math.max(-0.5, Math.min(0.5, relativeX)));
    mouseY.set(Math.max(-0.5, Math.min(0.5, relativeY)));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
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

        <button className="my2_edit_btn" onClick={openAccountModal}>
          <span>EDIT</span>
          <img src='/media/etc/arrow_f.svg' className='my2_arrow' alt="arrow" />
        </button>
      </motion.div>
    </section>
  );
};

export default My_2;