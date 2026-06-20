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
    const adVideos = ["/media/etc/APPLE.mp4"];
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
    
    const [isFullscreen, setIsFullscreen] = useState(false);
    // ⭐️ 모바일 회전 유도 가이드 상태 추가
    const [showRotateGuide, setShowRotateGuide] = useState(false);

    const movieData = allMovies.find((m) => String(m.id) === movieId);

    // 초기화: 스크롤 상단 이동 및 광고 설정
    useEffect(() => {
        window.scrollTo(0, 0);
        const randomIndex = Math.floor(Math.random() * adVideos.length);
        setCurrentVideoSrc(adVideos[randomIndex]);
        setIsAdPlaying(true);
    }, [movieId]);    

    useEffect(() => {
        if (!videoRef.current) return;
        if (isModalOpen) {
            videoRef.current.pause();
            setIsPlaying(false);
        } 
    }, [isModalOpen]);

    // 전체화면 및 화면 방향 감지 동기화
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isFull = !!document.fullscreenElement || !!(document as any).webkitFullscreenElement;
            setIsFullscreen(isFull);
            
            // 전체화면에서 나갔을 때 잠금 해제 및 가이드 제거
            if (!isFull) {
                if (window.screen.orientation && window.screen.orientation.unlock) {
                    window.screen.orientation.unlock();
                }
                setShowRotateGuide(false);
            }
        };

        const handleOrientationChange = () => {
            // 가로 모드로 전환되면 가이드 숨김
            if (window.innerHeight < window.innerWidth) {
                setShowRotateGuide(false);
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
        window.addEventListener("resize", handleOrientationChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
            window.removeEventListener("resize", handleOrientationChange);
        };
    }, []);

    // 광고 종료 후 3초 대기 로직
    const handleVideoEnd = () => {
        if (isAdPlaying) {
            setIsTransitioning(true);
            setTimeout(() => {
                setIsAdPlaying(false);
                setIsTransitioning(false);
                setCurrentVideoSrc(movieData?.videoUrl || "/media/Main/main_.mp4");
            }, 3000);
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setShowControls(false), 1000);
    };

    const togglePlay = async () => {
        if (!videoRef.current) return;
        isPlaying ? videoRef.current.pause() : videoRef.current.play();
        setIsPlaying(!isPlaying);
    };

    // ⭐️ 실제 모바일 환경 대응 고도화 크로스 브라우징 전체화면 함수
    const toggleFullscreen = async () => {
        const container = document.querySelector(".player_container") as any;
        if (!container) return;

        try {
            const doc = document as any;
            const isFull = doc.fullscreenElement || doc.webkitFullscreenElement;

            if (!isFull) {
                // 1. 전체화면 진입 (iOS Safari의 webkit Request 대응 추가)
                if (container.requestFullscreen) {
                    await container.requestFullscreen();
                } else if (container.webkitRequestFullscreen) {
                    await container.webkitRequestFullscreen();
                } else if (videoRef.current && (videoRef.current as any).webkitEnterFullscreen) {
                    // iOS 오리지널 비디오 팝업 전체화면 최후의 수단
                    (videoRef.current as any).webkitEnterFullscreen();
                    return;
                }

                setIsFullscreen(true);

                // 2. 가로 모드 화면 잠금 시도
                if (window.screen.orientation && (window.screen.orientation as any).lock) {
                    await (window.screen.orientation as any).lock("landscape")
                        .then(() => {
                            setShowRotateGuide(false);
                        })
                        .catch((err : any) => {
                            console.log("자동 회전 잠금 거부됨 (유저 가이드 필요):", err);
                            // 브라우저가 잠금을 거부하고 현재 세로 방향이면 안내창 노출
                            if (window.innerHeight > window.innerWidth) {
                                setShowRotateGuide(true);
                            }
                        });
                } else {
                    // 잠금 API 자체가 없을 때 가로 유도
                    if (window.innerHeight > window.innerWidth) {
                        setShowRotateGuide(true);
                    }
                }
            } else {
                // 전체화면 탈출
                if (doc.exitFullscreen) {
                    await doc.exitFullscreen();
                } else if (doc.webkitExitFullscreen) {
                    await doc.webkitExitFullscreen();
                }
                setIsFullscreen(false);
                setShowRotateGuide(false);
            }
        } catch (err) {
            console.error("전체화면 제어 중 오류 발생:", err);
        }
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

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isAdPlaying || !videoRef.current || duration === 0) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.min(Math.max(clickX / rect.width, 0), 1);
        videoRef.current.currentTime = percentage * duration;
        setCurrentTime(percentage * duration);
    };

    if (!movieData) return null;

    return (
        <div className={`player_container ${!showControls ? "hide_cursor" : ""}`} onMouseMove={handleMouseMove}>
            
            {isTransitioning && <div className="transition_overlay"></div>}

            {/* ⭐️ 모바일 세로 차단 가이드 레이어 */}
            {showRotateGuide && (
                <div className="rotate_guide_overlay" onClick={() => setShowRotateGuide(false)}>
                    <div className="rotate_guide_content">
                        <img src="/media/rotate_device.svg" alt="rotate" className="rotate_icon_anim" />
                        <p>더 나은 시청 환경을 위해<br /><strong>기기를 가로로 회전</strong>해 주세요.</p>
                    </div>
                </div>
            )}

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
                playsInline
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

                            <div className="volume_wrapper">
                                <img src={volume === 0 ? "/media/muted.svg" : "/media/sound_w.svg"} alt="volume" className="volume_icon" />
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
                        <div className="ctrl_right" onClick={toggleFullscreen} style={{ cursor: "pointer", padding: "10px" }}>
                            <img src={isFullscreen ? "/media/fullscreen_exit.svg" : "/media/fullscreen.svg"} 
                                 alt="fullscreen" 
                                 style={{ transform: "scale(1.2)", display: "block" }} />
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