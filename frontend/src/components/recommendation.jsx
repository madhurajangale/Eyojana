import React, { useState, useEffect ,useContext} from 'react';
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';
export default function Recommendation() {
  const [eligibleSchemes, setEligibleSchemes] = useState([]);
  const [error, setError] = useState(null);
 const { login, user } = useContext(AuthContext);
  const fetchEligibility = async () => {
    console.log("testing")
     // Replace with the actual user's email
    // const url = `http://localhost:8000/recommend/eligibility-check/${user.email}/`; // Adjust the URL as per your backend
    try {
    const response = await axios.get(`http://127.0.0.1:8000/recommend/eligibility-check/${user.email}/`);
    
      console.log(response)
      
        console.log("response")
        console.log(response)
       
        console.log(response.data.eligible_schemes)
        setEligibleSchemes(response.data.eligible_schemes);
        console.log(eligibleSchemes)
     
    } catch (err) {
      setError("An unexpected error occurred: " + err.message);
    }
  };

  useEffect(() => {
    fetchEligibility();
  }, []);

  return (
    <div>
      <h2>Recommended Schemes</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {eligibleSchemes.map((scheme, index) => (
          <li key={index}>
            <strong>{scheme.scheme_name}</strong>
            <p>Required Documents: {scheme.documents}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
