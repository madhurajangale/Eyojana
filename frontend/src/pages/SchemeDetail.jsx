import React from 'react'
import { useLocation } from 'react-router-dom'
import schemeData from '../dataset/dataset_final.json'
export default function SchemeDetail() {
    const location = useLocation();
    const { schemeName } = location.state || {};
    const schemedetail = schemeData.find(
        (scheme) => scheme['Scheme Name'].toLowerCase() === schemeName.toLowerCase()
      );
  return (
    <div>
      <h1>{schemedetail["Scheme Name"]}</h1>
          <p><strong>Category:</strong> {schemedetail.Category}</p>
          <p><strong>Gender:</strong> {schemedetail.Gender}</p>
          <p><strong>Age Range:</strong> {schemedetail["Age Range"]}</p>
          <p><strong>State:</strong> {schemedetail.State}</p>
          <p><strong>Marital Status:</strong> {schemedetail["Marital Status"]}</p>
          <p><strong>Income:</strong> {schemedetail.Income}</p>
          <p><strong>Caste:</strong> {schemedetail.Caste}</p>
          <p><strong>Ministry:</strong> {schemedetail.Ministry}</p>
          <p><strong>Employment Status:</strong> {schemedetail["Employment Status"]}</p>
          <p><strong>Benefits:</strong> {schemedetail.Benefits}</p>
          <p><strong>Details:</strong> {schemedetail.Details}</p>
          <p><strong>Required Documents:</strong></p>
      <ul>
        {schemedetail.Documents.map((doc, index) => (
          <li key={index}>{doc}</li>
        ))}
      </ul>
    </div>
  )
}
