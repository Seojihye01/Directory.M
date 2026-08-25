import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { fundingProjects, type FundingProject, type FundingTier } from "./FundingData";
import { motion, AnimatePresence } from "framer-motion";
import "./FundingEx_1.css";

const FundingEx_1 = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<FundingProject | null>(null);
  const [showTiers, setShowTiers] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  // 선택된 티어 상태 추가
  const [selectedTier, setSelectedTier] = useState<FundingTier | null>(null);
  const tierRef = useRef<HTMLDivElement>(null); // 메뉴를 감싸는 ref 생성

  useEffect(() => {
    const found = fundingProjects.find((p) => p.id === Number(id));
    if (found) setProject(found);
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showTiers && tierRef.current && !tierRef.current.contains(event.target as Node)) {
        setShowTiers(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTiers]);
  
  if (!project) return <div className="loading">Loading...</div>;

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  // 티어 선택 함수
  const handleSelectTier = (tier: any) => {
    setSelectedTier(tier);
    setShowTiers(false);
  };

  

  return (
    <section className="fex_container" data-theme="light">
      <div className="fex_inner">
        <div className="fex1_cont">
          {/* 왼쪽: 메인 이미지 */}
          <div className="fex1_img_box">
            <img src={project.image} alt={project.title} />
          </div>

          {/* 오른쪽: 상세 정보 */}
          <div className="fex1_meta">
            <div className="fex1_top_info">
                <header className="fex1_header">
                <span className="fex1_genre">{project.genre}</span>
                <h2 className="fex1_title">{project.title}</h2>
                <p className="fex1_sub">{project.summary}</p>
                </header>

                <div className="fex1_status">
                <div className="status_row">
                    <span className="status_val">{project.achievedRate}%</span>
                    <span className="status_lbl">achieved</span>
                </div>
                <div className="status_row">
                    <span className="status_val">{project.fundedPrice}</span>
                    <span className="status_lbl">raised</span>
                </div>
                <div className="status_row">
                    <span className="status_val">{project.remainingDays}</span>
                    <span className="status_lbl">days left</span>
                </div>
                <div className="status_row">
                    <span className="status_val">{project.supporters.toLocaleString()}</span>
                    <span className="status_lbl">supporters</span>
                </div>
                </div>
            </div>

            <div className="fex1_btn_set">
              <button 
                className={`fex_heart ${isLiked ? 'active' : ''}`} 
                onClick={toggleLike}
              >
                <svg viewBox="0 0 24 24" fill={isLiked ? "#121212" : "none"} stroke={isLiked ? "transparent" : "#121212"} strokeWidth="1.5">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>

              <div className="funding_wrapper" ref={tierRef}>
                <button 
                  className={`fex_funding ${showTiers ? 'active' : ''} ${selectedTier ? 'selected' : ''}`}
                  onClick={() => setShowTiers(!showTiers)}
                >
                  {/* 선택된 티어가 있으면 그 이름을, 없으면 기본 메시지 노출 */}
                  {selectedTier ? `${selectedTier.name} Selected` : (showTiers ? "Close Options" : "Fund This Project")}
                </button>

                <AnimatePresence>
                  {showTiers && (
                    <motion.div 
                      className="fex_tier_container"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <ul className="fex_tier_list">
                        {/* 임시 데이터 맵핑 (실제 데이터는 project.tiers 등에서 가져올 수 있음) */}
                        {[
                          { id: 1, name: "Tier 01", price: "₩5,000", benefit: "엔드 크레딧 기재" },
                          { id: 2, name: "Tier 02", price: "₩30,000", benefit: "온라인 시사권, 디지털 아트북" },
                          { id: 3, name: "Tier 03", price: "₩100,000", benefit: "분석 리포트, 프라이빗 상영 초대권" }
                        ].map((tier) => (
                          <li key={tier.id} onClick={() => handleSelectTier(tier)}>
                            <div className="tier_info">
                              <strong>{tier.name} ({tier.price})</strong>
                              <span>{tier.benefit}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FundingEx_1;