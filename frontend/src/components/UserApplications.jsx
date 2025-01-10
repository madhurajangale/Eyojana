import React, { useState, useEffect } from "react";
import axios from "axios";
import ApplicationDocuments from "./ApplicationDocuments"; 
import { useAuth } from "../context/AuthContext";
import { Modal, Button, Spinner } from "react-bootstrap"; 

const UserApplications = () => {
  const { email } = useAuth();

  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState(null); 
  const [isFetching, setIsFetching] = useState(false); 

  useEffect(() => {
    const fetchApplications = async () => {
      if (!email) {
        setMessage("No email provided.");
        return;
      }

      setIsFetching(true);
      try {
        console.log("Fetching applications for user:", email);

        const response = await axios.get(`http://127.0.0.1:8000/api/applications/${email}/`);
        console.log("API response:", response.data);

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
    setSelectedApplicationId(null); // Close the modal
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center" style={{ fontSize: "24px", color: "#779307", fontWeight: "bold" }}>
        Your Applications
      </h1>

      {message && (
        <div className="alert alert-danger text-center" role="alert">
          {message}
        </div>
      )}

      {isFetching ? (
        <div className="text-center">
          <Spinner animation="border" role="status" style={{ color: "#4CAF50" }}>
            <span className="sr-only">Loading...</span>
          </Spinner>
          <p>Loading applications...</p>
        </div>
      ) : (
        <div className="row">
          {applications.length === 0 ? (
            <div className="col-12 text-center">
              <p style={{ color: "#666" }}>No applications found for this user.</p>
            </div>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="col-md-4 mb-4">
                <div className="card shadow-lg border-0" style={{ borderRadius: "10px",  height: "13rem"  }}>
                  <div className="card-body" style={{ backgroundColor: "#f9fdf7", borderRadius: "10px" }}>
                    <h5 className="card-title" style={{ color: "#444", fontSize: "1.4rem", fontWeight: "bold" }}>
                      {app.scheme_name}
                    </h5>
                    <p style={{ marginBottom: "0.5rem", fontSize: "0.9rem", color: "#777" }}>
                      <strong>Category:</strong> {app.category}
                    </p>
                    <p style={{ marginBottom: "1rem", fontSize: "0.9rem", color: app.status === "Approved" ? "green" : app.status === "Rejected" ? "red" : "#777" }}>
                      <strong>Status:</strong> {app.status}
                    </p>
                    
                  </div>
                  <button
                      className="btn btn-outline-success w-100"
                      style={{ borderRadius: "10px"}}
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
        <Modal show={true} onHide={handleCloseModal} centered >
          <Modal.Header closeButton>
            <Modal.Title>Application Documents</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ApplicationDocuments
              applicationId={selectedApplicationId}
              onClose={handleCloseDocuments}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default UserApplications;
