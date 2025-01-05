import React, { useState } from "react";
import axios from "axios";

const ApplicationDocuments = ({ applicationId }) => {
  const [document, setDocument] = useState(null); // State for a single document
  const [message, setMessage] = useState("");

  const fetchDocument = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/download/6778f24cc05d8e8a6762cf07/`,
        { responseType: "blob", timeout: 60000 }
      );

      if (response.status === 200) {
        const imageBlob = response.data;
        const imageUrl = URL.createObjectURL(imageBlob); // Create a URL for the Blob
        
        // If it's an image, display it as an image
        if (imageBlob.type.startsWith("image")) {
          setDocument({
            filename: "image.png", // Or derive filename if necessary
            documentUrl: imageUrl,
            isImage: true,
          });
        } else {
          // If it's a different document type, display it using an iframe
          setDocument({
            filename: "document.pdf", // Or derive filename if necessary
            documentUrl: imageUrl,
            isImage: false,
          });
        }

        setMessage(""); // Clear any previous error message
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
            <strong>Size:</strong> {document.size || "Unknown"} bytes
          </p>
          {document.isImage ? (
            <img src={document.documentUrl} alt={document.filename} width="100%" />
          ) : (
            <iframe
              src={document.documentUrl}
              title="Document Preview"
              width="100%"
              height="600px"
              frameBorder="0"
            ></iframe>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationDocuments;
