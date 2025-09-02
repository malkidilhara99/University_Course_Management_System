import React, { useState, useEffect } from 'react';
import './EnrollmentForm.css';
import { 
  X, 
  Save, 
  User, 
  BookOpen, 
  Calendar, 
  AlertCircle,
  CheckCircle 
} from 'lucide-react';

export default function EnrollmentForm({ onClose, onSubmit, editingEnrollment = null }) {
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    status: 'ENROLLED',
    enrollmentDate: new Date().toISOString().split('T')[0]
  });
  
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStudents();
    fetchCourses();
      
    if (editingEnrollment) {
      setFormData({
        studentId: editingEnrollment.student?.id || '',
        courseId: editingEnrollment.course?.id || '',
        status: editingEnrollment.status || 'ENROLLED',
        enrollmentDate: editingEnrollment.enrollmentDate 
          ? new Date(editingEnrollment.enrollmentDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      });
    }
  }, [editingEnrollment]);

  async function fetchStudents() {
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
      
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  }

  async function fetchCourses() {
    try {
      const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';
      const token = localStorage.getItem('authToken');
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE}/api/courses`, {
        method: 'GET',
        headers: headers
      });
      
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.courseId) {
      setError('Please select both student and course');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';
      const token = localStorage.getItem('authToken');
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const enrollmentData = {
        studentId: parseInt(formData.studentId),
        courseId: parseInt(formData.courseId),
        status: formData.status
      };

      const url = editingEnrollment 
        ? `${API_BASE}/api/enrollments/${editingEnrollment.id}`
        : `${API_BASE}/api/enrollments`;
      
      const method = editingEnrollment ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(enrollmentData)
      });

      if (res.ok) {
        const savedEnrollment = await res.json();
        setSuccess(editingEnrollment ? 'Enrollment updated successfully!' : 'Enrollment created successfully!');
        
        setTimeout(() => {
          onSubmit(savedEnrollment);
          onClose();
          resetForm();
        }, 1500);
      } else {
        const errorData = await res.text();
        setError(errorData || 'Failed to save enrollment');
      }
    } catch (error) {
      console.error('Error saving enrollment:', error);
      setError('Failed to save enrollment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      courseId: '',
      status: 'ENROLLED',
      enrollmentDate: new Date().toISOString().split('T')[0]
    });
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="enrollment-form-overlay">
      <div className="enrollment-form-modal">
        <div className="enrollment-form-header">
          <h2 className="enrollment-form-title">
            {editingEnrollment ? 'Edit Enrollment' : 'Create New Enrollment'}
          </h2>
          <button 
            className="enrollment-form-close"
            onClick={handleClose}
            type="button"
          >
            <X className="close-icon" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="enrollment-form">
          {error && (
            <div className="alert alert-error">
              <AlertCircle className="alert-icon" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <CheckCircle className="alert-icon" />
              <span>{success}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="studentId" className="form-label">
              <User className="label-icon" />
              Select Student
            </label>
            <select
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="">Choose a student...</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName} ({student.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="courseId" className="form-label">
              <BookOpen className="label-icon" />
              Select Course
            </label>
            <select
              id="courseId"
              name="courseId"
              value={formData.courseId}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="">Choose a course...</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="ENROLLED">Enrolled</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="DROPPED">Dropped</option>
              <option value="WITHDRAWN">Withdrawn</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="enrollmentDate" className="form-label">
              <Calendar className="label-icon" />
              Enrollment Date
            </label>
            <input
              type="date"
              id="enrollmentDate"
              name="enrollmentDate"
              value={formData.enrollmentDate}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <div className="btn-loading">
                  <div className="spinner-small"></div>
                  {editingEnrollment ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                <>
                  <Save className="btn-icon" />
                  {editingEnrollment ? 'Update Enrollment' : 'Create Enrollment'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
