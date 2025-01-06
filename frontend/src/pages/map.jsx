import React,{useState,useEffect,useContext} from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AuthContext } from "../context/AuthContext";
const IndiaMap = () => {
  // Sample data: Pincodes with lat, lon, and user count
  const pincodesData = [
    { pincode: '110001', lat: 28.6334, lon: 77.2167, users: 150 },
    { pincode: '400001', lat: 18.9396, lon: 72.8363, users: 200 },
    { pincode: '600001', lat: 13.0878, lon: 80.2785, users: 250 }
  ];
    const { login, user } = useContext(AuthContext);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/profile/${user.email}`);
        if (response.status === 200) {
          setUserData(response.data.data); // Populate userData state
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user.email]);
  return (
    <div style={{ height: '600px', width: '100%' }}>
      <MapContainer
        center={[20.5937, 78.9629]}  // Coordinates for India
        zoom={5}  // Adjust zoom level
        style={{ width: '100%', height: '100%' }}
        maxZoom={10}
        minZoom={5}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {pincodesData.map((pincode, index) => (
          <Marker
            key={index}
            position={[pincode.lat, pincode.lon]}
            icon={new L.Icon({ iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png' })}
          >
            <Popup>
              <strong>Pincode:</strong> {pincode.pincode}<br />
              <strong>Users:</strong> {pincode.users}
            </Popup>
            <Tooltip>{`Users: ${pincode.users}`}</Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default IndiaMap;
