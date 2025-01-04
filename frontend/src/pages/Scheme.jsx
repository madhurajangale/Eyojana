import React from "react";
import schemesData from "../dataset/dataset_final.json";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Scheme.css"; // Import the CSS file

const SchemeList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category } = location.state || {}; // Extract category from state
  
  // Filter schemes based on the passed category
  const filteredSchemes = schemesData.filter(
    (scheme) => scheme.Category.toLowerCase() === category.toLowerCase()
  );

  const handleViewScheme = (schemeName) => {
    navigate('/scheme-details', { state: { schemeName } });
  };

  return (
    <div className="scheme-list-container">
      <h1 className="title">Available Schemes</h1>
      {filteredSchemes.length > 0 ? (
        filteredSchemes.map((scheme, index) => (
          <div key={index} className="scheme-card">
            <h2 className="scheme-name">{scheme["Scheme Name"]}</h2>
            <button className="view-button" onClick={() => handleViewScheme(scheme["Scheme Name"])}>View</button>
          </div>
        ))
      ) : (
        <p className="no-schemes-message">No schemes found for the selected category.</p>
      )}
    </div>
  );
};

export default SchemeList;
