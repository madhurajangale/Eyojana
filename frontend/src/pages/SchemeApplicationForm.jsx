import React, { useState } from "react";
import axios from "axios";

const SchemeApplicationForm = () => {
  const [formData, setFormData] = useState({
    user_email: "",
    scheme_name: "",
    category: "",
  });

  const [documents, setDocuments] = useState([{ file: null, name: "" }]);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDocumentChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDocuments = [...documents];

    if (name === "file") {
      updatedDocuments[index].file = e.target.files[0];
    } else if (name === "name") {
      updatedDocuments[index].name = value;
    }

    setDocuments(updatedDocuments);
  };

  const handleAddDocument = () => {
    setDocuments([...documents, { file: null, name: "" }]);
  };

  const handleRemoveDocument = (index) => {
    const updatedDocuments = documents.filter((_, idx) => idx !== index);
    setDocuments(updatedDocuments);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formPayload = new FormData();
    formPayload.append("user_email", formData.user_email);
    formPayload.append("scheme_name", formData.scheme_name);
    formPayload.append("category", formData.category);

    // Append document names and files to the FormData
    documents.forEach((document, index) => {
      if (document.file) {
        formPayload.append(`documents[${index}][name]`, document.name);
        formPayload.append(`documents[${index}][file]`, document.file);
      }
    });

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/applications/", formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      
      });
      
      setMessage("Application submitted successfully!");
    } catch (error) {
      setMessage("Failed to submit application. Please try again.");
      console.error(error);
      
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Apply for Scheme</h1>
      {message && (
        <div
          className={`alert ${message.includes("successfully") ? "alert-success" : "alert-danger"}`}
          role="alert"
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="card p-4 shadow-sm">
        <div className="mb-3">
          <label htmlFor="user_email" className="form-label">Email</label>
          <input
            type="email"
            id="user_email"
            name="user_email"
            value={formData.user_email}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="scheme_name" className="form-label">Scheme Name</label>
          <input
            type="text"
            id="scheme_name"
            name="scheme_name"
            value={formData.scheme_name}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>

        {/* Documents Section */}
        <div className="mb-3">
          <label htmlFor="documents" className="form-label">Upload Documents</label>
          {documents.map((document, index) => (
            <div key={index} className="d-flex justify-content-between mb-3">
              <div className="w-75">
                <input
                  type="file"
                  id={`documents_${index}`}
                  name="file"
                  onChange={(e) => handleDocumentChange(index, e)}
                  className="form-control"
                />
              </div>
              <div className="w-75">
                <input
                  type="text"
                  placeholder="Document Name"
                  name="name"
                  value={document.name}
                  onChange={(e) => handleDocumentChange(index, e)}
                  className="form-control mt-2"
                  required
                />
              </div>
              <button
                type="button"
                className="btn btn-danger mt-2 ms-2"
                onClick={() => handleRemoveDocument(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddDocument}
            className="btn btn-secondary"
          >
            Add Another Document
          </button>
        </div>

        <button type="submit" className="btn btn-primary w-100 mt-3">Submit Application</button>
      </form>
    </div>
  );
};

export default SchemeApplicationForm;
