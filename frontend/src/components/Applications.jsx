import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/applications.css";
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from "react-router-dom";

function Applications() {
  const [allApplications, setAllApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const location = useLocation();
  const { adminEmail } = location.state || {};
  const category = decodeURIComponent(location.pathname.split("/").pop());
  const navigate = useNavigate();
  const { selectedLang } = useLanguage();

  const translateTexts = async (language) => {
    const elements = document.querySelectorAll("[data-key]");
    const textMap = {};

    // Extract text for translation
    elements.forEach((element) => {
      const key = element.getAttribute("data-key");
      textMap[key] = element.textContent.trim();
    });

    if (language === "en") {
      // Revert to original English
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

      // Apply translations
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
    fetch(`http://127.0.0.1:8000/api/admin/rani@gmail.com/applications/`)
      .then((response) => response.json())
      .then((data) => {
        if (data.applications) {
          setAllApplications(data.applications);
          const categorizedApplications = data.applications.filter(
            (app) => app.category === category
          );
          setFilteredApplications(categorizedApplications);
        }
      });
  }, [adminEmail, category]);

  useEffect(() => {
    translateTexts(selectedLang);
  }, [selectedLang, filteredApplications]); // Reapply translation when filtered applications change

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
  };

  const handleCloseModal = () => {
    setSelectedApplication(null);
  };

  return (
    <div className="applications-container">
      <h2 data-key="applicationsHeading" className="applications-heading" style={{ fontSize: '20px', color: '#779307' }}>
        Applications for {category}
      </h2>
      <div className="applications-list">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app) => (
            <div key={app.id} className="application-card">
              <h4 data-key={`schemeName-${app.id}`} className="scheme-name">{app.scheme_name}</h4>
              <p data-key={`userEmail-${app.id}`}>User Email: {app.user_email}</p>
              <p data-key={`status-${app.id}`}>Status: {app.status}</p>
              <button
                data-key={`viewDetailsBtn-${app.id}`}
                className="view-details-btn"
                onClick={() => handleViewDetails(app)}
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <p data-key="noApplicationsFound">No applications found for this category.</p>
        )}
      </div>

      {selectedApplication && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 data-key="modalHeading">Application Details</h2>
            <p><strong>Scheme Name:</strong> {selectedApplication.scheme_name}</p>
            <p><strong>User Email:</strong> {selectedApplication.user_email}</p>
            <p><strong>Status:</strong> {selectedApplication.status}</p>
            <p><strong>Submission Date:</strong> {selectedApplication.applied_date}</p>
            <button
              data-key="closeModalBtn"
              className="close-modal-btn"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Applications;
