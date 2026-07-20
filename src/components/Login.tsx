import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import './Login.css';

interface LoginProps {
    onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
    const { t } = useTranslation();
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
                                <p>{t('login.text1')}</p>
                                <input type='email' name='email' />
                            </div>
                            <div className="password">
                                <p>{t('login.text2')}</p>
                                <input type="password" name="password" />
                            </div>
                            <Link to="/" className="login_btn_anchor">
                                <div className="login_btn_box" onClick={handleLoginSubmit}>{t('login.text3')}</div>
                            </Link>
                        </div>
                        
                        <div className="floor_2">
                            <div className="remember">
                                <input type="checkbox" id="rm_box" />
                                <label htmlFor="rm_box">{t('login.text4')}</label>
                            </div>
                            <div className="floor_2_right">
                                <a href="#"><p className="forgot">{t('login.text5')}</p></a>
                                <Link to='/signup'><p className="not">{t('login.text6')}</p></Link>
                            </div>
                        </div>
                        <div className="social_media">
                            <a href="#"><p className="google">{t('login.text7')}</p></a>
                            <a href="#"><p className="naver">{t('login.text8')}</p></a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;