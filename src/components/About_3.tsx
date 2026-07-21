import { useTranslation } from 'react-i18next';
import './About_3.css';

const About_3 = () => {
  const { t } = useTranslation();

  return (
    <div className="about3_container" data-theme="light">
      <div className="about3_bg_wrapper">
        <img src="/media/etc/panel.jpg" className="about3_bg_image" alt="bg" />
      </div>

      <div className="about3_cont">
        <div className="about3_left_wrapper">
          <p className='about3_title'>{t('about3.title')}</p>
        </div>

        <div className="about3_line_wrapper">
            <p className='about3_line' />
        </div>

        <div className="about3_right_wrapper">
          <div className='about3_right_text' style={{ whiteSpace: 'pre-line' }}>
            {t('about3.text')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About_3;