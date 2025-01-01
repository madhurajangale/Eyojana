import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/signup.module.css"; 
import signup from "../images/signup.png";

const UserSignUp = () => {
  const [step, setStep] = useState(1); // Tracks the current step
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
    age: "",
    gender: "",
    caste: "general",
    marital_status: "unmarried",
    employment_status: "unemployed",
    income: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    setErrorMessage("");
    if (step < 4) setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setErrorMessage("");
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    // Add API submission logic here

    navigate("/thank-you");
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.signupCard}>
        {/* Left Section */}
        <div className={styles.signupLeft}>
          <h2>Welcome!</h2>
          <p>Join us and explore amazing opportunities.</p>
          <img src={signup} alt="Sign-Up" style={{ maxWidth: "300px", marginBottom: "20px" }} />
        </div>
        {/* Right Section */}
        <div className={styles.signupRight}>
          <h2>Create Account</h2>
          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            {step === 1 && (
              <div className={styles.formColumn}>
                <div>
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone_number">Phone</label>
                  <input
                    type="text"
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className={styles.formColumn}>
                <div>
                  <label htmlFor="age">Age</label>
                  <input
                    type="number"
                    id="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className={styles.formColumn}>
                <div>
                  <label htmlFor="caste">Caste</label>
                  <select
                    id="caste"
                    value={formData.caste}
                    onChange={handleChange}
                    required
                  >
                    <option value="general">General</option>
                    <option value="sc">SC</option>
                    <option value="st">ST</option>
                    <option value="obc">OBC</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="marital_status">Marital Status</label>
                  <select
                    id="marital_status"
                    value={formData.marital_status}
                    onChange={handleChange}
                    required
                  >
                    <option value="unmarried">Unmarried</option>
                    <option value="married">Married</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="employment_status">Employment Status</label>
                  <select
                    id="employment_status"
                    value={formData.employment_status}
                    onChange={handleChange}
                    required
                  >
                    <option value="unemployed">Unemployed</option>
                    <option value="employed">Employed</option>
                    <option value="student">Student</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="income">Income</label>
                  <input
                    type="number"
                    id="income"
                    value={formData.income}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div className={styles.formColumn}>
                <div>
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="district">District</label>
                  <input
                    type="text"
                    id="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="pincode">Pincode</label>
                  <input
                    type="number"
                    id="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className={styles.buttonGroup}>
              {step > 1 && (
                <button type="button" onClick={handleBack} className={styles.backButton}>
                  Back
                </button>
              )}
              {step < 4 ? (
                <button type="button" onClick={handleNext} className={styles.nextButton}>
                  Next
                </button>
              ) : (
                <button type="submit" className={styles.nextButton}>
                  Submit
                </button>
              )}
            </div>
          </form>
          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default UserSignUp;
