import React from 'react';
import { useLocation } from 'react-router-dom';
import schemeData from '../dataset/dataset_final.json';
import '../styles/SchemeDetail.css'; // Import the CSS file

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
      <h1 className="scheme-title">{schemedetail["Scheme Name"]}</h1>
      <p><strong>Category:</strong> {schemedetail.Category}</p>
      <p><strong>Gender:</strong> {schemedetail.Gender}</p>
      <p><strong>Age Range:</strong> {schemedetail["Age Range"]}</p>
      <p><strong>State:</strong> {schemedetail.State}</p>
      <p><strong>Marital Status:</strong> {schemedetail["Marital Status"]}</p>
      <p><strong>Income:</strong> {schemedetail.Income}</p>
      <p><strong>Caste:</strong> {schemedetail.Caste}</p>
      <p><strong>Ministry:</strong> {schemedetail.Ministry}</p>
      <p><strong>Employment Status:</strong> {schemedetail["Employment Status"]}</p>
      <p><strong>Benefits:</strong> {schemedetail.Benefits}</p>
      <p><strong>Details:</strong> {schemedetail.Details}</p>
      <p><strong>Required Documents:</strong></p>
      <ul>
        {schemedetail.Documents.map((doc, index) => (
          <li key={index}>{doc}</li>
        ))}
      </ul>
    </div>
  );
};

export default SchemeDetail;
