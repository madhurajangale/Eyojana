import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/profile.module.css";
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { login, user } = useContext(AuthContext);
  const { selectedLang } = useLanguage();
  const [userData, setUserData] = useState({
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

  const translateTexts = async (language) => {
    // Add a small delay before translation to ensure userData is updated
    setTimeout(async () => {
      const textMap = {};
  
      // Map userData keys to the form fields and their current values
      Object.entries(userData).forEach(([key, value]) => {
        const inputKey = `input-${key}`;  // Format as 'input-age', 'input-caste', etc.
      const labelKey = `label-${key}`;  // Format as 'label-age', 'label-caste', etc.

      // Add the label and input keys to the textMap
      textMap[labelKey] = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      textMap[inputKey] = value;
      });
      textMap['profileTitle'] = "Profile";
    textMap['actionButton'] = isEditing ? "Save" : "Edit"; 
      console.log(textMap)
      const valuesArray = Object.keys(textMap)
      
      .map(key => textMap[key]); 
      if (language === "en") {
        // Revert to original text written in the code
        Object.keys(textMap).forEach((key) => {
          const element = document.querySelector(`[data-key="${key}"]`);
          if (element) {
            element.textContent = textMap[key]; // Use the `data-key` as the original English text
          }
        });
        return; // Exit the function for English
      }
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/translate/", {
          sentences: valuesArray,  // Send values for translation
          target_lang: language,
        });
        console.log(response);
        const translations = response.data.translated_sentences;
  
        // Replace original text content with the translated values
        Object.keys(textMap).forEach((key, index) => {
          const element = document.querySelector(`[data-key="${key}"]`);
          if (element) {
            // Check if it's an input element
            if (element.tagName === "INPUT" || element.tagName === "SELECT") {
              element.value = translations[index] || textMap[key]; // Update input or select value
            } else {
              element.textContent = translations[index] || textMap[key]; // Update label or other text elements
            }
          }
        });
      } catch (error) {
        console.error("Error translating texts:", error);
      }
    }, 500); // 500ms delay before calling translateTexts
  };
  
  
  

  useEffect(() => {
    // Translate after selectedLang or userData changes, with a delay
    translateTexts(selectedLang);
  }, [selectedLang, userData]); // Trigger translation when selectedLang or userData changes

  // Fetch user data on initial render
  useEffect(() => {
    console.log(user)
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (isEditing) {
      console.log("Updated userData:", userData); // Log updated userData for debugging
      try {
        const response = await axios.patch(`http://127.0.0.1:8000/api/profile/${user.email}/edit/`, userData);
        if (response.status === 200) {
          console.log("Profile updated successfully");
        } else {
          console.error("Failed to update profile");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
    setIsEditing(false); // Exit edit mode after saving
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileCard}>
        <h1 data-key="profileTitle" style={{ fontSize: '20px', color: '#779307'}}>Profile</h1>
        <div className={styles.profileDetails}>
          {Object.entries(userData).map(([key, value]) => (
            <div className={styles.profileField} key={key}>
              <label data-key={`label-${key}`}>
                {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}:
              </label>
              {key === "gender" || key === "marital_status" ? (
                <select
                  name={key}
                  value={value}
                  onChange={handleChange}
                  disabled={!isEditing}
                  data-key={`select-${key}`}
                >
                  {key === "gender" && (
                    <>
                      <option value="Male" data-key="genderMale">Male</option>
                      <option value="Female" data-key="genderFemale">Female</option>
                      <option value="Other" data-key="genderOther">Other</option>
                    </>
                  )}
                  {key === "marital_status" && (
                    <>
                      <option value="Single" data-key="statusSingle">Single</option>
                      <option value="Married" data-key="statusMarried">Married</option>
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
                  value={value} // Ensure the value is coming from userData state
                  onChange={handleChange}
                  disabled={!isEditing}
                  data-key={`input-${key}`} // Ensure the data-key matches the input name
                />
              )}
            </div>
          ))}
        </div>
        <button
          className={styles.actionButton}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          data-key="actionButton"
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
