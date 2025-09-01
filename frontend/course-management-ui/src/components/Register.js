import React from 'react';
import './Auth.css';

export default function Register(){
  return (
    <div className="auth">
      <h2>Register</h2>
      <form className="auth-form">
        <label>Name</label>
        <input type="text" placeholder="Your name" />
        <label>Email</label>
        <input type="email" placeholder="you@example.com" />
        <label>Password</label>
        <input type="password" placeholder="password" />
        <button type="submit">Register</button>
      </form>
    </div>
  )
}
