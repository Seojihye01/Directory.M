import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './Curation_1.css';

const Curation_1 = () => {
    const { t } = useTranslation();
    const [isEntering, setIsEntering] = useState(false);

    // 1. 중복 제거 및 모든 장르 추출
    const allGenres = [
        "Sci-Fi", "Drama", "Action", "Thriller", "Fantasy", 
        "History", "Animation", "Comedy", "Documentary", 
        "Romance", "Noir", "Arthouse", "Classic", "Independent"
    ];
    
    // 2. 12x8 그리드에 맞게 [번호, 장르] 쌍으로 48쌍(96칸) 생성
    const gridItems = Array.from({ length: 48 }, (_, i: number) => {
        const genreName = allGenres[i % allGenres.length];
        const genreNum = String(i + 1).padStart(2, '0');
        return [
            { type: 'num' as const, value: genreNum },
            { type: 'name' as const, value: genreName }
        ];
    }).flat(); // 2차원 배열을 1차원으로 (96칸)

    const handleEnterClick = () => {
        const preventScroll = (e: WheelEvent) => { e.preventDefault(); e.stopPropagation(); };
        window.addEventListener('wheel', preventScroll, { passive: false });
        document.body.style.overflow = 'hidden';
        
        setIsEntering(true);
        
        setTimeout(() => {
            const nextSection = document.getElementById('cu2_section');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
            setTimeout(() => {
                document.body.style.overflow = 'unset';
                window.removeEventListener('wheel', preventScroll);
            }, 1200);
        }, 1400); 
    };

    useEffect(() => {
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const containerVariants = {
        start: { scale: 1, opacity: 1 },
        exit: { 
            scale: 5, 
            opacity: 0,
            transition: { duration: 1.5, ease: [0.7, 0, 0.3, 1] as const } 
        }
    };

    const btnVariants = {
        start: { scale: 1, opacity: 1 },
        exit: { 
            scale: 15, // 화면을 완전히 덮을 정도로 크게 확대
            opacity: 1,
            transition: { 
                duration: 1.5, 
                ease: [0.7, 0, 0.3, 1] as const // 부드럽게 빨려 들어가는 가속도
            } 
        }
    };

    return (
        <section className="cu1_container" id="cu1_section" style={{ backgroundColor: '#f9f9f9' }} data-theme="light">
            <div style={{ position: 'absolute', inset: 0, backgroundColor: '#f9f9f9', zIndex: 0 }} />
            <AnimatePresence>
                {!isEntering && (
                    <React.Fragment key="content">
                        <motion.div 
                            className="cu1_genre_grid"
                            variants={containerVariants}
                            initial="start"
                            exit="exit"
                        >
                            {gridItems.map((item, index) => (
                                <div key={index} className={`cu1_grid_cell ${item.type}`}>
                                    <span className="cell_text">{item.value}</span>
                                </div>
                            ))}
                        </motion.div>

                        <motion.div 
                            className="editor_entry_wrapper"
                            variants={btnVariants}
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                        >
                            <button className="editor_entry_btn" onClick={handleEnterClick}>
                                <motion.span exit={{ opacity: 0, transition: { duration: 0.3 } }}>
                                    {t('curation1.title1')}
                                </motion.span>
                            </button>
                        </motion.div>
                    </React.Fragment>
                )}
            </AnimatePresence>

            {isEntering && (
                <motion.div 
                    className="transition_overlay"
                    initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                    animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
                    transition={{ delay: 1.8, duration: 0.8 }}
                    style={{ zIndex: 100 }}
                />
            )}
        </section>
    );
};

export default Curation_1;