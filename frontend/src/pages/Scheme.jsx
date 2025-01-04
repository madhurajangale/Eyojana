import React from "react";
import schemesData from "../dataset/dataset_final.json";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const SchemeList = () => {
    const location = useLocation();
    const navigate=useNavigate();
    const { category } = location.state || {}; // Extract category from state
  
    console.log(category);
  // Filter schemes based on the passed category
  const filteredSchemes = schemesData.filter(
    (scheme) => scheme.Category.toLowerCase() === category.toLowerCase()
  );
const handleViewScheme=(schemeName)=>{
    navigate('/scheme-details', { state: { schemeName } });
}
  return (
    <div>
      <h1>Available Schemes</h1>
      {filteredSchemes.length > 0 ? (
        filteredSchemes.map((scheme, index) => (
          <div key={index} style={schemeCardStyle}>
            <h2>{scheme["Scheme Name"]}</h2>
            <button onClick={()=>{handleViewScheme(scheme["Scheme Name"])}}>View</button>
          </div>
        ))
      ) : (
        <p>No schemes found for the selected category.</p>
      )}
    </div>
  );
};

const schemeCardStyle = {
  border: "1px solid #ccc",
  borderRadius: "5px",
  padding: "10px",
  margin: "10px 0",
  backgroundColor: "#f9f9f9",
};

export default SchemeList;
