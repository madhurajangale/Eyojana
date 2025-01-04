import React, { useState, useEffect } from "react";
import axios from "axios";
import ApplicationDocuments from "./ApplicationDocuments";

const UserApplications = ({ userEmail }) => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        console.log("$$$$$$$$$$$$$$$$");
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

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">User Applications</h1>
      {message && <div className="alert alert-danger" role="alert">{message}</div>}
      <div className="row">
        {applications.map((app) => (
          <div key={app.id} className="col-12 col-md-4 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{app.scheme_name}</h5>
                <p><strong>Category:</strong> {app.category}</p>
                <button
                  className="btn btn-primary w-100"
                  onClick={() => setSelectedApplication(app.id)}
                >
                  View Documents
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedApplication && (
        <ApplicationDocuments applicationId={selectedApplication} />
      )}
    </div>
  );
};

export default UserApplications;
