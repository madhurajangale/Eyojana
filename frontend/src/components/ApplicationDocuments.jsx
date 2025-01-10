import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const ApplicationDocuments = ({ applicationId, onClose }) => {
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
    setShowImageModal(true);
  };

  const handleCloseModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  return (
    <div className="mt-4" style={{ width: "100%" }}>
      <h2
        className="mb-3 text-center"
        style={{ fontSize: "20px", color: "#779307" }}
      >
        Application Documents
      </h2>

      {message && (
        <div className="alert alert-danger" role="alert">
          {message}
        </div>
      )}
      <div className="row">
        {documents.length === 0 ? (
          <div className="col-12">
            <p>No documents found for this application.</p>
          </div>
        ) : (
          documents.map((doc, index) => (
            <div key={index} className="col-12 col-md-4 mb-3">
              <div className="card" style={{ width: "100%", height: "100%" }}>
                <div
                  className="card-body text-center"
                  style={{ width: "100%", height: "100%" }}
                >
                  <h5 className="card-title">{doc.name}</h5>
                  {doc.content_type === "image/png" ? (
                    <img
                      src={`data:image/png;base64,${doc.content}`}
                      alt={doc.name}
                      className="img-fluid rounded"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleImageClick(`data:image/png;base64,${doc.content}`)
                      }
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

      {/* Modal for Fullscreen Image */}
      <Modal show={showImageModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Preview"
              className="img-fluid w-100"
              style={{ maxHeight: "80vh" }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ApplicationDocuments;
