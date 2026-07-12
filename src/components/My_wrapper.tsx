import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './My_wrapper.css';
import { type Movie } from "./MovieData";
import MovieModal from "./Moviemodal";
import My_1 from './My_1';
import My_2 from './My_2';
import My_3 from './My_3';
import My_4 from './My_4';
import My_5 from './My_5';
import My_6 from './My_6';

interface MyWrapperProps {
  onMovieClick: (movie: Movie) => void;
  isSaved: boolean;
  activeTab: string;
}

export interface UserProfile {
  name: string;
  sirname: string;
  email: string;
  role: string;
  tier: string;
  cardNumber: string;
  sinceDate: string;
  favourite: string;
}

const MyWrapper: React.FC<MyWrapperProps> = ({ onMovieClick, isSaved, activeTab }) => {
  const [user, setUser] = useState<UserProfile>({
    name: "James",
    sirname : "dean",
    email: "jamesdeann@gmail.com",
    role: "Creator",
    tier: "PLATINUM",
    cardNumber: "000 001 2025 1201",
    sinceDate: "01 / 12 / 2025",
    favourite: "Fantasy"
  });

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [activeSelect, setActiveSelect] = useState<string | null>(null);
  const [formData, setFormData] = useState({ email: user.email, role: user.role, favourite: user.favourite });

  const selectOptions: Record<string, string[]> = {
    role: ['Cinephile', 'Creator', 'Critic / Curator', 'etc'],
    favourite: ['Fantasy', 'Romance', 'Action', 'Thriller', 'Documentary', 'Arthouse', 'Noir', 'Classic', 'Independent', 'Etc']
  };

  useEffect(() => {
    if (isAccountModalOpen) {
      setFormData({ email: user.email, role: user.role, favourite: user.favourite });
      setActiveSelect(null);
      document.body.style.overflow = 'hidden';
    } else {
      if (!selectedMovie) document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isAccountModalOpen, user]);

  const SECTIONS = [
    { id: 'account', label: 'ACCOUNT' }, 
    { id: 'library', label: 'LIBRARY' },
    { id: 'timeline', label: 'TIMELINE' },
    { id: 'project', label: 'PROJECT' },
    { id: 'username', label: `DIRECTORY.${user.sirname.toUpperCase()}` },
  ];
  
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleMenuClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
    if (onMovieClick) onMovieClick(movie);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  useEffect(() => {
    if (selectedMovie) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      if (!isAccountModalOpen) {
        document.body.style.overflow = 'unset';
        document.body.style.paddingRight = '0px';
      }
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [selectedMovie, isAccountModalOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectClick = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setActiveSelect(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({ ...prev, ...formData }));
    setIsAccountModalOpen(false);
  };

  return (
    <div className="my-page-scroll-container" data-theme="light">
      <nav className={`mypage_navigation sticky_nav ${activeSection !== 'intro' ? 'visible' : 'hidden'}`}>
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => handleMenuClick(section.id)}
            className={`my_menu_item ${activeSection === section.id ? 'active' : 'inactive'}`}
          >
            {section.label}
          </button>
        ))}
      </nav>
      
      <My_1 
        id="intro" 
        sections={SECTIONS} 
        handleMenuClick={handleMenuClick} 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <My_2 id="account" setActiveSection={setActiveSection} user={user} openAccountModal={() => setIsAccountModalOpen(true)} />
      <My_3 id="library" setActiveSection={setActiveSection} isSaved={isSaved} />
      <My_4 id="timeline" setActiveSection={setActiveSection} activeTab={activeTab} onMovieClick={handleMovieSelect} />
      <My_5 id="project" setActiveSection={setActiveSection} />
      <My_6 id="username" setActiveSection={setActiveSection} onMovieClick={handleMovieSelect} user={user} />
  
      {isModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} onMovieClick={handleMovieSelect} />
      )}

      <AnimatePresence>
        {isAccountModalOpen && (
          <motion.div 
            key="my2_modal_overlay"
            className="my2_modal_overlay" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999, pointerEvents: 'auto' }}
            onClick={() => setIsAccountModalOpen(false)}
          >
            <motion.div 
              className="my2_modal_content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              style={{ background: '#ffffff', position: 'relative', zIndex: 1000000, pointerEvents: 'auto' }}
              onClick={(e) => e.stopPropagation()}
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
                    <div className="my_select_wrapper">
                      <div 
                        className={`my_selected_box ${activeSelect === category ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); setActiveSelect(prev => (prev === category ? null : category)); }}
                      >
                        <span>{formData[category as keyof typeof formData] || `Select ${category}`}</span>
                        <div className={`my_arrow_icon ${activeSelect === category ? 'up' : ''}`}></div>
                      </div>
        
                      {activeSelect === category && (
                        <ul className="my_options_list">
                          {selectOptions[category].map((opt) => (
                            <li key={opt} onClick={(e) => { e.stopPropagation(); handleSelectClick(category, opt); }}>
                              {opt}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
                <div className="my2_modal_actions">
                  <button type="button" className="cancel_btn" onClick={() => setIsAccountModalOpen(false)}>CANCEL</button>
                  <button type="submit" className="save_btn">SAVE</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyWrapper;