import React,{useContext,useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.png'; 
import '../styles/navbar.css'; 
import axios from 'axios';
import eyojana from '../images/e-yojana.png';

import { AuthContext } from '../context/AuthContext';
import { width } from '@mui/system';
  

const AdminNav = () => {
  const { admin } = useContext(AuthContext);
  const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleCommunity=()=>{
    if (admin?.email) {
      // Navigate to the profile page if user is logged in
      navigate("/chat");
    } else {
      // Ask the user to log in
      if (window.confirm("You need to log in to access Community chat. Do you want to log in now?")) {
        navigate("/login"); // Navigate to the login page if confirmed
      }
      else{
        navigate("/")
      }
    }
  }
  const handleUsers=()=>{
    if (admin?.email) {
      // Navigate to the profile page if user is logged in
      navigate("/chat");
    } else {
      // Ask the user to log in
      if (window.confirm("You need to log in to access Community chat. Do you want to log in now?")) {
        navigate("/login"); // Navigate to the login page if confirmed
      }
      else{
        navigate("/adminhome")
      }
    }
  }
  const handleLogout = () => {
    // Show a confirmation alert
    if (window.confirm("Are you sure you want to log out?")) {
      // Clear user email
      admin.email = "";
      
      // Navigate to the home page
      navigate("/adminhome");
    }
  };
  const handleLogin = () => {
    setIsLoggedIn(true); // Set logged-in state to true on login
    navigate("/login");
  };
  const handleAnalysis=()=>{
    if (admin?.email) {
      // Navigate to the profile page if user is logged in
      navigate("/map");
    } else {
      // Ask the user to log in
      if (window.confirm("You need to log in to access Analysis. Do you want to log in now?")) {
        navigate("/login"); // Navigate to the login page if confirmed
      }
      else{
        navigate("/adminhome")
      }
    }
  }
  return (
    <nav className="navbar">
      <div className="navbar-content" style={{width: '100%'}}>
        <div className="logo">
          <a className="navbar-brand" href="#s">
            <img id="emblem" src={logo} alt="Logo" className="d-inline-block align-text-top" />
            <img src={eyojana} alt="Logo" width="120" height="30" className="d-inline-block align-text-top ms-3"/>
          </a>
        </div>

        <div className="nav-links" >
          <ul style={{display: 'flex', listStyle: 'none', justifyContent: 'flex-end', padding: '0'}}>
            <li><Link to="/adminhome" data-key="home">Home</Link></li>
            <li><Link onClick={handleAnalysis} to="/adminhome/map" data-key="home">Analysis</Link></li>
            <li><Link onClick={handleUsers} to="/adminhome/myusers" data-key="home">Users</Link></li>
            <li><Link data-key="Community" to="/adminhome/chat"onClick={handleCommunity}>Community</Link></li>
           <button style={{ color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }} >{admin?.email ? (
    <button onClick={handleLogout} className="btn btn-danger">Logout</button>
  ) : (
    <button onClick={handleLogin} className="btn">Login</button>
  )}</button>
          </ul>
        </div>
        </div>
        </nav>
  )
}

export default AdminNav