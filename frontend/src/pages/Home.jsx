import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';  // Assuming this is where you get selected language
import '../styles/Home.css'; 
import carousel1 from '../images/carousel1.png';
import carousel2 from '../images/carousel2.png';
import about from '../images/video.mp4';
import applysteps from '../images/Steps.png';
import faq from '../images/faq3.png';
const Home = () => {
  const [open, setOpen] = useState(null);
  
  const [translatedTexts, setTranslatedTexts] = useState({});
  const [loading, setLoading] = useState(false);
  const { selectedLang } = useLanguage(); // Get selected language from context
  const handleToggle = (index) => {
    setOpen(open === index ? null : index);
  };
  // Function to translate texts
  const translateTexts = async (language) => {
    const elements = document.querySelectorAll("[data-key]");
    const textMap = {};

    // Extract text content by `data-key`
    elements.forEach((element) => {
      const key = element.getAttribute("data-key");
      textMap[key] = element.textContent.trim();
    });

    try {
      // Send texts for translation
      const response = await axios.post("http://127.0.0.1:8000/api/translate/", {
        sentences: Object.values(textMap),
        target_lang: language,
      });

      const translations = response.data.translated_sentences;

      // Apply translations back to the DOM
      Object.keys(textMap).forEach((key, index) => {
        const element = document.querySelector(`[data-key="${key}"]`);
        if (element) {
          element.textContent = translations[index];
        }
      });
    } catch (error) {
      console.error("Error translating texts:", error);
    }
  };

  useEffect(() => {
    translateTexts(selectedLang); // Translate texts when language changes
  }, [selectedLang]);

  return (
<div className='entire'>
  <div id="carouselExampleCaptions" className="carousel slide">
    <div className="carousel-indicators">
      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
    </div>
    <div className="carousel-inner">
      <div className="carousel-item active">
        <img src={carousel1} className="d-block w-100" alt="..." />
      </div>
      <div className="carousel-item">
        <img src={carousel2} className="d-block w-100" alt="..." />
      </div>
    </div>
    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      <span className="visually-hidden" data-key="prevText">Previous</span>
    </button>
    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
      <span className="visually-hidden" data-key="nextText">Next</span>
    </button>
  </div>

  <section id="about">
    <div className='scheme1' align='center'>
      <p data-key="welcomeText"> 'Welcome to E-yojana, your one-stop destination for discovering and applying for government schemes tailored to your needs.'</p>
      <p data-key="benefitsText">'E-Yojana is here to help you take full advantage of the resources and support available to you, enhancing your well-being and contributing to national progress.'</p>
      <Link to="/category">
        <button className='schbtn' data-key="findSchemesText"> 'Find Schemes'</button>
      </Link>
      <Link to={"/adminhome"} data-key="adminText">'Admin'</Link>
    </div>
  </section>

  <section>
    <div>
      <img src={applysteps} className="d-block w-100" alt="..." />
    </div>
    <div className="video-container">
      <video className="styled-video" width="800" height="400" controls>
        <source src={about} type="video/mp4" />
        <span data-key="unsupportedVideoText">Your browser does not support the video tag.</span>
      </video>
    </div>
  </section>

  <section id="faq">
    <div className="faq-container">
      <div className="faq-image-container">
        <img src={faq} className="faq-image" alt="FAQs" />
      </div>

      <div className="faq-questions">
        <div className="faq-item">
          <h4 data-key="faqTitle">'Frequently Asked Questions'</h4>
          <div className="faq-question" onClick={() => handleToggle(0)} data-key="faqQuestion1">
            'What is Eyojana?'
            <span className={open === 0 ? "arrow down" : "arrow right"}></span>
          </div>
          {open === 0 && <div className="faq-answer" data-key="faqAnswer1"> 'Eyojana is a platform wherein you can find all the government schemes and apply for it.'</div>}
        </div>

        <div className="faq-item">
          <div className="faq-question" onClick={() => handleToggle(1)} data-key="faqQuestion2">
            'How will Eyojana help common citizens?'
            <span className={open === 1 ? "arrow down" : "arrow right"}></span>
          </div>
          {open === 1 && <div className="faq-answer" data-key="faqAnswer2"> 'Eyojana helps by categorizing schemes and provides all the support throughout the process of application.'</div>}
        </div>

        <div className="faq-item">
          <div className="faq-question" onClick={() => handleToggle(2)} data-key="faqQuestion3">
             'Can I apply for the schemes through Eyojana?'
            <span className={open === 2 ? "arrow down" : "arrow right"}></span>
          </div>
          {open === 2 && <div className="faq-answer" data-key="faqAnswer3">  'Yes, you can apply'</div>}
        </div>
      </div>
    </div>
  </section>

  {/* Footer Section */}
<footer className="footer-container" id="contact">
  <div className="footer-content">
    <div className="footer-section">
      <h4 data-key="poweredBy">Powered By</h4>
      <p data-key="govOfIndia">Government Of India</p>
    </div>
    <div className="footer-section">
      <h4 data-key="quickLinks">Quick Links</h4>
      <p><Link to="/" data-key="home">Home</Link></p>
      <p><Link to="/category" data-key="schemes">Schemes</Link></p>
      <p><a href="#about" data-key="about">About</a></p>
      <p><a href="#faq" data-key="faq">FAQs</a></p>
      <p><a href="#contact" data-key="contact">Contact Us</a></p>
    </div>
    <div className="footer-section">
      <h4 data-key="contactUs">Contact Us</h4>
      <p data-key="email">Email: info@eyojana.gov</p>
      <p data-key="phone">Phone: +123 456 7890</p>
      <p data-key="address">Address: 123 Government Building, Mumbai</p>
    </div>
  </div>
  <div className="footer-bottom">
    <p data-key="copyright">© 2025 E-Yojana. All rights reserved.</p>
  </div>
</footer>

</div>

  );
};

export default Home;
