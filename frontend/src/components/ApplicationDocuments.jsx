import React, { useState, useEffect } from "react";
import axios from "axios";

const ApplicationDocuments = ({ applicationId }) => {
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        console.log("@@@@@@@@@@@");
        const response = await axios.get(`http://127.0.0.1:8000/api/application-documents/6778192ea4936db5d9c1f50f/`);
        setDocuments(response.data.documents);
      } catch (error) {
        setMessage("Failed to fetch documents.");
        console.error(error);
      }
    };

    if (applicationId) {
      fetchDocuments();
    }
  }, [applicationId]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Application Documents</h2>
      {message && <div className="alert alert-danger" role="alert">{message}</div>}
      <div className="row">
        {documents.map((doc, index) => (
          <div key={index} className="col-12 col-md-4 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{doc.filename}</h5>
                <p><strong>Size:</strong> {doc.size} bytes</p>
                <a
                  href={`http://127.0.0.1:8000/api/download/${doc.document_id}/`}
                  className="btn btn-primary w-100"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationDocuments;
