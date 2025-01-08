import React, { useState, useEffect } from "react";
import axios from "axios";
import ApplicationDocuments from "./ApplicationDocuments"; 
import { useAuth } from "../context/AuthContext";

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
                    className="btn  w-100"
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
      {selectedApplicationId && (
        <ApplicationDocuments
          applicationId={selectedApplicationId}
          onClose={handleCloseDocuments} 
        />
      )}
    </div>
  );
};

export default UserApplications;
