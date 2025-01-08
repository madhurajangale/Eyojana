// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import "../styles/applications.css";

// function Applications() {
//   const [allApplications, setAllApplications] = useState([]);
//   const [filteredApplications, setFilteredApplications] = useState([]);
//   const [selectedApplication, setSelectedApplication] = useState(null); // For modal content
//   const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
//   const location = useLocation();
//   const { adminEmail } = location.state || {};
//   const category = location.pathname.split("/").pop();

//   useEffect(() => {
//     // Fetch all applications for the admin
//     fetch(`http://127.0.0.1:8000/api/admin/rani@gmail.com/applications/`)
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.applications) {
//           setAllApplications(data.applications);

//           // Filter applications by category
//           const categorizedApplications = data.applications.filter(
//             (app) => app.category === category
//           );
//           setFilteredApplications(categorizedApplications);
//         }
//       });
//   }, [adminEmail, category]);

//   const viewDetails = (application) => {
//     setSelectedApplication(application); // Set the selected application for modal
//     setIsModalOpen(true); // Open the modal
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedApplication(null);
//   };

//   return (
//     <div className="applications-container">
//       <h2>Applications for {category}</h2>
//       <div className="applications-list">
//         {filteredApplications.length > 0 ? (
//           filteredApplications.map((app) => (
//             <div key={app.id} className="application-card">
//               <h3>{app.scheme_name}</h3>
//               <p>User Email: {app.user_email}</p>
//               <p>Status: {app.status}</p>
//               <button
//                 className="view-details-btn"
//                 onClick={() => viewDetails(app)}
//               >
//                 View Details
//               </button>
//             </div>
//           ))
//         ) : (
//           <p>No applications found for this category.</p>
//         )}
//       </div>

//       {/* Modal */}
//       {isModalOpen && selectedApplication && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h2>Application Details</h2>
//             <p><strong>Scheme Name:</strong> {selectedApplication.scheme_name}</p>
//             <p><strong>User Email:</strong> {selectedApplication.user_email}</p>
//             <p><strong>Category:</strong> {selectedApplication.category}</p>
//             <p><strong>Status:</strong> {selectedApplication.status}</p>
//             <p><strong>Applied Date:</strong> {selectedApplication.applied_date}</p>
//             <button className="close-modal-btn" onClick={closeModal}>
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Applications;





import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/applications.css";

function Applications() {
  const [allApplications, setAllApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null); // Track the selected application
  const location = useLocation();
  const { adminEmail } = location.state || {};
  const category = decodeURIComponent(location.pathname.split("/").pop()); // Decode category

  useEffect(() => {
    // Fetch all applications for the admin
    fetch(`http://127.0.0.1:8000/api/admin/rani@gmail.com/applications/`)
      .then((response) => response.json())
      .then((data) => {
        if (data.applications) {
          setAllApplications(data.applications);

          // Filter applications by category
          const categorizedApplications = data.applications.filter(
            (app) => app.category === category
          );
          setFilteredApplications(categorizedApplications);
        }
      });
  }, [adminEmail, category]);

  // Handle view details button click
  const handleViewDetails = (application) => {
    setSelectedApplication(application); // Set the selected application for the modal
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setSelectedApplication(null); // Clear the selected application
  };

  return (
    <div className="applications-container">
      <h2>Applications for {category}</h2>
      <div className="applications-list">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app) => (
            <div key={app.id} className="application-card">
              <h3>{app.scheme_name}</h3>
              <p>User Email: {app.user_email}</p>
              <p>Status: {app.status}</p>
              <button
                className="view-details-btn"
                onClick={() => handleViewDetails(app)}
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <p>No applications found for this category.</p>
        )}
      </div>

      {/* Modal for application details */}
      {selectedApplication && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Application Details</h2>
            <p><strong>Scheme Name:</strong> {selectedApplication.scheme_name}</p>
            <p><strong>User Email:</strong> {selectedApplication.user_email}</p>
            <p><strong>Status:</strong> {selectedApplication.status}</p>
            <p><strong>Submission Date:</strong> {selectedApplication.applied_date}</p>
            {/* <p><strong>Additional Details:</strong> {selectedApplication.details}</p> */}
            <button className="close-modal-btn" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Applications;

