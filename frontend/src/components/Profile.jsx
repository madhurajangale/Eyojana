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
        <h1>Profile</h1>
        <div className={styles.profileDetails}>
          {Object.entries(userData).map(([key, value]) => (
            <div className={styles.profileField} key={key}>
              <label>{key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}:</label>
              {key === "gender" || key === "marital_status" ? (
                <select
                  name={key}
                  value={value}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  {key === "gender" && (
                    <>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </>
                  )}
                  {key === "marital_status" && (
                    <>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                    </>
                  )}
                </select>
              ) : (
                <input
                  type={
                    key === "email"
                      ? "email"
                      : key === "age" || key === "income"
                      ? "number"
                      : "text"
                  }
                  name={key}
                  value={value}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              )}
            </div>
          ))}
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
