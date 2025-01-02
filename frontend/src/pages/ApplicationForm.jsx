import React, { useState } from "react";
import '../styles/ApplicationForm.css';

const SchemeForm = () => {
  const [formData, setFormData] = useState({
    schemename: "",
    category: "",
    gender: "",
    age_range: "0",
    state: "Maharashtra",
    marital_status: "",
    income: "0",
    caste: [],
    documents: [],
    ministry: "",
    employment_status: "",
  });

  const [newCaste, setNewCaste] = useState("");
  const [newDocument, setNewDocument] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add items to the caste or documents list
  const handleAddCaste = () => {
    if (newCaste.trim()) {
      setFormData((prev) => ({
        ...prev,
        caste: [...prev.caste, newCaste.trim()],
      }));
      setNewCaste("");
    }
  };

  const handleAddDocument = () => {
    if (newDocument.trim()) {
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, newDocument.trim()],
      }));
      setNewDocument("");
    }
  };

  // Remove items from caste or documents list
  const handleRemoveCaste = (index) => {
    setFormData((prev) => ({
      ...prev,
      caste: prev.caste.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    alert("Form submitted successfully!");
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div>
        <label>Scheme Name:</label>
        <input
          type="text"
          name="schemename"
          value={formData.schemename}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Category:</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Gender:</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label>Age Range:</label>
        <input
          type="text"
          name="age_range"
          value={formData.age_range}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>State:</label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Marital Status:</label>
        <select
          name="marital_status"
          value={formData.marital_status}
          onChange={handleChange}
        >
          <option value="">Select Status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
        </select>
      </div>
      <div>
        <label>Income:</label>
        <input
          type="text"
          name="income"
          value={formData.income}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Caste:</label>
        <div>
          <input
            type="text"
            value={newCaste}
            onChange={(e) => setNewCaste(e.target.value)}
            placeholder="Add caste"
          />
          <button type="button" onClick={handleAddCaste}>Add</button>
        </div>
        <ul>
          {formData.caste.map((caste, index) => (
            <li key={index}>
              {caste} <button type="button" onClick={() => handleRemoveCaste(index)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <label>Documents:</label>
        <div>
          <input
            type="text"
            value={newDocument}
            onChange={(e) => setNewDocument(e.target.value)}
            placeholder="Add document"
          />
          <button type="button" onClick={handleAddDocument}>Add</button>
        </div>
        <ul>
          {formData.documents.map((doc, index) => (
            <li key={index}>
              {doc} <button type="button" onClick={() => handleRemoveDocument(index)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <label>Ministry:</label>
        <input
          type="text"
          name="ministry"
          value={formData.ministry}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Employment Status:</label>
        <input
          type="text"
          name="employment_status"
          value={formData.employment_status}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default SchemeForm;
