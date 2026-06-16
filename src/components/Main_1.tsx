import { useRef, useState } from 'react';
import './Main_1.css';

const Main_1 = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const handleSoundToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className='main1_video_section' data-theme="dark">
      {/* 배경 영상 영역 (클릭 시 사운드 토글) */}
      <div className="main1_video_container" onClick={handleSoundToggle}>
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          onContextMenu={(e) => e.preventDefault()}
          className="main1_background_video"
        >
          <source src="/media/Main/main_.mp4" type="video/mp4" />
          브라우저가 비디오를 지원하지 않습니다.
        </video>
      </div>

      {/* 사운드 바 토글 버튼 */}
      <button 
        className={`main1_wave_btn ${isMuted ? "muted" : "playing"}`}
        onClick={handleSoundToggle}
        aria-label="Toggle Sound"
      >
        <div className="main1_wave_container">
          <span className="main1_bar bar1"></span>
          <span className="main1_bar bar2"></span>
          <span className="main1_bar bar3"></span>
        </div>
        <span className="main1_btn_text">SOUND</span>
      </button>
    </div>
  );
};

export default Main_1;