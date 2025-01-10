import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const GraphComponent = () => {
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [pincodeData, setPincodeData] = useState([]);

  // API Endpoints
  const API_URLS = {
    state: "http://127.0.0.1:8000/api/user_count_by_state/",
    city: "http://127.0.0.1:8000/api/user_count_by_city/",
    pincode: "http://127.0.0.1:8000/api/user_count_by_pincode/",
  };

  useEffect(() => {
    // Fetch data for states
    axios.get(API_URLS.state)
      .then((response) => setStateData(response.data.states || []))
      .catch((error) => console.error("Error fetching state data:", error));

    // Fetch data for cities
    axios.get(API_URLS.city)
      .then((response) => {
        console.log("City Data Response:", response.data);
        setCityData(response.data.cities || []);  // Ensure the data is set correctly
      })
      .catch((error) => console.error("Error fetching city data:", error));

    // Fetch data for pincodes
    axios.get(API_URLS.pincode)
      .then((response) => setPincodeData(response.data.pincodes || []))
      .catch((error) => console.error("Error fetching pincode data:", error));
  }, []);

  // Prepare data for charts
  const stateLabels = Array.isArray(stateData) ? stateData.map((item) => item.state || "Unknown") : [];
  const stateCounts = Array.isArray(stateData) ? stateData.map((item) => item.user_count) : [];

  const cityLabels = Array.isArray(cityData) ? cityData.map((item) => item.city || "Unknown") : [];
  const cityCounts = Array.isArray(cityData) ? cityData.map((item) => item.user_count) : [];

  const pincodeLabels = Array.isArray(pincodeData) ? pincodeData.map((item) => item.pincode || "Unknown") : [];
  const pincodeCounts = Array.isArray(pincodeData) ? pincodeData.map((item) => item.user_count) : [];

  return (
    <div style={{ textAlign: "center", padding: "20px"}} >
      <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#779307' }}>Graphical Representation</h1>

      {/* Bar Chart for States */}
      <h2 style={{ fontSize: '20px', fontWeight: 'semi-bold' }}>Users by State</h2>
      <div style={{ maxWidth: "800px", margin: "0 auto" , marginBottom:"50px", padding: "50px", boxShadow: "2px 4px 8px rgba(0, 0, 0, 0.1)"}}>
        <Bar
          data={{
            labels: stateLabels,
            datasets: [
              {
                label: "Users",
                data: stateCounts,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
              },
            ],
          }}
          options={{ responsive: true, maintainAspectRatio: false }}
          height={400} // Smaller height
          width={500}  // Smaller width
        />
      </div>

      {/* Pie Chart for Cities */}
      <h2 style={{ fontSize: '20px', fontWeight: 'semi-bold' }}>Users by State</h2>
      <div style={{ maxWidth: "800px", margin: "0 auto" ,marginBottom:"50px", padding: "50px", boxShadow: "2px 4px 8px rgba(0, 0, 0, 0.1)"}}>
        <Pie
          data={{
            labels: cityLabels,
            datasets: [
              {
                label: "Users",
                data: cityCounts,
                backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#4BC0C0",
                  "#9966FF",
                  "#FF9F40",
                ],
              },
            ],
          }}
          options={{ responsive: true, maintainAspectRatio: false }}
          height={300} // Smaller height
          width={400}  // Smaller width
        />
      </div>

      {/* Bar Chart for Pincodes */}
      <h2 style={{ fontSize: '20px', fontWeight: 'semi-bold' }}>Users by Pincode</h2>
      <div style={{ maxWidth: "800px", margin: "0 auto" , marginBottom:"50px", padding: "50px", boxShadow: "2px 4px 8px rgba(0, 0, 0, 0.1)"}}>
        <Bar
          data={{
            labels: pincodeLabels,
            datasets: [
              {
                label: "Users",
                data: pincodeCounts,
                backgroundColor: "rgba(153, 102, 255, 0.6)",
              },
            ],
          }}
          options={{ responsive: true, maintainAspectRatio: false }}
          height={400} // Smaller height
          width={600}  // Smaller width
        />
      </div>
    </div>
  );
};

export default GraphComponent;
