import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.png'; 
import '../styles/navbar.css'; 
import axios from 'axios';
import eyojana from '../images/e-yojana.png';
import { color } from 'd3';

const AdminNav = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="logo">
          <a className="navbar-brand" href="#s">
            <img id="emblem" src={logo} alt="Logo" className="d-inline-block align-text-top" />
            <img src={eyojana} alt="Logo" width="120" height="30" className="d-inline-block align-text-top ms-3"/>
          </a>
        </div>

        <div className="nav-links">
          <ul>
            <li><Link to="/" data-key="home">Home</Link></li>
            <li><Link to="/" data-key="home">Analysis</Link></li>
            <li><Link to="/" data-key="home">Users</Link></li>
            <li><Link data-key="Community" to="/chat">Community</Link></li>
           <button style={{ color: '#fff',backgroundColor:'#779307', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }} >Logout</button>
          </ul>
        </div>
        </div>
        </nav>
  )
}

export default AdminNav