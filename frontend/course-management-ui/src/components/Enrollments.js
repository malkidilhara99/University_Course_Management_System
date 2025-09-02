import React, { useEffect, useState } from 'react';
import './Enrollments.css';
import API_BASE from '../api';

export default function Enrollments(){
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(()=>{ fetchEnrollments(); }, []);

  async function fetchEnrollments(){
    setLoading(true); setError(null);
    try{
      const res = await fetch(`${API_BASE}/api/enrollments`);
      if(!res.ok) throw new Error('Network');
      const data = await res.json();
      setEnrollments(data);
    }catch(e){
      setError('Could not load enrollments from server.');
      setEnrollments([]);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="enrollments-root card">
      <div className="list-header">
        <h3>Enrollments</h3>
        <button className="btn secondary" onClick={fetchEnrollments}>Refresh</button>
      </div>
      {error && <div className="notice">{error}</div>}
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <table className="enrollments-table">
          <thead>
            <tr><th>Student</th><th>Course</th><th>Status</th></tr>
          </thead>
          <tbody>
            {enrollments.length === 0 ? (
              <tr><td colSpan="3" className="empty">No enrollments found.</td></tr>
            ) : (
              enrollments.map(e => (
                <tr key={e.id}><td>{e.student}</td><td>{e.course}</td><td>{e.status}</td></tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
