import React, { useState } from "react";
import styles from "../styles/profile.module.css";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Placeholder for user data (Replace with actual data when available)
  const [userData, setUserData] = useState({
    username: "john_doe",
    email: "john.doe@example.com",
    phone_number: "9876543210",
    age: 25,
    gender: "Male",
    caste: "General",
    marital_status: "Single",
    employment_status: "Employed",
    income: 50000,
    city: "New York",
    district: "Manhattan",
    state: "New York",
    pincode: "10001",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Handle save action
  const handleSave = () => {
    setIsEditing(false);
    console.log("Saved Data:", userData);
    alert("Profile updated successfully!");
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileCard}>
        <h2>Profile</h2>
        <div className={styles.profileDetails}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label>Phone:</label>
            <input
              type="text"
              name="phone_number"
              value={userData.phone_number}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={userData.age}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label>Gender:</label>
            <select
              name="gender"
              value={userData.gender}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label>Caste:</label>
            <input
              type="text"
              name="caste"
              value={userData.caste}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label>Marital Status:</label>
            <select
              name="marital_status"
              value={userData.marital_status}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="Single">Single</option>
              <option value="Married">Married</option>
            </select>
          </div>
          <div>
            <label>Employment Status:</label>
            <input
              type="text"
              name="employment_status"
              value={userData.employment_status}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label>Income:</label>
            <input
              type="number"
              name="income"
              value={userData.income}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label>City:</label>
            <input
              type="text"
              name="city"
              value={userData.city}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label>District:</label>
            <input
              type="text"
              name="district"
              value={userData.district}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label>State:</label>
            <input
              type="text"
              name="state"
              value={userData.state}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label>Pincode:</label>
            <input
              type="text"
              name="pincode"
              value={userData.pincode}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
        <button
          className={styles.actionButton}
          onClick={isEditing ? handleSave : toggleEditMode}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
