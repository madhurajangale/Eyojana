import React, { useState, useEffect } from "react";
import axios from "axios";

const ApplicationDocuments = ({ applicationId }) => {
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState("");

  const fetchDocuments = async () => {
    try {
      setMessage(""); // Clear any previous messages
      const response = await axios.get(
        `http://127.0.0.1:8000/api/application-documents/677a4ff760b16b4e79f84b7e/`
      );
      setDocuments(response.data.documents);
    } catch (error) {
      setMessage("Failed to fetch documents.");
      console.error(error);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="mb-3 text-center">Application Documents</h2>
      {message && <div className="alert alert-danger" role="alert">{message}</div>}
      <button className="btn btn-secondary mb-3" onClick={fetchDocuments}>
        Fetch Documents
      </button>
      <div className="row">
        {documents.map((doc, index) => (
          <div key={index} className="col-12 col-md-4 mb-3">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">{doc.name}</h5>
                {doc.content_type === "image/png" ? (
                  <img
                    src={`data:image/png;base64,${doc.content}`}
                    alt={doc.name}
                    className="img-fluid rounded"
                  />
                ) : (
                  <a
                    href={`data:${doc.content_type};base64,${doc.content}`}
                    download={doc.name}
                    className="btn btn-primary"
                  >
                    Download File
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationDocuments;
