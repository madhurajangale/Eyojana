import React, { useState, useEffect,useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.png'; 
import '../styles/navbar.css'; 
import axios from 'axios';
import eyojana from '../images/e-yojana.png';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GTranslateRoundedIcon from '@mui/icons-material/GTranslateRounded';
import SearchIcon from '@mui/icons-material/Search';
import { useLanguage } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';
function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [translatedTexts, setTranslatedTexts] = useState({});
  const [loading, setLoading] = useState(false);
  const { selectedLang, setSelectedLang } = useLanguage();
  const navigate = useNavigate();
  
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [allSchemes, setAllSchemes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user } = useContext(AuthContext); // {user}
  const toggleSearchBar = () => {
    setShowSearchBar((prev) => !prev); // Toggle the visibility
  };
  let schemeNames = [];
  // Fetch schemes from backend API
  useEffect(() => {
    // Fetch schemes from backend API
    axios.get('http://127.0.0.1:8000/api/schemes')  // Replace with your actual API endpoint
      .then((response) => {
        console.log(response)
        setAllSchemes(response.data.schemes); // Adjust based on the actual response
    setFilteredSchemes(response.data.schemes);
      })
      .catch((error) => {
        console.error('Error fetching schemes:', error);
      });
  }, []);
  
  useEffect(() => {
    if (searchQuery) {
      console.log("searching");
      const filteredResults = allSchemes.filter((scheme) =>
        scheme.schemename.toLowerCase().includes(searchQuery.toLowerCase()) // Filter based on scheme name
      );
      setFilteredSchemes(filteredResults); // Update filteredSchemes state
      console.log(filteredSchemes); // Log filtered results immediately after filtering
    } else {
      setFilteredSchemes(allSchemes); // Show all schemes when search query is empty
    }
  }, [searchQuery, allSchemes]); // Re-run effect when searchQuery or allSchemes change
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };


  const translateTexts = async (language) => {
    const elements = document.querySelectorAll("[data-key]");
    const textMap = {};

    // Extract text content by `data-key`
    elements.forEach((element) => {
      const key = element.getAttribute("data-key");
      textMap[key] = element.textContent.trim();
    });

    if (language === "en") {
      // Revert to original text written in the code
      Object.keys(textMap).forEach((key) => {
        const element = document.querySelector(`[data-key="${key}"]`);
        if (element) {
          element.textContent = textMap[key];
        }
      });
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/translate/", {
        sentences: Object.values(textMap),
        target_lang: language,
      });

      const translations = response.data.translated_sentences;

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

  const handleLogout = () => {
    // Show a confirmation alert
    if (window.confirm("Are you sure you want to log out?")) {
      // Clear user email
      user.email = "";
      
      // Navigate to the home page
      navigate("/");
    }
  };
  const myApplication=()=>{
    if (user?.email) {
      // Navigate to the profile page if user is logged in
      navigate("/myapplications");
    } else {
      // Ask the user to log in
      if (window.confirm("You need to log in to access  your applications. Do you want to log in now?")) {
        navigate("/login"); // Navigate to the login page if confirmed
      }
      else{
        navigate("/")
      }
    }
  }
  const handleSchemeClick=()=>{
    if (user?.email) {
      // Navigate to the profile page if user is logged in
      navigate("/category");
    } else {
      // Ask the user to log in
      if (window.confirm("You need to log in to access  Schemes. Do you want to log in now?")) {
        navigate("/login"); // Navigate to the login page if confirmed
      }
      else{
        navigate("/")
      }
    }
  }
  const handleProfileClick = () => {
    if (user?.email) {
      // Navigate to the profile page if user is logged in
      navigate("/profile");
    } else {
      // Ask the user to log in
      if (window.confirm("You need to log in to access your profile. Do you want to log in now?")) {
        navigate("/login"); // Navigate to the login page if confirmed
      }
      else{
        navigate("/")
      }
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true); // Set logged-in state to true on login
    navigate("/login");
  };

  const navigateToSection = (section) => {
    if (window.location.pathname !== '/') {
      navigate('/'); // Redirect to home page
    }

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
            <li><Link to="/" data-key="home">Home</Link></li>
            <li onClick={handleSchemeClick}><Link  data-key="schemes">Schemes</Link></li>
            <li><a data-key="about" href="#about" onClick={() => navigateToSection('about')}>About</a></li>
            <li><a data-key="faq" href="#faq" onClick={() => navigateToSection('faq')}>FAQs</a></li>
            <li><Link data-key="Agent Support" to="/contact">Agent Support</Link></li>
            <li onClick={myApplication}><Link data-key="myapplications" >My Applications</Link></li>
          </ul>
        </div>

        <div className="nav-login">
          {/* Login/Logout button will go here */}
        </div>

        <div className="search" onClick={toggleSearchBar} style={{ cursor: 'pointer' }}>
          <SearchIcon sx={{ color: '#779307' }} fontSize="large" />
        </div>

        {showSearchBar && (
  <div className="search-bar">
    <input
      type="text"
      placeholder="Search..."
      value={searchQuery}
      onChange={handleSearchChange}
      style={{
        padding: '10px',
        fontSize: '16px',
        width: '100%',
        border: '1px solid #ccc',
        borderRadius: '4px',
        marginTop: '10px',
      }}
    />
    <div className="search-results">
      {filteredSchemes.length > 0 && (
        <div className="dropdown">
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            {filteredSchemes.map((scheme, index) => (
              <li
                key={index}
                style={{
                  padding: '10px',
                  borderBottom: '1px solid #ccc',
                  cursor: 'pointer',
                  backgroundColor: '#fff',
                }}
                onClick={() => {
                  setSearchQuery(scheme.schemename); // Set the search bar to the clicked scheme
                  setFilteredSchemes([]); // Clear the dropdown after selection
                }}
              >
                {scheme.schemename}
              </li>
            ))}
          </ul>
        </div>
      )}
      {filteredSchemes.length === 0 && searchQuery && (
        <div style={{ padding: '10px', color: '#888' }}>No results found</div>
      )}
    </div>
  </div>
)}


        <div className="language">
          <GTranslateRoundedIcon sx={{ color: '#779307', cursor: 'pointer' }} fontSize="large" onClick={() => setShowDropdown(!showDropdown)} />
          {showDropdown && (
            <div>
              <select id="language-select" value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)}>
                <option value="en">English</option>
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

        <div className="profile-icon" onClick={handleProfileClick}>
          <Link to="/profile">
            <AccountCircleIcon sx={{ color: '#779307' }} fontSize="large" />
          </Link>
        </div>
        <div className="nav-login">
  {/* Toggle between Login and Logout based on user.email */}
  {user?.email ? (
    <button onClick={handleLogout} className="btn btn-danger">Logout</button>
  ) : (
    <button onClick={handleLogin} className="btn">Login</button>
  )}
</div>

      </div>
    </nav>
  );
}

export default Navbar;
