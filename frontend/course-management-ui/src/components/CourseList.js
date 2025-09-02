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
      setError('Could not load courses from server.');
      setCourses([]);
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
        <>
          <table className="course-table">
            <thead>
              <tr><th>Code</th><th>Title</th><th>Credits</th><th>Department</th></tr>
            </thead>
            <tbody>
              {courses.length === 0
                ? <tr><td colSpan="4" className="empty">No courses found.</td></tr>
                : courses.map(c => (
                    <React.Fragment key={c.id}>
                      <tr className="course-row" onClick={() => onSelect && onSelect(c)}>
                        <td className="course-code">{c.code}</td>
                        <td className="course-title">{c.title}</td>
                        <td className="course-credits">{c.credits}</td>
                        <td className="course-dept">{c.department}</td>
                      </tr>
                    </React.Fragment>
                  ))
              }
            </tbody>
          </table>
        </>
      )}
        </section>
      );
}
