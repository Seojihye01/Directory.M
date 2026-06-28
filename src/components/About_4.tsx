import { useState } from 'react';
import './About_4.css';

interface SlideData {
  id: number;
  title: string;
  engDesc: string;
  korDesc: string;
}

const About_4 = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const slideData: SlideData[] = [
    {
      id: 1,
      title: 'AI Match',
      engDesc: 'Beyond basic genres or popularity, our AI analyses moods, tempo, and atmosphere in multiple dimensions to match your actual preferences.',
      korDesc: '장르나 인기 순위 같은 단순한 기준을 넘어, 영화가 가진 감정, 속도, 분위기를 AI가 다차원적으로 분석하여 이용자의 실제 취향에 맞춥니다.'
    },
    {
      id: 2,
      title: 'Periodical Edition',
      engDesc: 'Instead of complex, constantly changing lists, we present expertly tailored curations fixed for a specific period, reducing exploration fatigue.',
      korDesc: '매번 바뀌는 복잡한 리스트 대신, 특정 기간 동안 AI가 엄선한 완성도 높은 취향별 추천 페이지를 고정하여 탐색의 피로를 덜어줍니다.'
    },
    {
      id: 3,
      title: 'Taste Storage',
      engDesc: `No complex features.
                Keep your selected movies and personal library in a clean space to revisit anytime.`,
      korDesc: '복잡한 기능 없이 내가 선택한 영화와 취향 목록만을 보관하여 언제든 편하게 꺼내 볼 수 있습니다.'
    }
  ];

  const handleSlideChange = (id: number) => {
    if (id === currentSlide || isAnimating) return;
    
    // 전환 애니메이션 트리거
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(id);
      setIsAnimating(false);
    }, 300); // CSS transition 시간과 일치시킴
  };

  const activeContent = slideData.find(slide => slide.id === currentSlide) || slideData[0];

  return (
    <div className="about4_section" data-theme="light">
      {/* 상단 화이트 영역 */}
      <div className="about4_top_container">
        <div className="about4_top_content">
          <h2 className="about4_section_title">
            What<br />Makes Us<br />Different
          </h2>
          
          {/* 인덱스 탭 버튼 조절 영역 */}
          <div className="about4_slide_tabs">
            {slideData.map((slide) => (
              <button
                key={slide.id}
                className={`about4_tab_btn ${currentSlide === slide.id ? 'active' : ''}`}
                onClick={() => handleSlideChange(slide.id)}
              >
                {slide.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 블랙 영역 */}
      <div className="about4_bottom_container">
        <div className="about4_bottom_content">
          <div className={`about4_slide_item ${isAnimating ? 'fade_out' : ''}`}>
            {/* 왼쪽 타이틀 */}
            <div className="about4_content_left">
              <h3 className="about4_content_title">{activeContent.title}</h3>
            </div>
            
            {/* 오른쪽 설명글 */}
            <div className="about4_content_right">
              <p className="about4_desc_eng">{activeContent.engDesc}</p>
              <p className="about4_desc_kor">{activeContent.korDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About_4;