import React, { useState, useEffect } from "react";
import axios from "axios";
import ApplicationDocuments from "./ApplicationDocuments"; 
import { useAuth } from "../context/AuthContext";
import { Modal, Button, Spinner } from "react-bootstrap"; 
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from "react-router-dom";

const UserApplications = () => {
  const { email } = useAuth();
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState(null); 
  const [isFetching, setIsFetching] = useState(false); 
  const { selectedLang } = useLanguage();
  const [translatedTexts, setTranslatedTexts] = useState({});

  // Function to handle translations
  const translateTexts = async (language) => {
    const elements = document.querySelectorAll("[data-key]");
    const textMap = {};

    // Collect all texts with data-key attributes
    elements.forEach((element) => {
      const key = element.getAttribute("data-key");
      textMap[key] = element.textContent.trim();
    });

    if (language === "en") {
      // Revert to original text for English
      Object.keys(textMap).forEach((key) => {
        const element = document.querySelector(`[data-key="${key}"]`);
        if (element) {
          element.textContent = textMap[key]; // Restore original text
        }
      });
      return;
    }

    try {
      // Send textMap values for translation
      const response = await axios.post("http://127.0.0.1:8000/api/translate/", {
        sentences: Object.values(textMap),
        target_lang: language,
      });

      const translations = response.data.translated_sentences;

      // Apply translations back to elements
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

  useEffect(() => {
    const fetchApplications = async () => {
      if (!email) {
        setMessage("No email provided.");
        return;
      }

      setIsFetching(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/applications/${email}/`);
        if (response.data.applications && response.data.applications.length > 0) {
          setApplications(response.data.applications);
          setMessage("");
        } else {
          setMessage("No applications found for this user.");
        }
      } catch (error) {
        setMessage("Failed to fetch applications.");
        console.error("Error fetching applications:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchApplications();
  }, [email]);

  const handleViewDocuments = (applicationId) => {
    setSelectedApplicationId(applicationId);
  };

  const handleCloseDocuments = () => {
    setSelectedApplicationId(null);
  };

  const handleCloseModal = () => {
    setSelectedApplicationId(null);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center" data-key="title" style={{ fontSize: "24px", color: "#779307", fontWeight: "bold" }}>
        Your Applications
      </h1>

      {message && (
        <div className="alert alert-danger text-center" role="alert" data-key="noApplicationsMessage">
          {message}
        </div>
      )}

      {isFetching ? (
        <div className="text-center">
          <Spinner animation="border" role="status" style={{ color: "#4CAF50" }}>
            <span className="sr-only" data-key="loadingMessage">Loading...</span>
          </Spinner>
          <p data-key="loadingMessage">Loading applications...</p>
        </div>
      ) : (
        <div className="row">
          {applications.length === 0 ? (
            <div className="col-12 text-center">
              <p data-key="noApplicationsFound" style={{ color: "#666" }}>No applications found for this user.</p>
            </div>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="col-md-4 mb-4">
                <div className="card shadow-lg border-0" style={{ borderRadius: "10px", height: "13rem" }}>
                  <div className="card-body" style={{ backgroundColor: "#f9fdf7", borderRadius: "10px" }}>
                    <h5
                      className="card-title"
                      style={{ color: "#444", fontSize: "1.4rem", fontWeight: "bold" }}
                      data-key={`scheme_name_${app.id}`}
                    >
                      {translatedTexts[`scheme_name_${app.id}`] || app.scheme_name}
                    </h5>
                    <p data-key={`category_${app.id}`} style={{ marginBottom: "0.5rem", fontSize: "0.9rem", color: "#777" }}>
                      <strong>Category:</strong> {app.category}
                    </p>
                    <p
                      data-key={`status_${app.id}`}
                      style={{
                        marginBottom: "1rem",
                        fontSize: "0.9rem",
                        color: app.status === "Approved" ? "green" : app.status === "Rejected" ? "red" : "#777",
                      }}
                    >
                      <strong>Status:</strong> {app.status}
                    </p>
                  </div>
                  <button
                    className="btn btn-outline-success w-100"
                    data-key={`viewDocuments_${app.id}`}
                    style={{ borderRadius: "10px" }}
                    onClick={() => handleViewDocuments(app.id)}
                  >
                    View Documents
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedApplicationId && (
        <Modal show={true} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title data-key="modalTitle">Application Documents</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ApplicationDocuments
              applicationId={selectedApplicationId}
              onClose={handleCloseDocuments}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal} data-key="closeButton">
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default UserApplications;
