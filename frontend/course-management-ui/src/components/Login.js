import React from 'react';
import './Auth.css';

export default function Login(){
  return (
    <div className="auth">
      <h2>Login</h2>
      <form className="auth-form">
        <label>Email</label>
        <input type="email" placeholder="you@example.com" />
        <label>Password</label>
        <input type="password" placeholder="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
