import React from 'react';
import './Main_2.css';

const Main_2: React.FC = () => {
    return (
        <section className="main2_container" data-theme="dark">
            <div className="main2_inner">
                <div className='main2_cont'>
                    <a href='/about' className='main2_cta'>
                        <span>How We Work</span>
                        <img src='/media/etc/arrow_w.svg' />
                    </a>

                    <h1>DIRECTORY.M</h1>

                    <div className="main2_meta_grid">
                        <div className="main2_row">
                            <span className="main2_label">IDENTITY</span>
                            <span className="main2_value">Cinematic Content Hub</span>
                        </div>
          
                        <div className="main2_row">
                            <span className="main2_label">SINCE</span>
                            <span className="main2_value">2025</span>
                        </div>

                        <div className="main2_row">
                            <span className="main2_label">LOCATION</span>
                            <span className="main2_value">Seoul, South Korea</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Main_2;