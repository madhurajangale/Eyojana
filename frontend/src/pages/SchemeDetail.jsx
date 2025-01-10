import React, { useState, useEffect,useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/SchemeDetail.css";
import { useLanguage } from "../context/LanguageContext";
import { AuthContext } from "../context/AuthContext";
const SchemeDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedLang } = useLanguage();
  const { schemeName } = location.state || {};
  const { login, user } = useContext(AuthContext);
  const [schemeDetail, setSchemeDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("scheme")
    console.log(schemeName)
    const fetchSchemeDetail = async () => {
      try {
        setLoading(true);
        console.log(schemeName);
        const response = await axios.get(`http://127.0.0.1:8000/api/scheme/${schemeName}/`);
        setSchemeDetail(response.data.scheme);
      } catch (err) {
        setError("Failed to fetch scheme details.");
        console.error("Error fetching scheme details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemeDetail();
  }, [schemeName]);

  const handleViewDetail = async() => {
    
      try{
        console.log("reached")
        const response=await axios.get(`http://127.0.0.1:8000/recommend/scheme/${user.email}/${schemeDetail.schemename}/`);
        console.log(response)
        console.log(response.data.is_eligible)
        if(response.data.is_eligible ){
          const { schemename: scheme, category } = schemeDetail;
          navigate("/schemeform", { state: { scheme, category } });
        }
        else{
          window.alert(`${response.data.message}`);
        }
        }
        catch(err){
          setError("An unexpected error occurred: " + err.message);
        }
      
  };

  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  if (error || !schemeDetail) {
    return <div className="error-message">{error || "Scheme not found"}</div>;
  }

  return (
    <div className="scheme-detail-container">
      <div className="scheme-header">
        <h1 className="scheme-title" data-key="scheme-name">{schemeDetail.schemename}</h1>
        <p className="scheme-category" data-key="scheme-category">{schemeDetail.category}</p>
      </div>

      <div className="scheme-info">
        <div className="info-section">
          <p data-key="gender"><strong>Gender:</strong> {schemeDetail.gender}</p>
          <p data-key="age-range"><strong>Age Range:</strong> {schemeDetail.age_range}</p>
        </div>
        <div className="info-section">
          <p data-key="marital-status"><strong>Marital Status:</strong> {schemeDetail.marital_status}</p>
          <p data-key="income"><strong>Income:</strong> {schemeDetail.income}</p>
          <p data-key="caste"><strong>Caste:</strong> {schemeDetail.caste.join(", ")}</p>
        </div>
        <div className="info-section">
          <p data-key="ministry"><strong>Ministry:</strong> {schemeDetail.ministry}</p>
          <p data-key="employment-status"><strong>Employment Status:</strong> {schemeDetail.employment_status}</p>
        </div>
      </div>

      <div className="scheme-benefits">
        <h3 data-key="benefits-header">Benefits</h3>
        <p data-key="benefits">{schemeDetail.benefits}</p>
      </div>

      <div className="scheme-details">
        <h3 data-key="details-header">Details</h3>
        <p data-key="details">{schemeDetail.details}</p>
      </div>

      <div className="scheme-documents">
        <h3 data-key="documents-header">Required Documents</h3>
        <ul>
          {schemeDetail.documents.map((doc, index) => (
            <li key={index} data-key={`document-${index}`} style={{ fontSize: '16px'}}>{doc}</li>
          ))}
        </ul>
      </div>

      <div>
        <button onClick={handleViewDetail} className="applybtn" data-key="apply-now">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default SchemeDetail;
