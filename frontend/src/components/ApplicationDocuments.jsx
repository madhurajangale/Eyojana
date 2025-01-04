import React, { useState } from "react";
import axios from "axios";

const ApplicationDocuments = ({ applicationId }) => {
  const [document, setDocument] = useState(null); // State for a single document
  const [message, setMessage] = useState("");

  const fetchDocument = async () => {
    try {
      // Replace hardcoded ID with dynamic applicationId if needed
      const response = axios.get('http://127.0.0.1:8000/api/download/6778f24cc05d8e8a6762cf07/', { timeout: 60000 })
      .then(response => console.log(response.data))
      .catch(error => console.error(error));
    
      if (response.data && response.data.filename) {
        // Set the document details
        setDocument({
          filename: response.data.filename,
          size: response.data.size || "Unknown",
          documentUrl: `http://127.0.0.1:8000/api/download/6778f24cc05d8e8a6762cf07/`, // Use dynamic URL
        });
        setMessage(""); // Clear error message
      } else {
        setMessage("No document found.");
      }
    } catch (error) {
      setMessage("Failed to fetch document.");
      console.error("Error fetching document:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Document Viewer</h1>

      {/* Fetch Document Button */}
      <button className="btn btn-primary mb-4" onClick={fetchDocument}>
        Fetch Document
      </button>

      {/* Error Message */}
      {message && (
        <div className="alert alert-danger" role="alert">
          {message}
        </div>
      )}

      {/* Document Preview */}
      {document && (
        <div className="document-preview">
          <h3>{document.filename}</h3>
          <p>
            <strong>Size:</strong> {document.size} bytes
          </p>
          <iframe
            src={document.documentUrl}
            title="Document Preview"
            width="100%"
            height="600px"
            frameBorder="0"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default ApplicationDocuments;
