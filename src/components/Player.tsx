import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { allMovies } from "./MovieData";
import MovieModal from "./Moviemodal"; 
import "./Player.css";

const Player = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const navigate = useNavigate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const timerRef = useRef<any>(null);

    // 광고 및 상태 관리
    const adVideos = ["/media/APPLE.mp4"];
    const [isAdPlaying, setIsAdPlaying] = useState(true);
    const [currentVideoSrc, setCurrentVideoSrc] = useState("");
    const [isTransitioning, setIsTransitioning] = useState(false);

    // 기본 플레이어 상태
    const [isPlaying, setIsPlaying] = useState(false);
    const [brightness, setBrightness] = useState(100);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
    const [rating, setRating] = useState(0);
    const [currentLanguage, setCurrentLanguage] = useState("English");

    const movieData = allMovies.find((m) => String(m.id) === movieId);

    // 초기화: 스크롤 상단 이동 및 광고 설정
    useEffect(() => {
        window.scrollTo(0, 0);
        const randomIndex = Math.floor(Math.random() * adVideos.length);
        setCurrentVideoSrc(adVideos[randomIndex]);
        setIsAdPlaying(true);

        // 모바일 기기에서 진입 시 모던 브라우저 API를 이용해 가로 화면 잠금 시도
        const lockLandscape = async () => {
            try {
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                    if (window.screen.orientation && (window.screen.orientation as any).lock) {
                        await (window.screen.orientation as any).lock("landscape");
                    }
                }
            } catch (err) {
                console.log("Play:", err);
            }
        };

        lockLandscape();

        // 컴포넌트 나갈 때 전체화면 및 회전 잠금 해제
        return () => {
            if (document.exitFullscreen && document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            }
            if (window.screen.orientation && (window.screen.orientation as any).unlock) {
                (window.screen.orientation as any).unlock();
            }
        };
    }, [movieId]);

    useEffect(() => {
    if (!videoRef.current) return;

    if (isModalOpen) {
        videoRef.current.pause(); // 모달 열리면 정지
        setIsPlaying(false);
    } else {
        // 모달 닫힐 때 다시 재생하고 싶다면 아래 주석 해제
        // videoRef.current.play();
        // setIsPlaying(true);
    }
    }, [isModalOpen]);

    // 광고 종료 후 3초 대기 로직
    const handleVideoEnd = () => {
        if (isAdPlaying) {
            setIsTransitioning(true);
            setTimeout(() => {
                setIsAdPlaying(false);
                setIsTransitioning(false);
                setCurrentVideoSrc(movieData?.videoUrl || "/media/main_.mp4");
            }, 3000);
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setShowControls(false), 1000);
    };

    const togglePlay = () => {
        if (!videoRef.current) return;
        isPlaying ? videoRef.current.pause() : videoRef.current.play();
        setIsPlaying(!isPlaying);
    };

    const skipTime = (amount: number) => {
        if (videoRef.current && !isAdPlaying) {
            videoRef.current.currentTime += amount;
        }
    };

    const toggleSpeed = () => {
        if (isAdPlaying) return;
        const speeds = [1.0, 1.5, 2.0, 0.5];
        const nextSpeed = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
        setPlaybackSpeed(nextSpeed);
        if (videoRef.current) videoRef.current.playbackRate = nextSpeed;
    };

    // 화면 캡처 기능 (Archive)
    const handleCapture = () => {
        if (videoRef.current) {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                const link = document.createElement("a");
                link.href = canvas.toDataURL("image/png");
                link.download = `DirectoryM_Archive_${movieId}.png`;
                link.click();
            }
        }
    };

    const formatTime = (time: number) => {
        const hrs = Math.floor(time / 3600);
        const mins = Math.floor((time % 3600) / 60);
        const secs = Math.floor(time % 60);
        return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // 프로그레스 바 클릭 시 시간 이동 함수
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isAdPlaying) return;
        if (!videoRef.current || duration === 0) return;

        // 클릭된 요소(pl_progress_bar)의 크기와 위치 정보 가져오기
        const rect = e.currentTarget.getBoundingClientRect();
        // 전체 가로 길이 중 마우스가 클릭한 위치의 상대적 X 좌표 계산
        const clickX = e.clientX - rect.left;
        const width = rect.width;
    
        // 비율 계산 (0 ~ 1 사이)
        const percentage = Math.min(Math.max(clickX / width, 0), 1);
    
        // 영상의 현재 시간을 변경된 비율에 맞춰 세팅
        videoRef.current.currentTime = percentage * duration;
        setCurrentTime(percentage * duration);
    };

    if (!movieData) return null;

    return (
        <div className={`player_container ${!showControls ? "hide_cursor" : ""}`} onMouseMove={handleMouseMove}>
            
            {isTransitioning && <div className="transition_overlay"></div>}

            <video
                ref={videoRef}
                key={currentVideoSrc}
                className="main_video"
                style={{ filter: `brightness(${brightness}%)`, opacity: isTransitioning ? 0 : 1 }}
                src={currentVideoSrc}
                onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
                onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
                onEnded={handleVideoEnd}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                autoPlay
            />

            <div className={`player_overlay ${showControls ? "visible" : "hidden"}`}>
                <div className="top_bar">
                    <div className="top_left" onClick={() => navigate(-1)}>
                        <img src="/media/arrow_w.svg" className="back_icon" alt="back" />
                        <span className="movie_title">{isAdPlaying ? "Ad - Advertisement" : movieData.title}</span>
                    </div>

                    <div className="top_center star_rating">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className={`star_item ${i < rating ? "filled" : ""}`} onClick={() => setRating(i + 1)}>
                                {i < rating ? "★" : "☆"}
                            </span>
                        ))}
                    </div>

                    <div className="top_right cc_container">
                        <span className="cc_label">CC</span>
                        <ul className="cc_list">
                            {["English", "Korean", "French", "Spanish", "Chinese", "Arab"].map((lang) => (
                                <li key={lang} className={lang === currentLanguage ? "active" : ""} onClick={() => setCurrentLanguage(lang)}>
                                    {lang}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="center_controls">
                    {!isAdPlaying && <img src="/media/next.svg" className="skip_icon prev" alt="prev" onClick={() => skipTime(-10)} />}
                    <div className="main_play_btn" onClick={togglePlay}>
                        <img src={isPlaying ? "/media/pause.svg" : "/media/play_b.svg"} alt="play_toggle" />
                    </div>
                    {!isAdPlaying && <img src="/media/next.svg" className="skip_icon next" alt="next" onClick={() => skipTime(10)} />}
                </div>

                {/* 밝기 조절 */}
                <div className="brightness_control">
                    <img src="/media/light.svg" alt="light" />
                    <div className="slider_wrapper">
                        <input type="range" min="30" max="150" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="brightness_slider" />
                    </div>
                </div>

                <div className="bottom_bar">
                    <div className="progress_area">
                        <div className="time_info">{formatTime(currentTime)}</div>
                        <div className={`pl_progress_bar ${isAdPlaying ? "is_ad" : ""}`} onClick={handleProgressClick}>
                            <div className="progress_current" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
                        </div>
                        <div className="time_total">{formatTime(duration)}</div>
                    </div>

                    <div className="bottom_controls">
                        <div className="ctrl_left">
                            {!isAdPlaying && (
                                <>
                                    <span className="speed_btn" onClick={toggleSpeed}>{playbackSpeed.toFixed(1)}x</span>
                                    <div className="icon_group" onClick={handleCapture}><img src="/media/archive.svg" alt="archive" /><span>Archive</span></div>
                                </>
                            )}
                            <div className="icon_group" onClick={() => setIsModalOpen(true)}>
                                <img src="/media/episodes.svg" alt="episodes" /><span>Episodes</span>
                            </div>
                            <div className="icon_group" onClick={handleVideoEnd}>
                                <img src="/media/next_episode.svg" alt="next" /><span>Next Episode</span>
                            </div>

                            {/* 소리 조절 */}
                            <div className="volume_wrapper">
                                <img src={volume === 0 ? "/media/mute.svg" : "/media/sound_w.svg"} alt="volume" className="volume_icon" />
                                <input 
                                    type="range" min="0" max="1" step="0.05" value={volume} 
                                    onChange={(e) => {
                                        const v = Number(e.target.value);
                                        setVolume(v);
                                        if (videoRef.current) videoRef.current.volume = v;
                                    }} 
                                    className="volume_slider" 
                                />
                            </div>
                        </div>
                        <div className="ctrl_right">
                            <img src="/media/lock_b.svg" alt="lock" />
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="player_modal_wrapper">
                    <MovieModal movie={movieData} onClose={() => setIsModalOpen(false)} onMovieClick={(nextMovie) => { setIsModalOpen(false); navigate(`/player/${nextMovie.id}`); }} />
                </div>
            )}
        </div>
    );
};

export default Player;