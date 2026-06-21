import { useNavigate, Link } from "react-router-dom";
import './Login.css';

interface LoginProps {
    onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {

    const navigate = useNavigate();
    const handleLoginSubmit = () => {
        onLogin();
        navigate('/');
    }

    return (
        <section className="login_container" data-theme="light">
            <div className="login_inner">
                <div className="login_content">
                    <div className="cont_left">
                        <div className="img_mask">
                            <img src="/media/etc/login_main.png" />
                        </div>
                        <p className="logo_img">Directory.M</p>
                    </div>

                    <div className="cont_right">
                        <div className="floor_1">
                            <div className="email">
                                <p>EMAIL</p>
                                <input type='email' name='email' />
                            </div>
                            <div className="password">
                                <p>PASSWORD</p>
                                <input type="password" name="password" />
                            </div>
                            <Link to="/" className="login_btn_anchor">
                                <div className="login_btn_box" onClick={handleLoginSubmit}>LOGIN</div>
                            </Link>
                        </div>
                        
                        <div className="floor_2">
                            <div className="remember">
                                <input type="checkbox" id="rm_box" />
                                <label htmlFor="rm_box">Remember me</label>
                            </div>
                            <div className="floor_2_right">
                                <a href="#"><p className="forgot">Forgot password?</p></a>
                                <Link to='/signup'><p className="not">Not a member?</p></Link>
                            </div>
                        </div>
                        <div className="social_media">
                            <a href="#"><p className="google">Continue with Google</p></a>
                            <a href="#"><p className="naver">Continue with Naver</p></a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;