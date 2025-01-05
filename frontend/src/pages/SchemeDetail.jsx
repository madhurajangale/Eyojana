import React,{useState,useEffect} from 'react';
import { Link , useLocation } from 'react-router-dom';
import schemeData from '../dataset/dataset_final.json';
import '../styles/SchemeDetail.css'; // Updated CSS file
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
const SchemeDetail = () => {
  const location = useLocation();
    const { selectedLang } = useLanguage();
      const [translatedTexts, setTranslatedTexts] = useState({});
  const { schemeName } = location.state || {};
  const schemedetail = schemeData.find(
    (scheme) => scheme['Scheme Name'].toLowerCase() === schemeName.toLowerCase()
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
  if (!schemedetail) {
    return <div className="error-message">Scheme not found</div>;
  }

  return (
<div className="scheme-detail-container">
  <div className="scheme-header">
    <h1 className="scheme-title" data-key="scheme-name">{schemedetail["Scheme Name"]}</h1>
    <p className="scheme-category" data-key="scheme-category">{schemedetail.Category}</p>
  </div>

  <div className="scheme-info">
    <div className="info-section">
      <p data-key="gender"><strong>Gender:</strong> {schemedetail.Gender}</p>
      <p data-key="age-range"><strong>Age Range:</strong> {schemedetail["Age Range"]}</p>
      <p data-key="state"><strong>State:</strong> {schemedetail.State}</p>
    </div>
    <div className="info-section">
      <p data-key="marital-status"><strong>Marital Status:</strong> {schemedetail["Marital Status"]}</p>
      <p data-key="income"><strong>Income:</strong> {schemedetail.Income}</p>
      <p data-key="caste"><strong>Caste:</strong> {schemedetail.Caste}</p>
    </div>
    <div className="info-section">
      <p data-key="ministry"><strong>Ministry:</strong> {schemedetail.Ministry}</p>
      <p data-key="employment-status"><strong>Employment Status:</strong> {schemedetail["Employment Status"]}</p>
    </div>
  </div>

  <div className="scheme-benefits">
    <h3 data-key="benefits-header">Benefits</h3>
    <p data-key="benefits">{schemedetail.Benefits}</p>
  </div>

  <div className="scheme-details">
    <h3 data-key="details-header">Details</h3>
    <p data-key="details">{schemedetail.Details}</p>
  </div>

  <div className="scheme-documents">
    <h3 data-key="documents-header">Required Documents</h3>
    <ul>
      {schemedetail.Documents.map((doc, index) => (
        <li key={index} data-key={`document-${index}`}>{doc}</li>
      ))}
    </ul>
  </div>

  <div>
    <Link to="/schemeform">
      <button type="submit" className="applybtn" data-key="apply-now">
        Apply Now
      </button>
    </Link>
  </div>
</div>

  );
};

export default SchemeDetail;
