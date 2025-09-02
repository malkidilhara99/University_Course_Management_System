import React, { useEffect, useState } from 'react';
import './StudentList.css';
import API_BASE from '../api';

export default function StudentList({ onSelect, refreshKey }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { fetchStudents(); }, [refreshKey]);

  async function fetchStudents() {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/students`);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      setStudents(data);
    } catch (e) {
      setError('Could not load students from server.');
      setStudents([]);
    } finally { setLoading(false); }
  }

  return (
    <section className="student-list-root card">
      <div className="list-header">
        <h4>Students</h4>
        <div className="list-actions">
          <button className="btn secondary" onClick={fetchStudents}>Refresh</button>
        </div>
      </div>

      {error && <div className="notice">{error}</div>}

      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <ul className="student-list">
          {students.length === 0 ? (
            <li className="empty">No students found.</li>
          ) : (
            students.map(student => (
              <li key={student.id} onClick={() => onSelect(student)}>
                <span>{student.name}</span> <span>{student.email}</span> <span>{student.major}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </section>
  );
}
