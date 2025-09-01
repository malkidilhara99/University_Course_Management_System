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
      console.warn('Enrollments fetch failed, using sample data', e.message);
      setError('Could not load enrollments — showing sample data');
      setEnrollments([
        { id:1, student:'Jane Doe', course:'CS101', status:'Enrolled'},
        { id:2, student:'John Smith', course:'MATH201', status:'Waitlisted'},
      ]);
    }finally{ setLoading(false); }
  }

  return (
    <div className="enroll-root">
      <h2>Enrollments</h2>
      {error && <div className="notice">{error}</div>}
      {loading ? <div className="loader">Loading...</div> : (
        <table className="enroll-table">
          <thead><tr><th>Student</th><th>Course</th><th>Status</th></tr></thead>
          <tbody>
            {enrollments.map(e => (
              <tr key={e.id}><td>{e.student}</td><td>{e.course}</td><td>{e.status}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
