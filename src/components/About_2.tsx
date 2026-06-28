import './About_2.css';

const About_2 = () => {
  return (
    <div className="about2_container" data-theme="light">
      <div className="about2_bg_wrapper">
        <img 
          src="/media/etc/about.png" 
          alt="Cinematic Background" 
          className="about2_bg_image"
        />
      </div>

      <div className="about2_mask_overlay"></div>
      <div className="about2_content_wrapper">
        <div className="about2_horizontal_band">
          <div className="about2_center_box">
            <p className="about2_slug_text">Where the Moment Never Ends</p>
          </div>
        </div>

        <div className="about2_meta_data">
          <h2 className="about2_brand_title">Directory.M</h2>
          <p className="about2_meta_text">A Cinematic Content Hub</p>
          <p className="about2_meta_text">Based in Seoul, KR</p>
          <p className="about2_meta_text">Since 2025</p>
        </div>
      </div>
    </div>
  );
};

export default About_2;