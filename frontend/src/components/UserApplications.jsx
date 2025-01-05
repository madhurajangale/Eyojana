import React, { useState, useEffect } from "react";
import axios from "axios";
import ApplicationDocuments from "./ApplicationDocuments"; // Assuming this component will handle the document display

const UserApplications = ({ userEmail }) => {
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState(null); // To store selected application

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/applications/shweta@gmail.com/`);
        setApplications(response.data.applications);
      } catch (error) {
        setMessage("Failed to fetch applications.");
        console.error(error);
      }
    };

    if (userEmail) {
      fetchApplications();
    }
  }, [userEmail]);

  const handleViewDocuments = (applicationId) => {
    setSelectedApplicationId(applicationId); // Set the selected application to fetch documents
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">User Applications</h1>
      {message && <div className="alert alert-danger" role="alert">{message}</div>}

      <div className="row">
        {applications.length === 0 ? (
          <div className="col-12">
            <p>No applications found for this user.</p>
          </div>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="col-12 col-md-4 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{app.scheme_name}</h5>
                  <p><strong>Category:</strong> {app.category}</p>
                  <p><strong>Status:</strong> {app.status}</p>
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => handleViewDocuments(app.id)}
                  >
                    View Documents
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Conditionally render ApplicationDocuments component */}
      {selectedApplicationId && (
        <ApplicationDocuments applicationId={selectedApplicationId} />
      )}
    </div>
  );
};

export default UserApplications;
