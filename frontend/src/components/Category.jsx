import React, { useState, useEffect } from "react";
import "../styles/Category.css";
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from "react-router-dom";

const categories = [
  { icon: "🌱", title: "Agriculture, Rural & Environment" },
  { icon: "🏦", title: "Banking, Financial Services and Insurance" },
  { icon: "🤝", title: "Business & Entrepreneurship" },
  { icon: "🎓", title: "Education & Learning" },
  { icon: "💊", title: "Health & Wellness" },
  { icon: "🏠", title: "Housing & Shelter" },
  { icon: "⚖️", title: "Public Safety, Law & Justice" },
  { icon: "🔬", title: "Science, IT & Communications" },
  { icon: "📊", title: "Skills & Employment" },
  { icon: "✊", title: "Social Welfare & Empowerment" },
  { icon: "🎾", title: "Sports & Culture" },
  { icon: "🚌", title: "Transport & Infrastructure" },
  { icon: "🌍", title: "Travel & Tourism" },
  { icon: "🛠️", title: "Utility & Sanitation" },
  { icon: "💑", title: "Women and Child" },
];
const Category = () => {
  const navigate = useNavigate();
  const { selectedLang } = useLanguage();
    const [translatedTexts, setTranslatedTexts] = useState({});
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
  const handleViewCategory = (category) => {
    console.log(category)
    navigate(`/scheme`, { state: { category } });
  };
  return (
    <div className="category-page">
  <h1 data-key="pageTitle" style={{ fontSize: '20px', color: '#779307'}}>schemes based on categories</h1>
  <div className="category-grid">
    {categories.map((cat, index) => (
      <div key={index} className="category-card">
        <div className="icon">{cat.icon}</div>
        <h3 data-key={`title-${index}`} className="title">{cat.title}</h3>
        <button data-key={`view-${index}`} className="view-button"
        onClick={() => handleViewCategory(cat.title)}>View</button>
      </div>
    ))}
  </div>
</div>

  );
};

export default Category;
