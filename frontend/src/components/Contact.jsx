import React, { useState } from "react";
import "../styles/contact.css"; // Import the CSS file

const ContactUsForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    supportOption: "", // 'call' or 'chat'
    phone: "", // Phone number for call
    whatsapp: "", // WhatsApp number for chat
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address.";
    if (!formData.message) newErrors.message = "Message is required.";
    if (!formData.supportOption) newErrors.supportOption = "Support option is required.";
    
    // Validate phone number if 'call' option is selected
    if (formData.supportOption === "call" && !formData.phone) {
      newErrors.phone = "Phone number is required for call support.";
    }

    // Validate WhatsApp number if 'chat' option is selected
    if (formData.supportOption === "chat" && !formData.whatsapp) {
      newErrors.whatsapp = "WhatsApp number is required for chat support.";
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    // Only include the relevant phone or whatsapp number based on the support option
    const requestData = {
      ...formData,
      phone: formData.supportOption === "call" ? formData.phone : undefined,
      whatsapp: formData.supportOption === "chat" ? formData.whatsapp : undefined,
    };

    fetch("http://localhost:5001/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          setSuccess("Your message for personalized support has been sent successfully! You will be contacted shortly.");
          setFormData({ name: "", email: "", message: "", supportOption: "", phone: "", whatsapp: "" });
        } else {
          setSuccess("Failed to send the message. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setSuccess("An error occurred. Please try again.");
      });
  };

  return (
    <div className="contact-form-container">
      <h1>Get Support from Agent</h1>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="input-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input"
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input"
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="input-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="textarea"
          />
          {errors.message && <p className="error">{errors.message}</p>}
        </div>
        
        {/* Support Option - Call or Chat */}
        <div className="input-group">
          <label>How would you like to get support?</label>
          <div>
            <label className="radio-label">
              <input
                type="radio"
                name="supportOption"
                value="chat"
                checked={formData.supportOption === "chat"}
                onChange={handleChange}
              />
              Chat with an agent
            </label>
            <label>
              <input
                type="radio"
                name="supportOption"
                value="call"
                checked={formData.supportOption === "call"}
                onChange={handleChange}
              />
              Call me for support
            </label>
          </div>
          {errors.supportOption && <p className="error">{errors.supportOption}</p>}
        </div>

        {/* Phone number field (only show if 'call' is selected) */}
        {formData.supportOption === "call" && (
          <div className="input-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input"
            />
            {errors.phone && <p className="error">{errors.phone}</p>}
          </div>
        )}

        {/* WhatsApp number field (only show if 'chat' is selected) */}
        {formData.supportOption === "chat" && (
          <div className="input-group">
            <label htmlFor="whatsapp">WhatsApp Number</label>
            <input
              type="text"
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className="input"
            />
            {errors.whatsapp && <p className="error">{errors.whatsapp}</p>}
          </div>
        )}
        
        <button type="submit" className="submit-button">
          Submit
        </button>
        {success && <p className="success">{success}</p>}
      </form>
    </div>
  );
};

export default ContactUsForm;
