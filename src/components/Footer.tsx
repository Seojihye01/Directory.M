import { Link } from "react-router-dom";
import './Footer.css';

const Footer = () => {
    
    return (
        <section className="footer_container" data-theme="light">
            <div className="footer_inner">
                <a href="/" className="footer_top">
                    <img src="/media/etc/logo_b.png" className="footer_logo"/>
                    <p className="catchphrase">Archive Today, Remember Always</p>
                </a>
                
                <div className="footer_middle">
                    <div className="sector">
                        <ul className="sec_1">
                            <li className="sec_title">SERVICE</li>
                            <Link to="/curation"><li>Curation</li></Link>
                            <Link to="/explore"><li>Explore</li></Link>
                            <Link to="/funding"><li>Funding</li></Link>
                            <Link to="/about"><li>About</li></Link>
                            <a href="#"><li>Membership</li></a>
                        </ul>
                        <ul className="sec_2">
                            <li className="sec_title">SUPPORT</li>
                            <a href="#"><li>FAQ</li></a>
                            <a href="#"><li>Customer Service</li></a>
                            <a href="#"><li>Contact Us</li></a>
                            <a href="#"><li>Help Centre</li></a>
                        </ul>
                        <ul className="sec_3">
                            <li className="sec_title">LEGAL</li>
                            <a href="#"><li>Terms of Service</li></a>
                            <a href="#"><li>Privacy Policy</li></a>
                            <a href="#"><li>Copyright Policy</li></a>
                        </ul>
                        <ul className="sec_4">
                            <li className="sec_title">SOCIAL</li>
                            <a href="#"><li>Instagram</li></a>
                            <a href="#"><li>X</li></a>
                            <a href="#"><li>Youtube</li></a>
                            <a href="#"><li>Vimeo</li></a>
                        </ul>
                    </div>
                </div>    

                <div className="footer_bottom">
                    <p className="copyright">© 2025 Directory.M</p>
                    <p className="personal_work">This project is a personal portfolio work by SEO JIHYE</p>
                </div>        
            </div>
        </section>
    )
}

export default Footer;