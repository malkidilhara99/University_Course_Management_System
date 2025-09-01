import React, { useEffect, useState } from 'react';
import './CourseList.css';
import API_BASE from '../api';

export default function CourseList({ onSelect }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setLoading(true);
    setError(null);
    try {
  const res = await fetch(`${API_BASE}/api/courses`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setCourses(data);
    } catch (e) {
      // fallback to mock data if backend is not available
      console.warn('Could not fetch courses, using mock data:', e.message);
      setError('Could not load courses from server — showing sample data');
      setCourses([
        { id: 1, code: 'CS101', title: 'Intro to Computer Science', credits: 3, department: 'Computer Science', description: 'Fundamentals of programming, algorithms and problem solving.' },
        { id: 2, code: 'MATH201', title: 'Calculus II', credits: 4, department: 'Mathematics', description: 'Integration techniques, sequences and series.' },
        { id: 3, code: 'ENG150', title: 'Academic Writing', credits: 2, department: 'English', description: 'Writing skills for academic success and research.' }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="course-list-root container">
      <div className="list-header">
        <h3>Courses</h3>
        <div className="list-actions">
          <button className="btn secondary" onClick={fetchCourses} aria-label="refresh">Refresh</button>
        </div>
      </div>

      {error && <div className="notice">{error}</div>}

      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <div className="table-wrap">
          <table className="courses-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Credits</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c.id} className="course-row" onClick={() => onSelect && onSelect(c)}>
                  <td className="course-code">{c.code}</td>
                  <td className="course-title">{c.title}</td>
                  <td className="course-credits">{c.credits}</td>
                  <td className="course-dept">{c.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
