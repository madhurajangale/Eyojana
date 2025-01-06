import React, { useState } from 'react';
import axios from 'axios';

const PincodeUserCount = () => {
  const [pincode, setPincode] = useState('');
  const [userCount, setUserCount] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUserCount(null);

    if (!pincode) {
      setError('Pincode is required');
      return;
    }

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/get_user_count/', {
        params: { pincode },  // This will append ?pincode=410206 to the URL
      });
      
      setUserCount(response.data.user_count);
    } catch (err) {
      console.error('Error fetching data', err);
      if (err.response) {
        setError(err.response.data.error || 'Failed to fetch user count');
      } else if (err.request) {
        setError('No response from server');
      } else {
        setError('Error fetching data');
      }
    }
  };

  return (
    <div>
      <h2>User Count by Pincode</h2>
      <h2>User Count by Pincode</h2>
      <h2>User Count by Pincode</h2>
      <h2>User Count by Pincode</h2>
      <h2>User Count by Pincode</h2>
      <h2>User Count by Pincode</h2>
      <h2>User Count by Pincode</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Enter Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />
        <button type="submit">Get User Count</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {userCount !== null && (
        <p>
          Total users in pincode {pincode}: {userCount}
        </p>
      )}
    </div>
  );
};

export default PincodeUserCount;
