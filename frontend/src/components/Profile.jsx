import React, { useState ,useEffect} from "react";
import styles from "../styles/profile.module.css";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
const { login ,user} = useContext(AuthContext);
const [editMode, setEditMode] = useState(false);
const [edituser, setUser] = useState({
 age: 1,
 caste: "",
 city: "",
 district: "",
 email: "",
 employment_status: "",
 gender: "",
 income: 0,
 marital_status: "",
 phone_number: "",
 pincode: "",
 state: "",
 username: "",
});
console.log(user.email)
  // Placeholder for user data (Replace with actual data when available)
  const [userData, setUserData] = useState({
    age: 0,
    caste: "",
    city: "",
    district: "",
    email: "",
    employment_status: "",
    gender: "",
    income: 0,
    marital_status: "",
    phone_number: "",
    pincode: "",
    state: "",
    username: "",
  });
  useEffect(() => {
    if (user) {
      console.log("User state updated:", userData);
    }
  }, [userData]);
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/profile/${user.email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log("all")
        console.log(data)
        if (response.ok) {
          setUserData({
            age: data.data.age,
      city: data.data.city,
      district: data.data.district,
      email: data.data.email,
      caste: data.data.caste,
      employment_status: data.data.employment_status,
      gender: data.data.gender,
      income: data.data.income,
      marital_status: data.data.marital_status,
      phone_number: data.data.phone_number,
      pincode: data.data.pincode,
      state: data.data.state,
      username: data.data.username,
          });
          console.log("userdata")
          console.log(userData)
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user.id]);
  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Handle save action
  const handleSave = async () => {
    if (isEditing) {
      console.log("))))))))))")
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/profile/${user.email}/edit/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData), // Send the updated user data
        });
        console.log("done")
        console.log(userData)
        if (response.ok) {
          console.log('Profile updated successfully');
        } else {
          console.error('Failed to update profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
    setEditMode(false); // Turn off edit mode after saving
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
