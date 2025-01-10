import React, { useState, useEffect, useContext } from "react";
import "../styles/Scheme.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { AuthContext } from "../context/AuthContext";

const SchemeList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedLang } = useLanguage();
  const { category } = location.state || {};
  const { user } = useContext(AuthContext);
  const [schemes, setSchemes] = useState([]);
  const [translatedSchemes, setTranslatedSchemes] = useState([]);
  const [buttonText, setButtonText] = useState("View");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAndTranslateSchemes = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://127.0.0.1:8000/api/schemes/", {
        params: { category },
      });

      const fetchedSchemes = response.data.schemes || [];
      const textsToTranslate = [
        ...fetchedSchemes.map((scheme) => scheme.schemename),
        "Details", // Add button text for translation
      ];

      const translatedTexts = selectedLang === "en"
        ? textsToTranslate
        : await translateTexts(textsToTranslate, selectedLang);

      const translatedData = fetchedSchemes.map((scheme, index) => ({
        ...scheme,
        schemename: translatedTexts[index],
      }));

      setTranslatedSchemes(translatedData);
      setButtonText(translatedTexts[translatedTexts.length - 1]); // Last translated text is "View"
    } catch (err) {
      setError("Failed to fetch schemes.");
      console.error("Error fetching schemes:", err);
    } finally {
      setLoading(false);
    }
  };

  const translateTexts = async (texts, language) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/translate/", {
        sentences: texts,
        target_lang: language,
      });
      return response.data.translated_sentences;
    } catch (error) {
      console.error("Error translating texts:", error);
      return texts; // Fallback to original texts if translation fails
    }
  };

  useEffect(() => {
    fetchAndTranslateSchemes();
  }, [category, selectedLang]);

  const handleViewScheme = async (schemeName) => {
    try {
      await axios.post("http://127.0.0.1:8000/recommend/update-rating/", {
        user: user.email,
        scheme: schemeName,
        rating: 0,
      });
      navigate("/scheme-details", { state: { schemeName } });
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  return (
    <div className="scheme-list-container">
      <h1 className="title" style={{ fontSize: "15px", color: "#779307" }}>
        {selectedLang === "en" ? "Available Schemes" : "अनुपलब्ध योजनाएँ"} {/* Example Translation */}
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : translatedSchemes.length > 0 ? (
        translatedSchemes.map((scheme, index) => (
          <div key={index} className="scheme-card">
            <h2 className="scheme-name">{scheme.schemename}</h2>
            <button
              className="view-button"
              onClick={() => handleViewScheme(scheme.schemename)}
            >
              {buttonText}
            </button>
          </div>
        ))
      ) : (
        <p className="no-schemes-message">
          No schemes found for the selected category.
        </p>
      )}
    </div>
  );
};

export default SchemeList;
