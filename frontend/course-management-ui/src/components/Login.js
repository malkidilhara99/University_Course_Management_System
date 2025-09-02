
import React, { useState } from 'react';
import './Auth.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const payload = { username: email, password };
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.token) {
        // Save user info and token to localStorage
        const userObj = {
          name: data.firstName || email,
          role: data.role,
          token: data.token
        };
        localStorage.setItem('user', JSON.stringify(userObj));
        console.log('User info saved to localStorage:', userObj);
        setMessage('Login successful!');
        setEmail(''); setPassword('');
        // Optionally, redirect or reload
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setMessage(data.message || 'Login failed.');
      }
    } catch (err) {
      setMessage('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      {message && <div className="helper">{message}</div>}
    </div>
  );
}
