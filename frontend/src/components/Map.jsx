import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const IndiaMap = () => {
  const [geoData, setGeoData] = useState(null);

  // Fetch GeoJSON data for India
  useEffect(() => {
    fetch("http://localhost:6000/usermap") // Replace with the actual path
      .then((response) => response.json())
      .then((data) => setGeoData(data));
  }, []);

  // Styling for the GeoJSON layers
  const geoJsonStyle = {
    color: "#4a83ec", // Border color
    weight: 2,
    fillColor: "#1a1d62", // Fill color
    fillOpacity: 0.5,
  };

  // Highlight interaction
  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillColor: "#ffcc00",
          fillOpacity: 0.7,
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(geoJsonStyle);
      },
      click: (e) => {
        alert(`Pincode: ${feature.properties.pincode}\nUsers: ${feature.properties.user_count}`);
      },
    });
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MapContainer center={[22.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {geoData && (
          <GeoJSON
            data={geoData}
            style={geoJsonStyle}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default IndiaMap;
