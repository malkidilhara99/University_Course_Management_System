
import React, { useEffect, useState, useRef } from 'react';
import './Navigation.css';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, LogIn, UserPlus, Users, ClipboardList, BookOpen, LogOut, Settings, User, ChevronDown } from 'lucide-react';

export default function Navigation() {
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Get user from localStorage after login
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowUserMenu(false);
    navigate('/');
    window.location.reload();
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <nav className="nav">
      <div className="nav-brand">
        <Link to="/" className="brand-link">
          <BookOpen size={24} className="brand-icon" />
          <span className="brand-text">UniCourse</span>
        </Link>
      </div>
      
      <div className="nav-center">
        {user && (
          <>
            <Link to="/dashboard" className="nav-link" title="Dashboard">
              <Grid size={18} />
              <span>Dashboard</span>
            </Link>
            <Link to="/students" className="nav-link" title="Students">
              <Users size={18} />
              <span>Students</span>
            </Link>
            <Link to="/courses" className="nav-link" title="Courses">
              <BookOpen size={18} />
              <span>Courses</span>
            </Link>
            <Link to="/enrollments" className="nav-link" title="Enrollments">
              <ClipboardList size={18} />
              <span>Enrollments</span>
            </Link>
          </>
        )}
      </div>

      <div className="nav-right">
        {!user ? (
          <div className="auth-links">
            <Link to="/login" className="nav-link login-btn" title="Login">
              <LogIn size={18} />
              <span>Login</span>
            </Link>
            <Link to="/register" className="nav-link register-btn" title="Register">
              <UserPlus size={18} />
              <span>Register</span>
            </Link>
          </div>
        ) : (
          <div className="user-profile-container" ref={dropdownRef}>
            <button className="user-profile-btn" onClick={toggleUserMenu}>
              <div className="user-avatar">
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=white&size=40`} 
                  alt="User Avatar" 
                />
              </div>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role}</span>
              </div>
              <ChevronDown size={16} className={`chevron ${showUserMenu ? 'rotated' : ''}`} />
            </button>
            
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="user-details">
                    <strong>{user.name}</strong>
                    <span>{user.role}</span>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                  <User size={16} />
                  <span>My Profile</span>
                </Link>
                <Link to="/settings" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-item" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
