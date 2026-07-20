import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Header.css';

interface HeaderProps {
    isLoggedIn: boolean;
    onLogout: () => void;
}

const Header = ({ isLoggedIn, onLogout }: HeaderProps) => {
    const location = useLocation();
    const [isDarkSection, setIsDarkSection] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // 모바일 메뉴 상태
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState(""); // 검색어 텍스트를 제어 상태
    const { i18n } = useTranslation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const sectionIndex = queryParams.get('section');
        if (sectionIndex !== null) {
            // 해당 섹션으로 스크롤 이동 로직
        }
    }, [location.search]);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // 감시 중인 요소가 화면에 보이면 해당 요소의 data-theme 확인
                    if (entry.isIntersecting) {
                        const theme = entry.target.getAttribute('data-theme');
                        setIsDarkSection(theme === 'dark');
                    }
                });
            },
            { threshold: [0.05] } // 섹션이 5%만 걸쳐도 감지
        );
        // 모든 섹션이나 어두운 배경이 들어가는 요소를 감시
        const sections = document.querySelectorAll('[data-theme]');
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, [location.pathname]); // 경로가 바뀔 때마다 다시 감시

    const toggleSubMenu = (menu: string) => {
        if (window.innerWidth <= 768) {
            setOpenSubMenu(openSubMenu === menu ? null : menu);
        }
    };

    // 모달을 닫을 때 검색 키워드를 초기화하는 헬퍼 함수
    const handleCloseSearch = () => {
        setIsSearchOpen(false);
        setSearchValue(""); // 모달 닫힐 때 작성된 내용 초기화
    };

    return (
        <div id='header' className={`${isDarkSection ? 'theme-dark' : 'theme-light'} ${isMenuOpen ? 'menu-open' : ''}`}>
            <div className='header_inner'>
                <div>
                    <Link to='/'>
                        <img src={isDarkSection ? "/media/etc/logo_w.png" : "/media/etc/logo_b.png"} alt="logo" className='logo' />
                    </Link>
                </div>

                <nav className={`nav_container ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className="mobile_logo_text" onClick={() => setIsMenuOpen(false)}>
                        DIRECTORY.M
                    </Link>

                    <ul className='gnb1'>
                        <li className={`gnbH ${openSubMenu === 'curation' ? 'active' : ''}`} onClick={() => toggleSubMenu('curation')}>
                        <Link to='/curation' onClick={(e) => {if (window.innerWidth <= 768) {e.preventDefault();}}}>CURATION</Link>
                        <div className='sub_gnb'>
                            <Link to='/curation' className="go_page_link" onClick={() => setIsMenuOpen(false)}>To Curation Space</Link>
                            <div className='sub'><Link to='/curation?section=0' onClick={(e) => e.stopPropagation()}>Entrance</Link></div>
                            <div className='sub'><Link to='/curation?section=1' onClick={(e) => e.stopPropagation()}>Prologue</Link></div>
                            <div className='sub'><Link to='/curation?section=2' onClick={(e) => e.stopPropagation()}>Room No.01</Link></div>
                            <div className='sub'><Link to='/curation?section=3' onClick={(e) => e.stopPropagation()}>Collection</Link></div>
                            <div className='sub'><Link to='/curation?section=4' onClick={(e) => e.stopPropagation()}>Emblems</Link></div>
                            <div className='sub'><Link to='/curation?section=5' onClick={(e) => e.stopPropagation()}>Observatory</Link></div>
                            <div className='sub'><Link to='/curation?section=6' onClick={(e) => e.stopPropagation()}>Index</Link></div>
                        </div>
                    </li>
                    <li className={`gnbH ${openSubMenu === 'explore' ? 'active' : ''}`} onClick={() => toggleSubMenu('explore')}>
                        <Link to='/explore' onClick={(e) => {if (window.innerWidth <= 768) {e.preventDefault();}}}>EXPLORE</Link>
                        <div className='sub_gnb'>
                            <Link to='/explore' className="go_page_link" onClick={() => setIsMenuOpen(false)}>To Explore Space</Link>
                            <div className='sub'><Link to='/explore?section=0' onClick={(e) => e.stopPropagation()}>Intro</Link></div>
                            <div className='sub'><Link to='/explore?section=1'onClick={(e) => e.stopPropagation()}>Exhibition</Link></div>
                            <div className='sub'><Link to='/explore?section=3' onClick={(e) => e.stopPropagation()}>All Kinds of Cinema</Link></div>
                            <div className='sub'><Link to='/explore?section=4' onClick={(e) => e.stopPropagation()}>Discovery</Link></div>
                        </div>
                    </li>
                    <li className={`gnbH ${openSubMenu === 'funding' ? 'active' : ''}`} onClick={() => toggleSubMenu('funding')}>
                        <Link to='/funding' onClick={(e) => {if (window.innerWidth <= 768) {e.preventDefault();}}}>FUNDING</Link>
                        <div className='sub_gnb'>
                            <Link to='/funding' className="go_page_link" onClick={() => setIsMenuOpen(false)}>To Funding Space</Link>
                            <div className='sub'><Link to='/funding?section=0' onClick={(e) => e.stopPropagation()}>Final Piece</Link></div>
                            <div className='sub'><Link to='/funding?section=1' onClick={(e) => e.stopPropagation()}>Take #01</Link></div>
                            <div className='sub'><Link to='/funding?section=2' onClick={(e) => e.stopPropagation()}>Live Projects</Link></div>
                            <div className='sub'><Link to='/funding?section=3' onClick={(e) => e.stopPropagation()}>Values</Link></div>
                            <div className='sub'><Link to='/funding?section=4' onClick={(e) => e.stopPropagation()}>Funding Report</Link></div>
                        </div>
                    </li>
                </ul>

                <ul className='gnb2'>
                    <li className='menu_item lang_item'>
                        <div className="lang_toggle_wrap">
                            <button 
                                onClick={() => i18n.changeLanguage('ko')} 
                                className={`lang_toggle_btn ${i18n.language.includes('ko') ? 'active' : ''}`}
                            >
                                KOR
                            </button>
                            <span className="lang_divider">/</span>
                            <button 
                                onClick={() => i18n.changeLanguage('en')} 
                                className={`lang_toggle_btn ${i18n.language.includes('en') ? 'active' : ''}`}
                            >
                                ENG
                            </button>
                        </div>
                    </li>

                    <li className={`menu_item ${openSubMenu === 'user' ? 'active' : ''}`} onClick={() => toggleSubMenu('user')}>
                        <Link to='#' onClick={(e) => window.innerWidth <= 768 && e.preventDefault()}>
                            <img src="/media/etc/userL_b.svg" alt="user" />
                        </Link>
                        <div className='sub_menu'>
                            {isLoggedIn ? (
                                <>
                                    <div className='sub'><Link to='/' onClick={onLogout}>LOGOUT</Link></div>
                                    <div className='sub'><Link to='/mypage' onClick={() => setIsMenuOpen(false)}>MY SPACE</Link></div>
                                    <div className='sub'><Link to='/membership' onClick={() => setIsMenuOpen(false)}>MEMBERSHIP</Link></div>
                                </>
                            ) : (
                                <>
                                    <div className='sub'><Link to='/login' onClick={() => setIsMenuOpen(false)}>LOGIN</Link></div>
                                    <div className='sub'><Link to='/signup' onClick={() => setIsMenuOpen(false)}>SIGN UP</Link></div>
                                    <div className='sub'><Link to='/membership' onClick={() => setIsMenuOpen(false)}>MEMBERSHIP</Link></div>
                                </>
                            )}
                        </div>
                    </li>
                    <li className='menu_item'>
                        <button onClick={() => setIsSearchOpen(true)} className="search_btn">
                            <img src={isDarkSection ? "/media/etc/searchL_w.svg" : "/media/etc/searchL_b.svg"} alt="search" />
                        </button>

                        {isSearchOpen && (
                            <div className={`search_modal_overlay ${isSearchOpen ? 'active' : ''}`}
                                 onClick={handleCloseSearch}>
                                <div className='search_modal_content' onClick={(e) => e.stopPropagation()}>
                                    <div className='search_input_wrapper'>
                                        <input type='text' autoFocus={isSearchOpen} value={searchValue}
                                               onChange={(e) => setSearchValue(e.target.value)} />
                                        <p className='he_ph' onClick={handleCloseSearch}>Search</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </li>
                </ul>

                <div className='mobile_search_bar'>
                        <input type='text' value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
                        <p className='he_ph' onClick={() => setSearchValue("")}>Search</p>
                </div>
                </nav>

                <button className="mobile_menu_btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <img src="/media/etc/arrow_b.svg" alt="menu toggle" />
                </button>
            </div>
            {isMenuOpen && <div className="menu_overlay" onClick={() => setIsMenuOpen(false)}></div>}
        </div>
    );
};

export default Header;