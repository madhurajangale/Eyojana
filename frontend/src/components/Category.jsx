import React, { useState, useEffect } from "react";
import "../styles/Category.css";
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
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

  return (
    <div className="category-page">
  <h1 data-key="pageTitle">schemes based on categories</h1>
  <div className="category-grid">
    {categories.map((cat, index) => (
      <div key={index} className="category-card">
        <div className="icon">{cat.icon}</div>
        <h3 data-key={`title-${index}`} className="title">{cat.title}</h3>
        <button data-key={`view-${index}`} className="view-button">View</button>
      </div>
    ))}
  </div>
</div>

  );
};

export default Category;
