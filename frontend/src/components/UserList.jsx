import React, { useState, useEffect } from "react";
import "../styles/userList.css";

const UsersList = ({ adminEmail }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/admin/rani@gmail.com/users/`
        );
        const data = await response.json();
        if (response.ok) {
          setUsers(data.users);
        } else {
          setError(data.error || "Something went wrong.");
        }
      } catch (err) {
        setError("Failed to fetch users. Please try again later.");
      }
    };

    fetchUsers();
  }, [adminEmail]);

  const toggleDetails = (index) => {
    setUsers((prevUsers) =>
      prevUsers.map((user, i) =>
        i === index ? { ...user, showDetails: !user.showDetails } : user
      )
    );
  };

  return (
    <div className="users-list-container">
      <h1>Users Matching Admin's Pincode</h1>
      {error && <p className="error-message">{error}</p>}
      {users.length > 0 ? (
        <ul className="users-list">
          {users.map((user, index) => (
            <li key={user.id} className="user-item">
              <div className="user-summary">
                <p><strong>Name:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <button
                  className="details-button"
                  onClick={() => toggleDetails(index)}
                >
                  {user.showDetails ? "Hide Details" : "View Details"}
                </button>
              </div>
              {user.showDetails && (
                <div className="user-details">
                  <p><strong>Phone:</strong> {user.phone_number}</p>
                  <p><strong>Income:</strong> ₹{user.income}</p>
                  <p><strong>Age:</strong> {user.age}</p>
                  <p><strong>Pincode:</strong> {user.pincode}</p>
                  <p><strong>City:</strong> {user.city}</p>
                  <p><strong>District:</strong> {user.district}</p>
                  <p><strong>State:</strong> {user.state}</p>
                  <p><strong>Gender:</strong> {user.gender}</p>
                  <p><strong>Caste:</strong> {user.caste}</p>
                  <p><strong>Employment Status:</strong> {user.employment_status}</p>
                  <p><strong>Marital Status:</strong> {user.marital_status}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        !error && <p>No users found.</p>
      )}
    </div>
  );
};

export default UsersList;
