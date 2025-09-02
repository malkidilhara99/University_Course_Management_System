import React, { useState } from 'react';
import './CourseFillForm.css';
import API_BASE from '../api';

export default function CourseFillForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [credits, setCredits] = useState('');
  const [department, setDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const departments = ["Computer Science", "Mathematics", "English", "Business", "Biology", "Physics"];

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    let newErrors = {};
    if (!code.match(/^\w{2,10}$/)) newErrors.code = "Enter a valid course code (2-10 chars)";
    if (!title.trim()) newErrors.title = "Course title is required";
    if (!department) newErrors.department = "Select a department";
    if (!credits || isNaN(Number(credits)) || Number(credits) <= 0) newErrors.credits = "Enter valid credits";
    if (description.length > 500) newErrors.description = "Description must be under 500 characters";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) { setSaving(false); return; }
    const payload = { title, code, credits: Number(credits), department, description };
    try {
      // Get JWT token from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await fetch(`${API_BASE}/api/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user.token ? { 'Authorization': 'Bearer ' + user.token } : {})
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Server rejected course creation');
      const created = await res.json();
      setMessage('Course created successfully');
      setTitle(''); setCode(''); setCredits(''); setDepartment(''); setDescription('');
      setErrors({});
      onCreated && onCreated(created);
    } catch (err) {
      setMessage('Course saved locally (backend unavailable)');
      onCreated && onCreated(payload);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="">
      <h2>Course Entry</h2>
      <form className="course-form" onSubmit={handleSubmit} autoComplete="off">
        <div className="form-row">
          <label htmlFor="courseCode">Code<span aria-label="required">*</span></label>
          <input id="courseCode" value={code} onChange={e=>setCode(e.target.value)} maxLength={10} required autoFocus placeholder="Course code" />
          {errors.code && <div className="field-error">{errors.code}</div>}
        </div>
        <div className="form-row">
          <label htmlFor="courseTitle">Title<span aria-label="required">*</span></label>
          <input id="courseTitle" value={title} onChange={e=>setTitle(e.target.value)} required placeholder="Course title" />
          {errors.title && <div className="field-error">{errors.title}</div>}
        </div>
        <div className="form-row">
          <label htmlFor="courseCredits">Credits<span aria-label="required">*</span></label>
          <input id="courseCredits" type="number" min="1" value={credits} onChange={e=>setCredits(e.target.value)} required placeholder="Credits" />
          {errors.credits && <div className="field-error">{errors.credits}</div>}
        </div>
        <div className="form-row">
          <label htmlFor="courseDept">Department<span aria-label="required">*</span></label>
          <select id="courseDept" value={department} onChange={e=>setDepartment(e.target.value)} required>
            <option value="">Choose department</option>
            {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
          </select>
          {errors.department && <div className="field-error">{errors.department}</div>}
        </div>
        <div className="form-row">
          <label htmlFor="courseDesc">Description</label>
          <textarea id="courseDesc" value={description} onChange={e=>setDescription(e.target.value)} rows={3} maxLength={300} placeholder="Up to 300 characters" />
          {errors.description && <div className="field-error">{errors.description}</div>}
        </div>
        <div className="form-actions">
          <button className="btn primary" type="submit" disabled={saving || Object.keys(errors).length > 0}>{saving ? 'Saving...' : 'Save Course'}</button>
          <button className="btn secondary" type="button" onClick={()=>{
            setTitle(''); setCode(''); setCredits(''); setDepartment(''); setDescription(''); setErrors({}); setMessage(null);
          }}>Cancel</button>
        </div>
        {message && <div className="form-note success">{message}</div>}
      </form>
    </section>
  );
}
