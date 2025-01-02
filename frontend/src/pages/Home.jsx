// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import carousel1 from '../images/kisang.png';
import carousel2 from '../images/2.png';
import '../styles/Home.css'; 
import about from '../images/video.mp4';
import applysteps from '../images/Steps.png';
import faq from '../images/faq3.png';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

function Home() {
  const [open, setOpen] = useState(null);
  const { selectedLang } = useLanguage(); // Access selected language from context
  const [loading, setLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState({
    welcomeText: 'Welcome to the platform!',
    sampleText: 'This is a sample text to be translated.',
    aboutText: 'Welcome to E-yojana, your one-stop destination for discovering and applying for government schemes tailored to your needs.',
    stepsText: 'E-Yojana is here to help you take full advantage of the resources and support available to you.',
    faq1Text: 'What is Eyojana?',
    faq2Text: 'How will Eyojana help common citizens?',
    faq3Text: 'Can I apply for the schemes through Eyojana?',
  });

  // Function to handle click and toggle
  const handleToggle = (index) => {
    setOpen(open === index ? null : index);
  };

  const translateText = async (language) => {
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/translate/', {
        sentences: [
          translatedText.welcomeText,
          translatedText.sampleText,
          translatedText.aboutText,
          translatedText.stepsText,
          translatedText.faq1Text,
          translatedText.faq2Text,
          translatedText.faq3Text,
        ],
        target_lang: language,
      });

      const translatedSentences = response.data.translated_sentences;

      setTranslatedText({
        welcomeText: translatedSentences[0],
        sampleText: translatedSentences[1],
        aboutText: translatedSentences[2],
        stepsText: translatedSentences[3],
        faq1Text: translatedSentences[4],
        faq2Text: translatedSentences[5],
        faq3Text: translatedSentences[6],
      });
    } catch (error) {
      console.error('Error during translation:', error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger translation when the language changes
  useEffect(() => {
    translateText(selectedLang);
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
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <section id="about">
        <div className='scheme1' align='center'>
          <p>{translatedText.aboutText}</p>
          <p>{translatedText.stepsText}</p>
          <Link to="/category">
            <button className='schbtn'>{translatedText.sampleText}</button>
          </Link>
          <Link to={"/adminhome"}>{translatedText.faq1Text}</Link>
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
              <h4>{translatedText.faq1Text}</h4>
              <div className="faq-question" onClick={() => handleToggle(0)}>
                {translatedText.faq1Text}
                <span className={open === 0 ? "arrow down" : "arrow right"}></span>
              </div>
              {open === 0 && <div className="faq-answer">Eyojana is a platform wherein you can find all the government schemes and apply for it.</div>}
            </div>

            <div className="faq-item">
              <div className="faq-question" onClick={() => handleToggle(1)}>
                {translatedText.faq2Text}
                <span className={open === 1 ? "arrow down" : "arrow right"}></span>
              </div>
              {open === 1 && <div className="faq-answer">Eyojana helps by categorizing schemes and provides all the support throughout the process of application.</div>}
            </div>

            <div className="faq-item">
              <div className="faq-question" onClick={() => handleToggle(2)}>
                {translatedText.faq3Text}
                <span className={open === 2 ? "arrow down" : "arrow right"}></span>
              </div>
              {open === 2 && <div className="faq-answer">Yes, you can apply.</div>}
            </div>
          </div>
        </div>
      </section>

      <footer className="footer-container" id="contact">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Powered By</h4>
            <p>Government Of India</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <p><Link to="/">Home</Link></p>
            <p><Link to="/category">Schemes</Link></p>
            <p><a href="#about">About</a></p>
            <p><a href="#faq">FAQs</a></p>
            <p><a href="#contact">Contact Us</a></p>
            <p><Link to="/ApprovedSchemes">Approved Schemes</Link></p>
          </div>

          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>Email: info@eyojana.gov</p>
            <p>Phone: +123 456 7890</p>
            <p>Address: 123 Government Building, Mumbai</p>
          </div>

          <div className="footer-section social-media">
            <h4>Follow Us</h4>
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
          <p>© 2024 E-Yojana. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
