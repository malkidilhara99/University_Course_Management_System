import React, { useEffect, useState } from 'react';
import './CourseList.css';
import { RefreshCw, BookOpen, Users, Clock, Award } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';

export default function CourseList({ onSelect, courses: propCourses, refreshKey, courseEnrollments = {} }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (propCourses) {
      setCourses(propCourses);
    } else {
      fetchCourses();
    }
  }, [propCourses, refreshKey]);

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

  if (loading) {
    return (
      <div className="course-list-loading">
        <div className="spinner"></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-list-error">
        <div className="error-content">
          <BookOpen size={48} className="error-icon" />
          <h3>Unable to load courses</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchCourses}>
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="course-list-modern">
      <div className="list-header-modern">
        <div className="header-info">
          <h3>Course Catalog</h3>
          <p>{courses.length} courses available</p>
        </div>
        <button className="refresh-btn-modern" onClick={fetchCourses} aria-label="Refresh courses">
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="empty-courses">
          <BookOpen size={64} className="empty-icon" />
          <h3>No courses available</h3>
          <p>Start by adding your first course to the system.</p>
        </div>
      ) : (
        <div className="courses-table-container">
          <table className="courses-table-modern">
            <thead>
              <tr>
                <th>
                  <div className="th-content">
                    <BookOpen size={16} />
                    Course Code
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <Award size={16} />
                    Course Title
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <Clock size={16} />
                    Credits
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <Users size={16} />
                    Students
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <Users size={16} />
                    Department
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr 
                  key={course.id} 
                  className="course-row-modern"
                  onClick={() => onSelect && onSelect(course)}
                >
                  <td>
                    <div className="course-code-cell">
                      <span className="code-badge">{course.code}</span>
                    </div>
                  </td>
                  <td>
                    <div className="course-title-cell">
                      <span className="title-main">{course.title}</span>
                      <span className="title-sub">Academic Course</span>
                    </div>
                  </td>
                  <td>
                    <div className="credits-cell">
                      <span className="credits-number">{course.credits}</span>
                      <span className="credits-label">credits</span>
                    </div>
                  </td>
                  <td>
                    <div className="enrollments-cell">
                      <span className="enrollment-number">{courseEnrollments[course.id] || 0}</span>
                      <span className="enrollment-label">enrolled</span>
                    </div>
                  </td>
                  <td>
                    <div className="department-cell">
                      <span className="dept-name">{course.department}</span>
                    </div>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="action-btn view" onClick={(e) => {
                        e.stopPropagation();
                        // Handle view action
                      }}>
                        View
                      </button>
                      <button className="action-btn edit" onClick={(e) => {
                        e.stopPropagation();
                        // Handle edit action
                      }}>
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
