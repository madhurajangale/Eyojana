import React, { useState, useEffect } from "react";
import "../styles/contact.css"; // Import the CSS file
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const ContactUsForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    supportOption: "", // 'call' or 'chat'
    phone: "", // Phone number for call
    whatsapp: "", // WhatsApp number for chat
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { selectedLang } = useLanguage();
  const [translatedTexts, setTranslatedTexts] = useState({});
  
  const translateTexts = async (language) => {
    const elements = document.querySelectorAll("[data-key]");
    const textMap = {};

    elements.forEach((element) => {
      const key = element.getAttribute("data-key");
      textMap[key] = element.textContent.trim();
    });

    if (language === "en") {
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
    translateTexts(selectedLang);
  }, [selectedLang]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address.";
    if (!formData.message) newErrors.message = "Message is required.";
    if (!formData.supportOption) newErrors.supportOption = "Support option is required.";
    if (formData.supportOption === "call" && !formData.phone) {
      newErrors.phone = "Phone number is required for call support.";
    }
    if (formData.supportOption === "chat" && !formData.whatsapp) {
      newErrors.whatsapp = "WhatsApp number is required for chat support.";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    const requestData = {
      ...formData,
      phone: formData.supportOption === "call" ? formData.phone : undefined,
      whatsapp: formData.supportOption === "chat" ? formData.whatsapp : undefined,
    };

    fetch("http://localhost:5001/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          setSuccess("Your message for personalized support has been sent successfully! You will be contacted shortly.");
          setFormData({ name: "", email: "", message: "", supportOption: "", phone: "", whatsapp: "" });
        } else {
          setSuccess("Failed to send the message. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setSuccess("An error occurred. Please try again.");
      });
  };

  return (
    <div className="contact-form-container">
      <h1 data-key="pageTitle" style={{ fontSize: '20px', color: '#779307' }}>Get Support from Agent</h1>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="input-group">
          <label htmlFor="name" data-key="nameLabel">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input"
          />
          {errors.name && <p className="error" data-key="nameError">{errors.name}</p>}
        </div>
        <div className="input-group">
          <label htmlFor="email" data-key="emailLabel">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input"
          />
          {errors.email && <p className="error" data-key="emailError">{errors.email}</p>}
        </div>
        <div className="input-group">
          <label htmlFor="message" data-key="messageLabel">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="textarea"
          />
          {errors.message && <p className="error" data-key="messageError">{errors.message}</p>}
        </div>
        <div className="input-group">
          <label data-key="supportOptionLabel">How would you like to get support?</label>
          <div>
            <label className="radio-label" data-key="chatOption">
              <input
                type="radio"
                name="supportOption"
                value="chat"
                checked={formData.supportOption === "chat"}
                onChange={handleChange}
              />
              Chat with an agent
            </label>
            <label data-key="callOption">
              <input
                type="radio"
                name="supportOption"
                value="call"
                checked={formData.supportOption === "call"}
                onChange={handleChange}
              />
              Call me for support
            </label>
          </div>
          {errors.supportOption && <p className="error" data-key="supportOptionError">{errors.supportOption}</p>}
        </div>
        {formData.supportOption === "call" && (
          <div className="input-group">
            <label htmlFor="phone" data-key="phoneLabel">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input"
            />
            {errors.phone && <p className="error" data-key="phoneError">{errors.phone}</p>}
          </div>
        )}
        {formData.supportOption === "chat" && (
          <div className="input-group">
            <label htmlFor="whatsapp" data-key="whatsappLabel">WhatsApp Number</label>
            <input
              type="text"
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className="input"
            />
            {errors.whatsapp && <p className="error" data-key="whatsappError">{errors.whatsapp}</p>}
          </div>
        )}
        <button type="submit" className="submit-button" data-key="submitButton">
          Submit
        </button>
        {success && <p className="success" data-key="successMessage">{success}</p>}
      </form>
    </div>
  );
};

export default ContactUsForm;
