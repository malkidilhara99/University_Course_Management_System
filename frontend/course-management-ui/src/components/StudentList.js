import React, { useEffect, useState } from 'react';
import './StudentList.css';

export default function StudentList({ onSelect }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { fetchStudents(); }, []);

  async function fetchStudents() {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/students');
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      setStudents(data);
    } catch (e) {
      console.warn('Student fetch failed, using sample data', e.message);
      setError('Could not load students from server — showing sample data');
      setStudents([
        { id:1, name:'Jane Doe', email:'jane.doe@example.edu', major:'Computer Science' },
        { id:2, name:'John Smith', email:'john.smith@example.edu', major:'Mathematics' },
        { id:3, name:'Aisha Khan', email:'aisha.khan@example.edu', major:'Biology' }
      ]);
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
        <ul className="students">
          {students.map(s => (
            <li key={s.id} className="student-item" onClick={() => onSelect && onSelect(s)}>
              <div>
                <div className="student-name">{s.name}</div>
                <div className="student-meta">{s.email} · {s.major}</div>
              </div>
              <div className="chev">›</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
