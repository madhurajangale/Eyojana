import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';  // Assuming this is where you get selected language
import '../styles/Home.css'; 
import carousel1 from '../images/kisang.png';
import carousel2 from '../images/2.png';
import about from '../images/video.mp4';
import applysteps from '../images/Steps.png';
import faq from '../images/faq3.png';

const Home = () => {
  const [open, setOpen] = useState(null);
  const { selectedLang } = useLanguage();  // Get the selected language
  const [translatedTexts, setTranslatedTexts] = useState({});
  const [loading, setLoading] = useState(false);

  const handleToggle = (index) => {
    setOpen(open === index ? null : index);
  };

  // Function to fetch text from various elements (h1, p, etc.)
  const fetchTextFromTags = () => {
    const tags = ['h1', 'p', 'span', 'div', 'button', 'a'];  // Add more if necessary
    let texts = [];
    tags.forEach((tag) => {
      const elements = document.querySelectorAll(tag);
      elements.forEach((element) => {
        const id = element.id || element.textContent.slice(0, 20); // Use ID or partial text as key
        texts.push({ id, text: element.textContent });
      });
    });
    return texts;
  };

  // Function to translate texts using backend API
  const translateTexts = async (texts, language) => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/translate/', {
        sentences: texts.map((item) => item.text),
        target_lang: language,
      });

      const translations = response.data.translated_sentences;

      // Map translations back to elements
      const mappedTranslations = {};
      texts.forEach((item, index) => {
        mappedTranslations[item.id] = translations[index];
      });

      setTranslatedTexts(mappedTranslations);
    } catch (error) {
      console.error('Error translating texts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const texts = fetchTextFromTags();
    if (texts.length > 0) {
      translateTexts(texts, selectedLang);
    }
  }, [selectedLang]);  // Re-trigger translation when selected language changes

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
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <section id="about">
        <div className='scheme1' align='center'>
          <p>{translatedTexts['about_text'] || 'Welcome to E-yojana, your one-stop destination for discovering and applying for government schemes tailored to your needs.'}</p>
          <p>{translatedTexts['about_info'] || 'E-Yojana is here to help you take full advantage of the resources and support available to you, enhancing your well-being and contributing to national progress.'}</p>
          <Link to="/category">
            <button className='schbtn'>{translatedTexts['find_schemes'] || 'Find Schemes'}</button>
          </Link>
          <Link to={"/adminhome"}>{translatedTexts['admin'] || 'Admin'}</Link>
        </div>
      </section>

      <section>
        <div>
          <img src={applysteps} className="d-block w-100" alt="..." />
        </div>
        <div className="video-container">
          <video className="styled-video" width="800" height="400" controls>
            <source src={about} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      <section id="faq">
        <div className="faq-container">
          <div className="faq-image-container">
            <img src={faq} className="faq-image" />
          </div>

          <div className="faq-questions">
            <div className="faq-item">
              <h4>{translatedTexts['faq_title'] || 'Frequently Asked Questions'}</h4>
              <div className="faq-question" onClick={() => handleToggle(0)}>
                {translatedTexts['faq_q1'] || 'What is Eyojana?'}
                <span className={open === 0 ? "arrow down" : "arrow right"}></span>
              </div>
              {open === 0 && <div className="faq-answer">{translatedTexts['faq_a1'] || 'Eyojana is a platform wherein you can find all the government schemes and apply for it.'}</div>}
            </div>

            <div className="faq-item">
              <div className="faq-question" onClick={() => handleToggle(1)}>
                {translatedTexts['faq_q2'] || 'How will Eyojana help common citizens?'}
                <span className={open === 1 ? "arrow down" : "arrow right"}></span>
              </div>
              {open === 1 && <div className="faq-answer">{translatedTexts['faq_a2'] || 'Eyojana helps by categorizing schemes and provides all the support throughout the process of application.'}</div>}
            </div>

            <div className="faq-item">
              <div className="faq-question" onClick={() => handleToggle(2)}>
                {translatedTexts['faq_q3'] || 'Can I apply for the schemes through Eyojana?'}
                <span className={open === 2 ? "arrow down" : "arrow right"}></span>
              </div>
              {open === 2 && <div className="faq-answer">{translatedTexts['faq_a3'] || 'Yes, you can apply'}</div>}
            </div>
          </div>
        </div>
      </section>

      <footer className="footer-container" id="contact">
        <div className="footer-content">
          <div className="footer-section">
            <h4>{translatedTexts['powered_by'] || 'Powered By'}</h4>
            <p>{translatedTexts['gov_of_india'] || 'Government Of India'}</p>
          </div>

          <div className="footer-section">
            <h4>{translatedTexts['quick_links'] || 'Quick Links'}</h4>
            <p><Link to="/">{translatedTexts['home'] || 'Home'}</Link></p>
            <p><Link to="/category">{translatedTexts['schemes'] || 'Schemes'}</Link></p>
            <p><a href="#about">{translatedTexts['about'] || 'About'}</a></p>
            <p><a href="#faq">{translatedTexts['faq'] || 'FAQs'}</a></p>
            <p><a href="#contact">{translatedTexts['contact_us'] || 'Contact Us'}</a></p>
            <p><Link to="/ApprovedSchemes">{translatedTexts['approved_schemes'] || 'Approved Schemes'}</Link></p>
          </div>

          <div className="footer-section">
            <h4>{translatedTexts['contact_us'] || 'Contact Us'}</h4>
            <p>{translatedTexts['email'] || 'Email: info@eyojana.gov'}</p>
            <p>{translatedTexts['phone'] || 'Phone: +123 456 7890'}</p>
            <p>{translatedTexts['address'] || 'Address: 123 Government Building, Mumbai'}</p>
          </div>

          <div className="footer-section social-media">
            <h4>{translatedTexts['follow_us'] || 'Follow Us'}</h4>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i><p>FaceBook</p>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i><p>Twitter</p>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i><p>Instagram</p>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{translatedTexts['footer_text'] || '© 2025 E-Yojana. All rights reserved.'}</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
