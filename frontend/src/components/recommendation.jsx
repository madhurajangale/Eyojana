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
    <div style={{ padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
  <h2 style={{ fontSize: '24px', color: '#779307', marginBottom: '15px', marginTop: '5rem' }}>Recommended Schemes</h2>
  {error && <p style={{ color: 'red', fontWeight: 'bold', marginBottom: '15px' }}>{error}</p>}
  <ul style={{ listStyleType: 'none', padding: 0 }}>
    {eligibleSchemes.map((scheme, index) => (
      <li key={index} style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#e7f9ce', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
        <strong style={{ fontSize: '19px' }}>{scheme.scheme_name}</strong>
        <p style={{ color: '#555', fontSize: '14px', marginTop:'2rem' }}>Required Documents: <span style={{ color: '#555', fontWeight: 'bold' }}>{scheme.documents}</span></p>
      </li>
    ))}
  </ul>
</div>

  );
}
