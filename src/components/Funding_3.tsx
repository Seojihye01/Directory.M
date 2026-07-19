import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fundingProjects, type FundingProject } from './FundingData'; 
import './Funding_3.css';

const CATEGORIES = ["All", "Drama", "Romance", "Experimental", "Sci-Fi / Fantasy", "Documentary", "ETC"];
const STATUS_TABS: { label: string; value: FundingProject['progressState'] }[] = [
  { label: "Dev", value: "Dev" },
  { label: "Prod", value: "Prod" },
  { label: "Post", value: "Post" },
  { label: "Ready", value: "Ready" }
];

const Funding_3 = () => {
  const [activeTab, setActiveTab] = useState<FundingProject['progressState']>("Post");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => setAnimate(true), 700); // 0.7초 후 실행
    return () => clearTimeout(timer);
  }, [activeTab, activeCategory]);

  const displayProjects = useMemo(() => {
    let filtered = fundingProjects.filter(project => project.progressState === activeTab);
    if (activeCategory !== "All") {
      filtered = filtered.filter(project => project.genre === activeCategory);
    }
    return [...filtered, ...filtered, ...filtered].map((p, index) => ({
      ...p,
      uniqueId: `${p.id}-${index}`
    }));
  }, [activeTab, activeCategory]);

  return (
    <section className={`funding_list_section theme_${activeTab}`} data-theme="light">
      <div className="funding_container">
        
        <div className='status_tab_header'>        
          <div className="status_tab_container">
            <div className="status_tab_track glass_morph">
              {STATUS_TABS.map((tab) => (
                <button 
                  key={tab.value} 
                  className={`tab_btn ${activeTab === tab.value ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.value)}
                >
                  {tab.label}
                </button>
              ))}
              <div className={`tab_indicator pos_${activeTab}`} />
            </div>
          </div>

          <div className="filter_group">
            <span className="filter_label">Genre</span>
            <div className="fu_custom_select_wrapper">
              <div 
                className={`selected_box ${isSelectOpen ? 'active' : ''}`}
                onClick={() => setIsSelectOpen(!isSelectOpen)}
              >
                <span>{activeCategory.toUpperCase()}</span>
                <div className={`arrow_icon ${isSelectOpen ? 'up' : ''}`}></div>
              </div>
              
              {isSelectOpen && (
                <ul className="options_list">
                  {CATEGORIES.map((cat) => (
                    <li key={cat} onClick={() => {
                      setActiveCategory(cat);
                      setIsSelectOpen(false);
                    }}>
                      {cat.toUpperCase()}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="funding_board_header">
          <span className="header_label lbl_name">Project</span>
          <span className="header_label lbl_gauge">Progress</span>
          <div className="header_stats_group">
            <span className="header_label lbl_funded">Total Funded</span>
            <span className="header_label lbl_deadline">Deadline</span>
          </div>
        </div>

        <div className="funding_list_board">
          {displayProjects.map((project: any) => (
            <Link to={`/funding/${project.id}`} key={project.uniqueId} className="funding_list_link">
              <div className="funding_list_item">
                <div className="project_name">
                  <h3>{project.title}</h3>
                </div>

                <div className="gauge_container">
                  <div className="gauge_track glass_morph">
                    <div 
                      className="gauge_fill" 
                      style={{ width: animate ? `${Math.min(project.achievedRate, 100)}%` : '0%' }} 
                    />
                    <span className="gauge_value">{project.achievedRate}%</span>
                  </div>
                </div>

                <div className="project_stats">
                  <span className="stat_funded">{project.fundedPrice.toLocaleString()}</span>
                  <span className="stat_deadline">D - {project.remainingDays}</span>
                </div>
              </div>
            </Link>
          ))}

          {displayProjects.length === 0 && (
            <div className="empty_list_placeholder">
              <p>준비 중인 프로젝트입니다.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Funding_3;