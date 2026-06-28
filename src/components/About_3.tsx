import { useState } from 'react';
import './About_3.css';

const About_3 = () => {
  const [lang, setLang] = useState('eng');

  return (
    <div className="about3_container" data-theme="light">
      <div className="about3_bg_wrapper">
        <img src="/media/etc/panel.jpg" className="about3_bg_image" alt="bg" />
      </div>

      <div className="about3_cont">
        <div className="about3_left_wrapper">
          <p className='about3_title'>Identity</p>
        </div>

        <div className="about3_line_wrapper">
            <p className='about3_line' />
        </div>

        <div className="about3_right_wrapper">
          <div className="about3_lang_tabs">
            <button 
              className={`lang_tab ${lang === 'eng' ? 'active' : ''}`} 
              onClick={() => setLang('eng')}
            >
              ENG
            </button>
            <span className="tab_divider">/</span>
            <button 
              className={`lang_tab ${lang === 'kor' ? 'active' : ''}`} 
              onClick={() => setLang('kor')}
            >
              KOR
            </button>
          </div>

          {lang === 'eng' ? (
            <div className='about3_right_eng'>
              People often spend more time choosing a movie than actually watching one. To solve this fatigue from endless options—the Paradox of Choice—Directory.M was created.<br/><br/>
              Our name, Directory.M, perfectly embodies this philosophy and structure. A 'Directory' is a filing system that groups and locates related data, serving as a clear roadmap for systematically categorising content. The 'M' stands for 'Moment'—the foundational building block of a movie.<br/><br/>
              By using AI technology to precisely analyse what you might overlook, we guide you to the perfect page of curation tailored to your taste.
            </div>
          ) : (
            <div className='about3_right_kor'>
              사람들은 영화를 보는 시간보다, 어떤 영화를 볼지 고르는 데 더 많은 시간을 소비합니다. 수많은 선택지 속에서 결정 장애와 피로감을 느끼는 ‘선택의 역설’을 해결하기 위해 Directory.M은 시작되었습니다. <br/><br/>우리의 이름 Directory.M은 이러한 철학과 구조를 고스란히 담고 있습니다. 관련 있는 정보를 그룹화하여 위치를 알려주는 파일 시스템의 보관함처럼, 'Directory'는 영화를 체계적으로 분류하는 이정표를 의미합니다. 'M'은 영화를 이루는 가장 기본 단위인 '순간(Moment)'을 뜻합니다.<br/><br/>
              우리는 이용자가 인지하지 못한 부분까지 AI 기술로 정교하게 분석하여, 가장 완벽한 한 페이지의 취향으로 안내합니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default About_3;