import React from 'react';
import './Navigation.css';
import { Link } from 'react-router-dom';
import { Home, Grid, LogIn, UserPlus, Users } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="nav">
      <div className="nav-brand">University Course Management System</div>
      <div className="nav-links">
        <Link to="/" title="Home"><Home size={16} style={{verticalAlign:'middle',marginRight:8}}/>Home</Link>
  <Link to="/dashboard" title="Dashboard"><Grid size={16} style={{verticalAlign:'middle',marginRight:8}}/>Dashboard</Link>
  <Link to="/students" title="Students"><Users size={16} style={{verticalAlign:'middle',marginRight:8}}/>Students</Link>
  <Link to="/login" title="Login"><LogIn size={16} style={{verticalAlign:'middle',marginRight:8}}/>Login</Link>
  <Link to="/register" title="Register"><UserPlus size={16} style={{verticalAlign:'middle',marginRight:8}}/>Register</Link>
      </div>
    </nav>
  );
}
