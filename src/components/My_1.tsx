import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './My_1.css';

interface SectionProps {
  id: string;
  setActiveSection: (id: string) => void;
  sections: { id: string; label: string }[];
  handleMenuClick: (id: string) => void;
  activeSection: string;
}

const My_1: React.FC<SectionProps> = ({ 
  id, 
  setActiveSection, 
  sections, 
  handleMenuClick, 
  activeSection 
}) => {
  const { ref, inView } = useInView({ threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      setActiveSection(id); // 화면이 인트로에 머물면 activeSection을 'intro'로 변경
    }
  }, [inView, id, setActiveSection]);

  return (
    <section id={id} ref={ref} className="my1_intro_section">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        className="my1_intro_wrapper"
      >
        <div className='my1_inner'>
            <h1 className="my1_title">Welcome</h1>
        
            <nav className="mypage_navigation static_nav">
            {sections.map((section) => (
                <button
                key={section.id}
                onClick={() => handleMenuClick(section.id)}
                className={`my_menu_item ${activeSection === section.id ? 'active' : 'inactive'}`}
                >
                {section.label}
                </button>
            ))}
            </nav>
        </div>
      </motion.div>
    </section>
  );
};

export default My_1;