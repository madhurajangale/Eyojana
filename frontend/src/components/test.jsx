import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AutoTranslate = () => {
  const [sentences, setSentences] = useState([
    'Hello, how are you?',
    'What is your name?',
    'Welcome to the platform!',
  ]); // Initial sentences
  const [translatedSentences, setTranslatedSentences] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const translateSentences = async () => {
      setLoading(true);
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/translate/', {
          sentences: sentences,
          target_lang: 'hi', // Translate to Hindi
        });
        console.log(response)
        setTranslatedSentences(response.data.translated_sentences);
      } catch (error) {
        console.error('Error translating sentences:', error);
      } finally {
        setLoading(false);
      }
    };

    translateSentences(); // Call translation when component mounts or sentences change
  }, [sentences]);

  return (
    <div>
      <h1>Automatic Sentence Translation</h1>
      {loading ? (
        <p>Translating...</p>
      ) : (
        <div>
          <h2>Original Sentences</h2>
          <ul>
            {sentences.map((sentence, index) => (
              <li key={index}>{sentence}</li>
            ))}
          </ul>

          <h2>Translated Sentences</h2>
          <ul>
            {translatedSentences.map((sentence, index) => (
              <li key={index}>{sentence}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AutoTranslate;
