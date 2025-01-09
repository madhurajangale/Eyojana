import React, { useState, useEffect, useContext } from "react";
import "../styles/Scheme.css";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from '../context/LanguageContext';
import { AuthContext } from "../context/AuthContext";

const SchemeList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedLang } = useLanguage();
  const { category } = location.state || {};
  const { user } = useContext(AuthContext);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://127.0.0.1:8000/api/schemes/", {
          params: { category },
        });
        setSchemes(response.data.schemes || []);
      } catch (err) {
        setError("Failed to fetch schemes.");
        console.error("Error fetching schemes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, [category]);

  const handleViewScheme = async (schemeName) => {
    try {
      await axios.post("http://127.0.0.1:8000/recommend/update-rating/", {
        user: user.email,
        scheme: schemeName,
        rating: 0,
      });
      navigate("/scheme-details", { state: { schemeName } });
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  return (
    <div className="scheme-list-container">
      <h1 className="title" data-key="availableSchemesTitle">Available Schemes</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : schemes.length > 0 ? (
        schemes.map((scheme, index) => (
          <div key={index} className="scheme-card">
            <h2 className="scheme-name" data-key={`schemeName-${index}`}>{scheme.schemename}</h2>
            <button
              className="view-button"
              onClick={() => handleViewScheme(scheme.schemename)}
              data-key={`viewButton-${index}`}
            >
              View
            </button>
          </div>
        ))
      ) : (
        <p className="no-schemes-message" data-key="noSchemesMessage">
          No schemes found for the selected category.
        </p>
      )}
    </div>
  );
};

export default SchemeList;

