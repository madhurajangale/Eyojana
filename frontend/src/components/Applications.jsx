import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/applications.css";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import Lightbox from "react-image-lightbox"; 
import "react-image-lightbox/style.css";
import { useNavigate } from "react-router-dom";

function Applications() {
  const [allApplications, setAllApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const location = useLocation();
  const { adminEmail } = location.state || {};
  const category = decodeURIComponent(location.pathname.split("/").pop());
  const navigate = useNavigate();
  const { selectedLang } = useLanguage();

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
      })
      .catch((error) => console.error("Error fetching applications:", error));
  }, [adminEmail, category]);

  useEffect(() => {
    translateTexts(selectedLang);
  }, [selectedLang]);

  const handleViewDetails = async (application) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/application-documents/${application.id}`
      );
      const detailedApplication = response.data;

      setSelectedApplication({
        ...application,
        documents: detailedApplication.documents,
      });
    } catch (error) {
      console.error("Error fetching application details:", error);
    }
  };

  const handleCloseModal = () => {
    setSelectedApplication(null);
  };

  return (
    <div className="applications-container">
      <h2
        data-key="applicationsHeading"
        className="applications-heading"
        style={{ fontSize: "20px", color: "#779307" }}
      ><center> Applications for {category}</center>
      </h2>
      <div className="applications-list">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app) => (
            <div key={app.id} className="application-card">
              <h4
                data-key={`schemeName-${app.id}`}
                className="scheme-name"
              >
                {app.scheme_name}
              </h4>
              <p data-key={`userEmail-${app.id}`}>
                User Email: {app.user_email}
              </p>
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
          <p data-key="noApplicationsFound">
            No applications found for this category.
          </p>
        )}
      </div>

      {selectedApplication && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 data-key="modalHeading">Application Details</h2>
            <p>
              <strong>Scheme Name:</strong> {selectedApplication.scheme_name}
            </p>
            <p>
              <strong>User Email:</strong> {selectedApplication.user_email}
            </p>
            <p>
              <strong>Submission Date:</strong>{" "}
              {selectedApplication.applied_date}
            </p>

            <h3>Documents:</h3>
            {selectedApplication.documents &&
            selectedApplication.documents.length > 0 ? (
              <ul>
                {selectedApplication.documents.map((doc, index) => (
                  <li key={index}>
                    <strong>{doc.name}</strong>
                    {doc.content && doc.content_type === "image/png" ? (
                      <img
                        src={`data:${doc.content_type};base64,${doc.content}`}
                        alt={doc.name}
                        style={{ maxWidth: "200px", maxHeight: "200px", cursor: "pointer" }}
                        onClick={() =>
                          setLightboxImage(`data:${doc.content_type};base64,${doc.content}`)
                        }
                      />
                    ) : (
                      <a
                        href={`data:${doc.content_type};base64,${doc.content}`}
                        download={doc.name}
                      >
                        Download
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No documents available.</p>
            )}

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

      {lightboxImage && (
        <Lightbox
          mainSrc={lightboxImage}
          onCloseRequest={() => setLightboxImage(null)}
          reactModalStyle={{ overlay: { zIndex: 1000 } }}
        />
      )}
    </div>
  );
}

export default Applications;
