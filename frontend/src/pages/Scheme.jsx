import React from "react";
import schemesData from "../dataset/dataset_final.json";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Scheme.css"; // Import the CSS file
import { useLanguage } from '../context/LanguageContext';
import  { useState, useEffect,useContext } from "react";
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";

const SchemeList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedLang } = useLanguage();
  const { category } = location.state || {}; // Extract category from state
  const [translatedTexts, setTranslatedTexts] = useState({});
  const { user } = useContext(AuthContext);
  // Filter schemes based on the passed category
  const filteredSchemes = schemesData.filter(
    (scheme) => scheme.Category.toLowerCase() === category.toLowerCase()
  );
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
          element.textContent = textMap[key]; // Use the `data-key` as the original English text
        }
      });
      return; // Exit the function for English
    }
    try {
      // Send texts for translation
      const response = await axios.post("http://127.0.0.1:8000/api/translate/", {
        sentences: Object.values(textMap),
        target_lang: language,
      });
     console.log(response)
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
    const handleViewScheme = async (schemeName) => { 
      try { 
        const response = await axios.post('http://127.0.0.1:8000/api/update-rating/', 
        { user: user.email, scheme: schemeName,rating: 5 }); 
        
        console.log(response.data); 
        navigate('/scheme-details', 
          { state: { schemeName } }); 
        } 
          catch (error) { console.error("Error updating rating:", error); }
      }

  return (
    <div className="scheme-list-container">
    <h1 className="title" data-key="availableSchemesTitle">Available Schemes</h1>
    {filteredSchemes.length > 0 ? (
      filteredSchemes.map((scheme, index) => (
        <div key={index} className="scheme-card">
          <h2 className="scheme-name" data-key={`schemeName-${index}`}>{scheme["Scheme Name"]}</h2>
          <button 
            className="view-button" 
            onClick={() => handleViewScheme(scheme["Scheme Name"])} 
            data-key={`viewButton-${index}`}
          >
            View
          </button>
        </div>
      ))
    ) : (
      <p className="no-schemes-message" data-key="noSchemesMessage">
        No schemes found for the selected category.
      </p>
    )}
  </div>
  );
};

export default SchemeList;
