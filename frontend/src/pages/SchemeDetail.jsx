import React from 'react';
import { Link , useLocation } from 'react-router-dom';
import schemeData from '../dataset/dataset_final.json';
import '../styles/SchemeDetail.css'; // Updated CSS file

const SchemeDetail = () => {
  const location = useLocation();
  const { schemeName } = location.state || {};
  const schemedetail = schemeData.find(
    (scheme) => scheme['Scheme Name'].toLowerCase() === schemeName.toLowerCase()
  );

  if (!schemedetail) {
    return <div className="error-message">Scheme not found</div>;
  }

  return (
    <div className="scheme-detail-container">
      <div className="scheme-header">
        <h1 className="scheme-title">{schemedetail["Scheme Name"]}</h1>
        <p className="scheme-category">{schemedetail.Category}</p>
      </div>

      <div className="scheme-info">
        <div className="info-section">
          <p><strong>Gender:</strong> {schemedetail.Gender}</p>
          <p><strong>Age Range:</strong> {schemedetail["Age Range"]}</p>
          <p><strong>State:</strong> {schemedetail.State}</p>
        </div>
        <div className="info-section">
          <p><strong>Marital Status:</strong> {schemedetail["Marital Status"]}</p>
          <p><strong>Income:</strong> {schemedetail.Income}</p>
          <p><strong>Caste:</strong> {schemedetail.Caste}</p>
        </div>
        <div className="info-section">
          <p><strong>Ministry:</strong> {schemedetail.Ministry}</p>
          <p><strong>Employment Status:</strong> {schemedetail["Employment Status"]}</p>
        </div>
      </div>

      <div className="scheme-benefits">
        <h3>Benefits</h3>
        <p>{schemedetail.Benefits}</p>
      </div>

      <div className="scheme-details">
        <h3>Details</h3>
        <p>{schemedetail.Details}</p>
      </div>

      <div className="scheme-documents">
        <h3>Required Documents</h3>
        <ul>
          {schemedetail.Documents.map((doc, index) => (
            <li key={index}>{doc}</li>
          ))}
        </ul>
      </div>

      <div>
      <Link to="/schemeform"><button type="submit" className="applybtn">
           Apply Now
        </button></Link>
      </div>
    </div>
  );
};

export default SchemeDetail;
