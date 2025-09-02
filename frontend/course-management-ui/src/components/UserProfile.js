import React from 'react';
import './UserProfile.css';

export default function UserProfile({ user }) {
  if (!user) return null;
  return (
    <div className="user-profile">
      <img className="avatar" src={user.avatar || 'https://ui-avatars.com/api/?name=' + user.name} alt="avatar" />
      <div className="user-info">
        <span className="user-name">{user.name}</span>
        <span className="user-role">{user.role}</span>
      </div>
    </div>
  );
}
