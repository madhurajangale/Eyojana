import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";

export default function Recommendation() {
    const location = useLocation();
  const navigate = useNavigate();
  const [eligibleSchemes, setEligibleSchemes] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext); // Ensure `user` is correctly fetched from context
  // const [schemeName, setSchemename] = useState("");
  const { schemeName } = location.state || {};
  const fetchEligibility = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/recommend/eligibility-check/${user.email}/`
      );
      setEligibleSchemes(response.data.eligible_schemes);
    } catch (err) {
      setError("An unexpected error occurred: " + err.message);
    }
  };

  // const handleViewScheme = (schemename) => {
  //   console.log("heyyyyy")
  //   setSchemename(schemename);
  //   console.log("schemeName")
  //   console.log(schemeName)
  //   navigate("/scheme-details", { state: { schemeName } });
  // };
  const handleViewScheme = async (schemeName) => {
   
    navigate("/scheme-details", { state: { schemeName } });
 
};
  useEffect(() => {
    fetchEligibility();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          color: "#779307",
          marginBottom: "15px",
          marginTop: "5rem",
        }}
      >
        Recommended Schemes
      </h2>
      {error && (
        <p style={{ color: "red", fontWeight: "bold", marginBottom: "15px" }}>
          {error}
        </p>
      )}
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {eligibleSchemes.map((scheme, index) => (
          <li
            key={index}
            style={{
              marginBottom: "15px",
              padding: "15px",
              backgroundColor: "#e7f9ce",
              borderRadius: "8px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <strong style={{ fontSize: "19px" }}>{scheme.scheme_name}</strong>
            <p
              style={{
                color: "#555",
                fontSize: "14px",
                marginTop: "2rem",
              }}
            >
              Required Documents:{" "}
              <span style={{ color: "#555", fontWeight: "bold" }}>
                {scheme.documents}
              </span>
            </p>
            <button
              onClick={() => handleViewScheme(scheme.scheme_name)}
              className="btn btn-primary"
            >
              Apply
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
