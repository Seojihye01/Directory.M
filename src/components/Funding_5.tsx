import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // 상세 이동을 위한 훅
import { motion, useInView } from "framer-motion";
import { fundingProjects } from "./FundingData";
import "./Funding_5.css";

const useCountUp = (end: number, duration: number = 2000, startAnim: boolean, delay: number = 0) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined" || !startAnim) return;

    let startTime: number | null = null;
    let animationFrameId: number;
    let timeoutId: ReturnType<typeof setTimeout>;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.round(easeProgress * end);
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    timeoutId = setTimeout(() => {
      animationFrameId = window.requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration, startAnim, delay]);

  return count;
};

const Funding_5 = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const isSectionInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const isStatsInView = useInView(statsRef, { once: false, amount: 0.5 });

  const filmsFunded = useCountUp(32, 2000, isStatsInView, 200); 
  const festivalSelections = useCountUp(14, 2000, isStatsInView, 400);
  const completionRate = useCountUp(98, 2000, isStatsInView, 600);

  const sortedProjects = [...fundingProjects]
    .sort((a, b) => {
      const yearA = parseInt(a.shooting.split(' ').pop() || "0", 10);
      const yearB = parseInt(b.shooting.split(' ').pop() || "0", 10);
      return yearB - yearA; // 내림차순
    })
    .slice(0, 8);

  return (
    <section className="outcomes_section" ref={sectionRef} data-theme="light">
      <motion.h2 
        className="main_headline"
        initial={{ opacity: 0, y: 30 }}
        animate={isSectionInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        PROJECT OUTCOMES
      </motion.h2>

      <div className="table_container">
        <p className="table_sub">Funded by Directory.M</p>
        <table className="outcomes_table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Title</th>
              <th className="txt_right">Rate</th>
            </tr>
          </thead>
          <tbody>
            {sortedProjects.map((project) => (
              <tr 
                key={project.id} 
                className="clickable_row"
                onClick={() => navigate(`/funding/${project.id}`)} // 2. 상세 페이지 이동
              >
                <td>{project.shooting.split(' ').pop()}</td>
                <td className="project_title_cell">{project.title}</td>
                <td className="txt_right">{project.achievedRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="stats_container" ref={statsRef}>
        <div className="stat_item">
          <span className="stat_num">{filmsFunded}</span>
          <p className="stat_label">Films Funded</p>
        </div>
        <div className="stat_item">
          <span className="stat_num">{festivalSelections}</span>
          <p className="stat_label">Festival Selections</p>
        </div>
        <div className="stat_item">
          <span className="stat_num">{completionRate}%</span>
          <p className="stat_label">Completion Rate</p>
        </div>
      </div>
    </section>
  );
};

export default Funding_5;