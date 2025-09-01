import React from 'react';
import './Navigation.css';
import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav className="nav">
      <div className="nav-brand">University Course Management System</div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}
