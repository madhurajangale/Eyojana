// import React from "react";
// import '../styles/admin.css';
// import adminhome from '../images/adminhome.png';
// import { Link } from 'react-router-dom';
// // import AdminNav from '../components/adminNav';

// const categories = [
//     { text: "Agriculture, Rural & Environment" },
//     { text: "Banking, Financial Services and Insurance"},
//     { text: "Business & Entrepreneurship" },
//     { text: "Education & Learning"},
//     { text: "Health & Wellness"},
//     { text: "Housing & Shelter"},
//     { text: "Public Safety, Law & Justice"},
//     { text: "Science, IT & Communications"},
//     { text: "Skills & Employment"},
//     { text: "Social welfare & Empowerment"},
//     { text: "Sports & Culture" },
//     { text: "Transport & Infrastructure"},
//     { text: "Travel & Tourism" },
//     { text: "Utility & Sanitation"},
//     { text: "Women and Child"}
// ];

// function Admin() {
//     return (
//         <div className="admin-profile-container">
//             {/* <header>
//                 <AdminNav />
//             </header> */}

//             <div className="admin-header-img">
//                 <img src={adminhome} alt="Admin" className="admin-profile-img" />
//             </div>

//             <div className="admin-scheme-section">
//                 <h3 align="center">Applications For Schemes:</h3>
//                 <div className="admin-category-list">
//                     {categories.map((category, index) => (
//                         <button key={index} className="admin-category-btn">
//                             <h4>{category.text}</h4>
//                         </button>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Admin;




// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/admin.css";
// import adminhome from "../images/adminhome.png";

// const categories = [
//   { text: "Business" },
//   { text: "Banking, Financial Services and Insurance" },
//   { text: "Business & Entrepreneurship" },
//   { text: "Education & Learning" },
//   { text: "Health & Wellness" },
//   { text: "Housing & Shelter" },
//   { text: "Public Safety, Law & Justice" },
//   { text: "Science, IT & Communications" },
//   { text: "Skills & Employment" },
//   { text: "Social welfare & Empowerment" },
//   { text: "Sports & Culture" },
//   { text: "Transport & Infrastructure" },
//   { text: "Travel & Tourism" },
//   { text: "Utility & Sanitation" },
//   { text: "Women and Child" },
//   {text: "Agriculture, Rural & Environment"},
// ];

// function Admin({ adminEmail }) {
//   const navigate = useNavigate();

//   const handleCategoryClick = (category) => {
//     // Navigate to the Applications page with the selected category and adminEmail as state
//     navigate(`/applications/${category}`, { state: { adminEmail } });
//   };

//   return (
//     <div className="admin-container">
//       <div className="admin-header">
//         <img src={adminhome} alt="Admin Home" className="admin-header-img" />
//         <h1 className="admin-title">Welcome, Admin</h1>
//       </div>
//       <div className="admin-category-section">
//         <h2 className="category-section-title">View Applications by Category</h2>
//         <div className="admin-category-list">
//           {categories.map((category, index) => (
//             <button
//               key={index}
//               className="admin-category-btn"
//               onClick={() => handleCategoryClick(category.text)}
//             >
//               {category.text}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Admin;



import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
import adminhome from "../images/adminhome.png";

const categories = [
  { text: "Business" },
  { text: "Banking, Financial Services and Insurance" },
  { text: "Business & Entrepreneurship" },
  { text: "Education & Learning" },
  { text: "Health & Wellness" },
  { text: "Housing & Shelter" },
  { text: "Public Safety, Law & Justice" },
  { text: "Science, IT & Communications" },
  { text: "Skills & Employment" },
  { text: "Social welfare & Empowerment" },
  { text: "Sports & Culture" },
  { text: "Transport & Infrastructure" },
  { text: "Travel & Tourism" },
  { text: "Utility & Sanitation" },
  { text: "Women and Child" },
  { text: "Agriculture, Rural & Environment" },
];

function Admin({ adminEmail }) {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    // Encode the category to handle spaces
    const encodedCategory = encodeURIComponent(category);
    navigate(`/applications/${encodedCategory}`, { state: { adminEmail } });
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <img src={adminhome} alt="Admin Home" className="admin-header-img" />
        
      </div>
      <div className="admin-category-section">
        <h2 className="category-section-title">View Applications</h2>
        <div className="admin-category-list">
          {categories.map((category, index) => (
            <button
              key={index}
              className="admin-category-btn"
              onClick={() => handleCategoryClick(category.text)}
            >
              {category.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;
