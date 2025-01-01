import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AutoTranslate = () => {
  const [translatedTexts, setTranslatedTexts] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState('hi'); // Default language: Hindi

  // Function to extract text from specified tags
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

  // Function to translate all collected texts
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

  // Trigger translation when the language changes
  useEffect(() => {
    const texts = fetchTextFromTags();
    if (texts.length > 0) {
      translateTexts(texts, selectedLang);
    }
  }, [selectedLang]);

  return (
    <div>
      <h1 id="title">{translatedTexts['title'] || 'Translate text'}</h1>

      {/* Language Selection Dropdown */}
      <div>
        <label htmlFor="language-select">Select Language: </label>
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

      {loading && <p>Translating...</p>}

      <div>
        {/* Dynamic content rendering */}
        <h1 id="welcome">
          {translatedTexts['welcome'] || 'Welcome to the platform!'}
        </h1>
        <p id="description">
          {translatedTexts['description'] || 'This is a sample text to be translated.'}
        </p>
        <span id="tagline">
          {translatedTexts['tagline'] || 'Your journey starts here.'}
        </span>
      </div>
    </div>
  );
};

export default AutoTranslate;
