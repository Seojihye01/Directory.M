import { Link } from "react-router-dom";
import './Signup_1.css';

const Signup_1 = ({ onNext }: { onNext: () => void }) => {

    return(
        <section className="signup_container" data-theme="light">
            <div className="signup_inner">
                <div className="signup_content">
                    <div className="step">
                        <p className="st1">STEP 01</p>
                        <p>STEP 02</p>
                        <p>STEP 03</p>
                    </div>
                    <div className="input_step1">
                        <div className="email">
                            <p>Email</p>
                            <input type="email" name="email" />
                        </div>
                        <div className="password">
                            <p>Password</p>
                            <input type="password" name="password" />
                        </div>
                        <div className="confirm">
                            <p>Confirm Password</p>
                            <input type="password" name="password" />
                        </div>
                    </div>
                    <div className="checkbox">
                        <div className="legal">
                            <input type="checkbox" id="legal_box" />
                            <label htmlFor="legal_box">플랫폼 이용약관 및 개인정보 처리방침에 동의합니다.</label>
                        </div>
                    </div>
                    <div className="link_btn">
                        <Link to='/' className="before">
                            <img src="/media/etc/arrow_b.svg" className="be" />
                            <p>Before</p>
                        </Link>
                        <button onClick={onNext} className="next">
                            <p>Next</p>
                            <img src="/media/etc/arrow_b.svg" className="ar" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Signup_1;