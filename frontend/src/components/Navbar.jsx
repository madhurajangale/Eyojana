import React,{ useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.png'; 
import '../styles/navbar.css'; 
import axios from 'axios';
import eyojana from '../images/e-yojana.png';
// import { AuthProvider } from "../components/AuthContext";
// import { useAuth } from "../components/AuthContext";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GTranslateRoundedIcon from '@mui/icons-material/GTranslateRounded';

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
    const [translatedTexts, setTranslatedTexts] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedLang, setSelectedLang] = useState('hi');
  const navigate = useNavigate(); // Hook for navigation in React Router
//   const { isLoggedIn } = useAuth();
// const { setIsLoggedIn } = useAuth();
const fetchTextFromTags = () => {
  const tags = ['h1', 'p', 'span', 'div', 'option', 'select']; // Specify tags to search
  let texts = [];
  tags.forEach((tag) => {
    const elements = document.querySelectorAll(tag);
    elements.forEach((element) => {
      const id = element.id || element.textContent.slice(0, 20); // Use ID or partial text for mapping
      texts.push({ id, text: element.textContent });
    });
  });
  return texts;
};


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

    // Apply translations to <option> tags directly
    document.querySelectorAll('option').forEach((option) => {
      const originalText = option.textContent;
      const translatedText = translations.find((t) =>
        t.startsWith(originalText.slice(0, 20))
      );
      if (translatedText) {
        option.textContent = translatedText;
      }
    });
  } catch (error) {
    console.error('Error translating texts:', error);
  } finally {
    setLoading(false);
  }
};
const handleLogout = () => {
// eslint-disable-next-line no-restricted-globals
  if (confirm("Are you sure you want to logout?")) {
      // Clear the token and reset login state
  // localStorage.removeItem("authToken");
  // localStorage.removeItem("Email");
  //  setIsLoggedIn(false);
    // If the user clicks "OK", navigate to the login page
    navigate("/login");
  }
  
};

  // const logout = (setIsLoggedIn) =>{
  //   // setIsLoggedIn(false);
  // }
  const navigateToSection = (section) => {
    // If not on the home page, navigate to home page first
    if (window.location.pathname !== '/') {
      navigate('/'); // Redirect to home page
    }
    
    // Scroll to the section after redirection
    setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    }, 100); // Slight delay to ensure home page is fully loaded before scrolling
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="logo">
          <a className="navbar-brand" href="#s">
            <img id="emblem" src={logo} alt="Logo" className="d-inline-block align-text-top" />
            <img src={eyojana} alt="Logo" width="120" height="30" className="d-inline-block align-text-top ms-3"/>
          </a>
        </div>

        <div className="nav-links">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/category">Schemes</Link></li>
            <li><a href="#about" onClick={() => navigateToSection('about')}>About</a></li>
            <li><a href="#faq" onClick={() => navigateToSection('faq')}>FAQs</a></li>
            <li><a href="#contact" onClick={() => navigateToSection('contact')}>Contact Us</a></li>
            <li><Link to="/myapplications">My Applications</Link></li>
          </ul>
        </div>

        <div className="nav-login">
          
          {/* {!isLoggedIn?(<Link to="/login">
            <button id="loginbutton" className="btn">Login</button>
          </Link>):(
            <Link to="/">
            <button id="loginbutton"  className="btn">LogOut</button>
          </Link>
          )} */}
        
          
        </div>
        <div className="language">
          
           {/* Language Selector Icon (Click to toggle dropdown) */}
      <GTranslateRoundedIcon
        sx={{ color: '#779307', cursor: 'pointer' }}
        fontSize="large"
        onClick={() => setShowDropdown(!showDropdown)} // Toggle dropdown visibility
      />

      {/* Conditionally render the dropdown based on showDropdown state */}
      {showDropdown && (
        <div>
          
          <select
            id="language-select"
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
          >
            <option value="as">Assamese</option>
            <option value="bn">Bengali</option>
            <option value="gu">Gujarati</option>
            <option value="hi">Hindi</option>
            <option value="kn">Kannada</option>
            <option value="ml">Malayalam</option>
            <option value="mr">Marathi</option>
            <option value="ne">Nepali</option>
            <option value="or">Odia (Oriya)</option>
            <option value="pa">Punjabi</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
            <option value="ur">Urdu</option>
          </select>
        </div>
      )}
          
        </div>
        <div className="profile-icon">
          <Link to="/profile">
            <AccountCircleIcon sx={{ color: '#779307' }} fontSize="large" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
