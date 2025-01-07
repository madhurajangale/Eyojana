// import React, { useState } from "react";
// import axios from "axios";

// const SchemeApplicationForm = () => {
//   const [formData, setFormData] = useState({
//     user_email: "",
//     scheme_name: "",
//     category: "",
//   });

//   const [documents, setDocuments] = useState([{ file: null, name: "" }]);
//   const [message, setMessage] = useState("");

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleDocumentChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedDocuments = [...documents];

//     if (name === "file") {
//       updatedDocuments[index].file = e.target.files[0];
//     } else if (name === "name") {
//       updatedDocuments[index].name = value;
//     }

//     setDocuments(updatedDocuments);
//   };

//   const handleAddDocument = () => {
//     setDocuments([...documents, { file: null, name: "" }]);
//   };

//   const handleRemoveDocument = (index) => {
//     const updatedDocuments = documents.filter((_, idx) => idx !== index);
//     setDocuments(updatedDocuments);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formPayload = new FormData();
//     formPayload.append("user_email", formData.user_email);
//     formPayload.append("scheme_name", formData.scheme_name);
//     formPayload.append("category", formData.category);

//     // Append document names and files to the FormData
//     documents.forEach((document, index) => {
//       if (document.file) {
//         formPayload.append(`documents[${index}][name]`, document.name);
//         formPayload.append(`documents[${index}][file]`, document.file);
//       }
//     });

//     try {
//       const response = await axios.post("http://127.0.0.1:8000/api/applications/", formPayload, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
      
//       });
      
//       setMessage("Application submitted successfully!");
//     } catch (error) {
//       setMessage("Failed to submit application. Please try again.");
//       console.error(error);
      
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h1 className="mb-4 text-center">Apply for Scheme</h1>
//       {message && (
//         <div
//           className={`alert ${message.includes("successfully") ? "alert-success" : "alert-danger"}`}
//           role="alert"
//         >
//           {message}
//         </div>
//       )}
//       <form onSubmit={handleSubmit} encType="multipart/form-data" className="card p-4 shadow-sm">
//         <div className="mb-3">
//           <label htmlFor="user_email" className="form-label">Email</label>
//           <input
//             type="email"
//             id="user_email"
//             name="user_email"
//             value={formData.user_email}
//             onChange={handleInputChange}
//             className="form-control"
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="scheme_name" className="form-label">Scheme Name</label>
//           <input
//             type="text"
//             id="scheme_name"
//             name="scheme_name"
//             value={formData.scheme_name}
//             onChange={handleInputChange}
//             className="form-control"
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="category" className="form-label">Category</label>
//           <input
//             type="text"
//             id="category"
//             name="category"
//             value={formData.category}
//             onChange={handleInputChange}
//             className="form-control"
//             required
//           />
//         </div>

//         {/* Documents Section */}
//         <div className="mb-3">
//           <label htmlFor="documents" className="form-label">Upload Documents</label>
//           {documents.map((document, index) => (
//             <div key={index} className="d-flex justify-content-between mb-3">
//               <div className="w-75">
//                 <input
//                   type="file"
//                   id={`documents_${index}`}
//                   name="file"
//                   onChange={(e) => handleDocumentChange(index, e)}
//                   className="form-control"
//                 />
//               </div>
//               <div className="w-75">
//                 <input
//                   type="text"
//                   placeholder="Document Name"
//                   name="name"
//                   value={document.name}
//                   onChange={(e) => handleDocumentChange(index, e)}
//                   className="form-control mt-2"
//                   required
//                 />
//               </div>
//               <button
//                 type="button"
//                 className="btn btn-danger mt-2 ms-2"
//                 onClick={() => handleRemoveDocument(index)}
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={handleAddDocument}
//             className="btn btn-secondary"
//           >
//             Add Another Document
//           </button>
//         </div>

//         <button type="submit" className="btn btn-primary w-100 mt-3">Submit Application</button>
//       </form>
//     </div>
//   );
// };

// export default SchemeApplicationForm;



import React, { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/applicationForm.module.css";
import formImage from "../images/signup.png";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
const SchemeApplicationForm = () => {
  const [step, setStep] = useState(1); // Tracks the current step
  const {login, user} = useContext(AuthContext);
  const [formData, setFormData] = useState({
    user_email: "",
    scheme_name: "",
    category: "",
    documents: [{ file: null, name: "" }],
    income: "",
    age: "",
    gender: "",
    caste: "general",
    employment_status: "unemployed",
    marital_status: "unmarried",
    city: "",
    district: "",
    state: "",
    pincode: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
// ----------------------------------------------------------------------------------------------------------------
const handleDocumentChange = (index, e) => {
    const { name, value, files } = e.target;
    const updatedDocuments = [...formData.documents];
  
    if (name === "file") {
      // Update file in the document
      updatedDocuments[index].file = files[0];
      // After file is uploaded, call the verification API
      verifyDocument(files[0], updatedDocuments[index].name);

    } else if (name === "name") {
      // Update document name
      updatedDocuments[index].name = value;
    } 
  
    // Update the state to reflect the changes
    setFormData({ ...formData, documents: updatedDocuments });
  };
  
  // Function to call the backend API for document verification
  const verifyDocument = async (file, docName, docType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('docName', docName);
    // formData.append('docType', docType);

    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
  
    try {
      const response = await fetch('http://localhost:5500/upload-documents', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log(result);
      if (result.success) {
        alert('Document verified successfully!');
      } else {
        alert('Document verification failed!');
      }
    } catch (error) {
      console.error('Error verifying document:', error);
      alert('An error occurred during verification!');
    }
  };
  


// ------------------------------------------------------------------------------------------------------------------

  const handleAddDocument = () => {
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, { file: null, name: "" }],
    }));
  };

  const handleRemoveDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, idx) => idx !== index),
    }));
  };

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formPayload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "documents") {
          formData.documents.forEach((doc, index) => {
            if (doc.file) {
              formPayload.append(`documents[${index}][file]`, doc.file);
              formPayload.append(`documents[${index}][name]`, doc.name);
            }
          });
        } else {
          formPayload.append(key, formData[key]);
        }
      });

      const response = await fetch("http://127.0.0.1:8000/api/applications/", {
        method: "POST",
        body: formPayload,
      });

      if (response.ok) {
        setMessage("Application submitted successfully!");
        setTimeout(() => navigate("/thank-you"), 3000);
      } else {
        setMessage("Failed to submit the application. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while submitting the application.");
    }
    email()
  };
  const email = () => {
    const email = "user@example.com"; // Replace with dynamic email
    const taskTitle = "Sample Task"; // Replace with dynamic task title

    fetch('/send_email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: user.email,
            schemename: "abc",
        }),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to send email');
        })
        .then((data) => {
            alert(data.message); // Success message
        })
        .catch((error) => {
            console.error(error);
            alert('Error sending email');
        });
};

  return (
    <div className={styles.applicationPage}>
      <div className={styles.applicationCard}>
        {/* Left Section */}
        <div className={styles.leftSection}>
          <h2>Apply for Scheme</h2>
          <p>Fill out the form step by step to complete your application.</p>
          <img src={formImage} alt="Form" style={{ maxWidth: "300px", marginBottom: "20px" }} />
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className={styles.formColumn}>
                <label>Email</label>
                <input type="email" id="user_email" value={formData.user_email} onChange={handleChange} required />
                <label>Scheme Name</label>
                <input type="text" id="scheme_name" value={formData.scheme_name} onChange={handleChange} required />
                <label>Category</label>
                <input type="text" id="category" value={formData.category} onChange={handleChange} required />
              </div>
            )}

            {/* Step 2: Documents */}
            {step === 2 && (
              <div className={styles.formColumn}>
                <label>Documents</label>
                {formData.documents.map((doc, index) => (
                  <div key={index} className={styles.documentRow}>
                    <input
                      type="file"
                      name="file"
                      onChange={(e) => handleDocumentChange(index, e)}
                      required
                    />
                    <select
                      name="name"
                      value={doc.name}
                      onChange={(e) => handleDocumentChange(index, e)}
                      required
                    >
                      <option value="" disabled>Select Document Type</option>
                      <option value="Aadhaar">Aadhaar</option>
                      <option value="PAN">PAN</option>
                      <option value="Driving License">Driving License</option>
                      <option value="Voter ID">Voter ID</option>
                    </select>

                    <button type="button" onClick={() => handleRemoveDocument(index)}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={handleAddDocument}>
                  Add Another Document
                </button>
              </div>
            )}

            {/* Step 3: Personal Details */}
            {step === 3 && (
              <div className={styles.formColumn}>
                <label>Age</label>
                <input type="number" id="age" value={formData.age} onChange={handleChange} required />
                <label>Gender</label>
                <select id="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}

            {/* Step 4: Address */}
            {step === 4 && (
              <div className={styles.formColumn}>
                <label>City</label>
                <input type="text" id="city" value={formData.city} onChange={handleChange} required />
                <label>District</label>
                <input type="text" id="district" value={formData.district} onChange={handleChange} required />
                <label>State</label>
                <input type="text" id="state" value={formData.state} onChange={handleChange} required />
                <label>Pincode</label>
                <input type="number" id="pincode" value={formData.pincode} onChange={handleChange} required />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className={styles.buttonGroup}>
              {step > 1 && <button type="button" onClick={handleBack}>Back</button>}
              {step < 4 ? (
                <button type="button" onClick={handleNext}>Next</button>
              ) : (
                <button type="submit" onClick={handleSubmit}>Submit</button>
              )}
            </div>
          </form>
          {message && <p className={styles.message}>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default SchemeApplicationForm;
