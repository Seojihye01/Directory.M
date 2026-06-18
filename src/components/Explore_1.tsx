import { useRef, useState } from "react";
import './Explore_1.css';

const Explore_1 = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);    

    // 마우스 움직임 감지 함수 (데스크톱 전용)

    const handleSoundToggle = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    return (
        <div 
            className='hero_video_section' 
            data-theme="light"
           
        >
            {/* 1. 비디오 영역 */}
            <div className="video_container" onClick={handleSoundToggle}>
                <video 
                    ref={videoRef}
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    onContextMenu={(e) => e.preventDefault()}
                    className="background_video"
                >
                    <source src="/media/Explore/explore_.mp4" type="video/mp4" />
                    브라우저가 비디오를 지원하지 않습니다.
                </video>
            </div>

            <button 
                className={`sound_wave_btn ${isMuted ? "muted" : "playing"}`}
                onClick={handleSoundToggle}
                aria-label="Toggle Sound"
            >
                <div className="ex1_wave_container">
                    <span className="ex1_bar bar1"></span>
                    <span className="ex1_bar bar2"></span>
                    <span className="ex1_bar bar3"></span>
                </div>
                <span className="wave_btn_text">SOUND</span>
            </button>
        </div>
    );
};

export default Explore_1;