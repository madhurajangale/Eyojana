import React from "react";
import "../styles/Category.css";

const categories = [
  { icon: "🌱", title: "Agriculture, Rural & Environment" },
  { icon: "🏦", title: "Banking, Financial Services and Insurance" },
  { icon: "🤝", title: "Business & Entrepreneurship" },
  { icon: "🎓", title: "Education & Learning" },
  { icon: "💊", title: "Health & Wellness" },
  { icon: "🏠", title: "Housing & Shelter" },
  { icon: "⚖️", title: "Public Safety, Law & Justice" },
  { icon: "🔬", title: "Science, IT & Communications" },
  { icon: "📊", title: "Skills & Employment" },
  { icon: "✊", title: "Social Welfare & Empowerment" },
  { icon: "🎾", title: "Sports & Culture" },
  { icon: "🚌", title: "Transport & Infrastructure" },
  { icon: "🌍", title: "Travel & Tourism" },
  { icon: "🛠️", title: "Utility & Sanitation" },
  { icon: "💑", title: "Women and Child" },
];

const Category = () => {
  return (
    <div className="category-page">
      <h1>schemes based on categories</h1>
      <div className="category-grid">
        {categories.map((cat, index) => (
          <div key={index} className="category-card">
            <div className="icon">{cat.icon}</div>
            <h3 className="title">{cat.title}</h3>
            <button className="view-button">View</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
