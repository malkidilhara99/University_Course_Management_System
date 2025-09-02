import React, { useState, useEffect } from 'react';
import './Profile.css';
import { User, Mail, Shield, Calendar, Edit3, Save, X } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setEditForm({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        role: parsedUser.role || ''
      });
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || ''
      });
    }
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...editForm };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
    // Here you would typically make an API call to update the user on the server
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar-large">
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=white&size=120`} 
              alt="Profile Avatar" 
            />
          </div>
          <div className="profile-header-info">
            <h1>My Profile</h1>
            <p>Manage your account information</p>
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <button className="btn-edit" onClick={handleEdit}>
                <Edit3 size={18} />
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button className="btn-save" onClick={handleSave}>
                  <Save size={18} />
                  Save
                </button>
                <button className="btn-cancel" onClick={handleCancel}>
                  <X size={18} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h3>Personal Information</h3>
            <div className="profile-fields">
              <div className="profile-field">
                <div className="field-icon">
                  <User size={20} />
                </div>
                <div className="field-content">
                  <label>Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="field-input"
                    />
                  ) : (
                    <div className="field-value">{user.name || 'Not provided'}</div>
                  )}
                </div>
              </div>

              <div className="profile-field">
                <div className="field-icon">
                  <Mail size={20} />
                </div>
                <div className="field-content">
                  <label>Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="field-input"
                    />
                  ) : (
                    <div className="field-value">{user.email || 'Not provided'}</div>
                  )}
                </div>
              </div>

              <div className="profile-field">
                <div className="field-icon">
                  <Shield size={20} />
                </div>
                <div className="field-content">
                  <label>Role</label>
                  <div className="field-value">
                    <span className={`role-badge ${user.role?.toLowerCase()}`}>
                      {user.role || 'Not assigned'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="profile-field">
                <div className="field-icon">
                  <Calendar size={20} />
                </div>
                <div className="field-content">
                  <label>Member Since</label>
                  <div className="field-value">
                    {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
