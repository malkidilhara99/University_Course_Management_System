

import React, { useState } from 'react';
import './Register.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';

export default function Register() {
  const [role, setRole] = useState('Student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const payload = {
        username: email,
        email,
        password,
        firstName: name,
        role: role.toUpperCase()
      };
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Registration successful!');
        setName(''); setEmail(''); setPassword(''); setRole('Student');
      } else {
        setMessage(data.message || 'Registration failed.');
      }
    } catch (err) {
      setMessage('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-card">
        <h2>Register</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Name</label>
          <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
          <label>Email</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <label>Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} required>
            <option value="Admin">Admin</option>
            <option value="Lecturer">Lecturer</option>
            <option value="Student">Student</option>
          </select>
          <div className="auth-actions">
            <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
          </div>
        </form>
        {message && <div className="helper">{message}</div>}
      </div>
    </div>
  );
}
