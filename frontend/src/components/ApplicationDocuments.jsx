import React, { useState, useEffect } from "react";
import axios from "axios";

const ApplicationDocuments = ({ applicationId, onClose }) => {
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!applicationId) {
        setMessage("No application selected.");
        return;
      }

      setMessage(""); 
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/application-documents/${applicationId}/`
        );
        setDocuments(response.data.documents);
      } catch (error) {
        setMessage("Failed to fetch documents.");
        console.error(error);
      }
    };

    fetchDocuments();
  }, [applicationId]); 

  return (
    <div className="mt-4">
      <h2 className="mb-3 text-center">Application Documents</h2>
      <button className="btn btn-danger mb-3" onClick={onClose}>
        Close Documents
      </button>
      {message && <div className="alert alert-danger" role="alert">{message}</div>}
      <div className="row">
        {documents.length === 0 ? (
          <div className="col-12">
            <p>No documents found for this application.</p>
          </div>
        ) : (
          documents.map((doc, index) => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default ApplicationDocuments;
