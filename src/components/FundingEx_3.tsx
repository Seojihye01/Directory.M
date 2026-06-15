import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { fundingProjects, type FundingProject } from "./FundingData";
import { motion, AnimatePresence } from "framer-motion";
import "./FundingEx_3.css";

const FundingEx_3 = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<FundingProject | null>(null);
  const [step, setStep] = useState(0);
  const [isInside, setIsInside] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // 모바일 체크 상태 추가

  const sectionRef = useRef<HTMLElement>(null);
  const stepRef = useRef(0);
  const isAnimating = useRef(false);
  const wheelWaitCount = useRef(0);

  const MAX_DELAY_COUNT = 5;

  // 1. 데이터 로드
  useEffect(() => {
    const found = fundingProjects.find((p) => p.id === Number(id));
    if (found) setProject(found);
  }, [id]);

  // 2. 반응형 여부 체크 (1024px 기준)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 3. 휠 이벤트 로직 (데스크톱 전용)
  useEffect(() => {
    if (isMobile) return; // 모바일일 때는 휠 인터랙션 비활성화

    const handleGlobalWheel = (e: WheelEvent) => {
      if (!isInside || !sectionRef.current) return;
      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      if (stepRef.current === 6 && scrollingDown) {
        if (wheelWaitCount.current < MAX_DELAY_COUNT) {
          e.preventDefault();
          sectionRef.current.scrollIntoView({ behavior: "auto", block: "center" });
          wheelWaitCount.current += 1;
          return; // 지정된 카운트만큼 휠을 굴려야 아래로 빠져나갈 수 있음
        }
        return; // 카운트가 다 차면 그때 브라우저 기본 스크롤(다음 섹션) 허용
      }

      if (stepRef.current === 0 && scrollingUp) {
        wheelWaitCount.current = 0; // 초기화
        return;
      }

      // 스텝 이동 시 카운트 초기화
      e.preventDefault();
      sectionRef.current.scrollIntoView({ behavior: "auto", block: "center" });

      if (isAnimating.current) return;

      if (scrollingDown && stepRef.current < 6) {
        if (stepRef.current + 1 === 6) {
        wheelWaitCount.current = 0; // 마지막 스텝 진입 시 카운터 깨끗하게 초기화
        }
        updateStep(stepRef.current + 1);
      } else if (scrollingUp && stepRef.current > 0) {
        wheelWaitCount.current = 0;
        updateStep(stepRef.current - 1);
      }
    };

    window.addEventListener("wheel", handleGlobalWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleGlobalWheel);
  }, [isInside, isMobile]);

  const updateStep = (next: number) => {
    isAnimating.current = true;
    setStep(next);
    stepRef.current = next;
    setTimeout(() => {
      isAnimating.current = false;
    }, 400);
  };

  if (!project) return null;

  // 슬라이더 이동 값 계산
  const getSliderX = () => {
    if (isMobile) return 0; // 모바일은 이동 없음
    if (step < 2) return "100%";
    return `calc(${(step - 2) * -590}px)`;
  };

  return (
    <section
      ref={sectionRef} data-theme="light"
      className={`fex3_section step_${step} ${isMobile ? "mobile_mode" : ""}`}
      onMouseEnter={() => setIsInside(true)}
      onMouseLeave={() => setIsInside(false)}
    >
      <div className="fex3_viewport">
        {/* 시놉시스: 데스크톱은 Step 0일 때만, 모바일은 항상 상단 표시 */}
        <AnimatePresence>
          {(step === 0 || isMobile) && (
            <motion.div
              className="fex3_synopsis_container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="fex3_synopsis">{project.synopsis}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 메인 콘텐츠 구역 */}
        <div className="fex3_content_layout">
          {/* 태그 리스트 */}
          <div className="fex3_side_boundary">
            <motion.div
              className={`fex3_tag_wrapper ${step >= 2 ? "side_mode" : "center_mode"}`}
              animate={
                isMobile
                  ? { x: 0, opacity: 1 }
                  : {
                      x: step >= 2 ? 0 : "35vw",
                      opacity: step === 0 ? 0 : 1,
                    }
              }
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            >
              <ul className="fex3_tag_list">
                {project.moodTag.map((tag, i) => (
                  <motion.li key={i} layout>
                    {tag}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* 이미지 슬라이더 (모바일은 세로형) */}
          <div className="fex3_slider_boundary">
            <motion.div
              className="fex3_track"
              animate={{ x: getSliderX() }}
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
            >
              {project.images && project.images.length > 0 ? (
                project.images.map((imgObj, idx) => (
                  <div className="fex3_card" key={idx}>
                    <img 
                      src={imgObj.src} 
                      className={imgObj.effectClass || ""}
                      alt={`frame-${idx}`} 
                      onError={(e) => {
                        // 이미지 로드 실패 시 엑박 대신 임시 빈 박스 처리 혹은 에러 로깅
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ))
              ) : (
                <div className="fex3_no_image">등록된 이미지가 없습니다.</div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FundingEx_3;