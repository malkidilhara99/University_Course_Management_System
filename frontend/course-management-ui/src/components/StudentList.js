import React, { useEffect, useState } from 'react';
import './StudentList.css';
import { User, Mail, GraduationCap, Calendar, RefreshCw } from 'lucide-react';

export default function StudentList({ onSelect, refreshKey, students: propStudents }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { 
    if (propStudents) {
      setStudents(propStudents);
    } else {
      fetchStudents(); 
    }
  }, [refreshKey, propStudents]);

  async function fetchStudents() {
    setLoading(true); 
    setError(null);
    try {
      const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';
      const token = localStorage.getItem('authToken');
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const res = await fetch(`${API_BASE}/api/students`, {
        method: 'GET',
        headers: headers
      });
      
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error('Authentication required. Please log in.');
        }
        throw new Error(`Server error: ${res.status}`);
      }
      
      const data = await res.json();
      setStudents(data);
    } catch (e) {
      console.error('Error fetching students:', e);
      setError(e.message || 'Could not load students from server.');
      setStudents([]);
    } finally { 
      setLoading(false); 
    }
  }

  return (
    <section className="student-list-modern">
      <div className="list-header-modern">
        <h3>Students Directory</h3>
        <div className="list-actions-modern">
          <button className="refresh-btn-modern" onClick={fetchStudents} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spinning' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner-small"></div>
          <span>Loading students...</span>
        </div>
      ) : (
        <div className="student-list-container">
          {students.length === 0 ? (
            <div className="empty-list">
              <User size={48} className="empty-icon" />
              <h4>No students found</h4>
              <p>Start by adding your first student to the system</p>
            </div>
          ) : (
            <div className="student-list-grid">
              {students.map(student => (
                <div 
                  key={student.id} 
                  className="student-list-item"
                  onClick={() => onSelect(student)}
                >
                  <div className="student-avatar-small">
                    <User size={20} />
                  </div>
                  <div className="student-info">
                    <h4 className="student-name-list">{student.name}</h4>
                    <div className="student-details-list">
                      <div className="detail-row">
                        <Mail size={14} />
                        <span>{student.email}</span>
                      </div>
                      <div className="detail-row">
                        <GraduationCap size={14} />
                        <span>{student.major || 'No Major'}</span>
                      </div>
                      <div className="detail-row">
                        <Calendar size={14} />
                        <span>ID: {student.studentId || student.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="student-status-indicator">
                    <span className="status-dot active"></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
