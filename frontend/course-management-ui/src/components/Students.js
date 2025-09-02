import React, { useState, useEffect } from 'react';
import StudentList from './StudentList';
import StudentForm from './StudentForm';
import StudentGrades from './StudentGrades';
import Modal from './Modal';
import './Students.css';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Users, 
  GraduationCap, 
  Award, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  User,
  AlertCircle,
  XCircle
} from 'lucide-react';

export default function Students() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMajor, setFilterMajor] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalMajors: 0,
    averageGrade: 0,
    activeEnrollments: 0
  });
  const [accessLevel, setAccessLevel] = useState('full'); // 'full', 'limited', 'restricted'

  useEffect(() => {
    // Always set to full access regardless of role
    setAccessLevel('full');
    
    fetchStudents();
  }, []);

  async function fetchStudents() {
    setLoading(true);
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
        
        // Always set to full access
        setAccessLevel('full');
        
        await calculateStats(data);
      } else if (res.status === 403) {
        // Even on error, keep full access
        setAccessLevel('full');
        setStudents([]);
        console.warn('Access restricted - insufficient privileges');
      } else {
        console.error('Failed to fetch students:', res.status, res.statusText);
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  }

  async function calculateStats(studentsData) {
    const majors = [...new Set(studentsData.map(student => student.major))].filter(Boolean);
    
    // Fetch enrollment data to calculate active enrollments
    let activeEnrollments = 0;
    try {
      const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';
      const token = localStorage.getItem('authToken');
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const enrollmentRes = await fetch(`${API_BASE}/api/enrollments`, {
        method: 'GET',
        headers: headers
      });
      if (enrollmentRes.ok) {
        const enrollments = await enrollmentRes.json();
        activeEnrollments = enrollments.length;
      }
    } catch (error) {
      console.error('Error fetching enrollment data:', error);
    }
    
    setStats({
      totalStudents: studentsData.length,
      totalMajors: majors.length,
      averageGrade: 85.5, // Mock average grade for now
      activeEnrollments: activeEnrollments
    });
  }

  function onStudentCreated() {
    setRefreshKey(k => k + 1);
    setModalOpen(false);
    fetchStudents(); // Refresh all data including stats
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMajor = !filterMajor || student.major === filterMajor;
    return matchesSearch && matchesMajor;
  });

  const majors = [...new Set(students.map(student => student.major))].filter(Boolean);

  return (
    <div className="students-page">
      {/* Header Section */}
      <div className="students-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">
              <Users className="title-icon" />
              Student Management
            </h1>
            <p className="page-subtitle">
              {accessLevel === 'full' && 'Full access to all student records and academic information'}
              {accessLevel === 'limited' && 'View student directory and information'}
              {accessLevel === 'restricted' && 'Access restricted - contact administrator for access'}
            </p>
            {accessLevel === 'limited' && (
              <div className="access-notice">
                <span className="notice-text">
                  📋 Student View: You can view student information for academic collaboration. 
                  Only administrators can add new students.
                </span>
              </div>
            )}
          </div>
          <div className="header-actions">
            <button className="add-student-btn" onClick={() => setModalOpen(true)}>
              <Plus size={20} />
              Add New Student
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalStudents}</h3>
              <p>Total Students</p>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon">
              <GraduationCap size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalMajors}</h3>
              <p>Academic Programs</p>
            </div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon">
              <Award size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.averageGrade}%</h3>
              <p>Average Grade</p>
            </div>
          </div>
          <div className="stat-card info">
            <div className="stat-icon">
              <BookOpen size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.activeEnrollments}</h3>
              <p>Active Enrollments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="students-controls">
        <div className="controls-left">
          <div className="search-box">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search students by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-box">
            <Filter className="filter-icon" size={20} />
            <select
              value={filterMajor}
              onChange={(e) => setFilterMajor(e.target.value)}
              className="filter-select"
            >
              <option value="">All Majors</option>
              {majors.map(major => (
                <option key={major} value={major}>{major}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="controls-right">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid size={18} />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Students Content */}
      <div className="students-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading students...</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="students-grid-layout">
            {filteredStudents.length === 0 ? (
              <div className="empty-state">
                <Users size={64} className="empty-icon" />
                <h3>No students found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              filteredStudents.map(student => (
                <div 
                  key={student.id} 
                  className="student-card"
                  onClick={() => setSelectedStudent(student)}
                >
                  <div className="student-header">
                    <div className="student-avatar">
                      <User size={24} />
                    </div>
                    <div className="student-status">
                      <span className="status-badge active">Active</span>
                    </div>
                  </div>
                  <div className="student-body">
                    <h3 className="student-name">{student.name}</h3>
                    <p className="student-id">ID: {student.studentId || student.id}</p>
                    <p className="student-major">{student.major}</p>
                    <div className="student-meta">
                      <div className="meta-item">
                        <Mail size={16} />
                        <span>{student.email}</span>
                      </div>
                      <div className="meta-item">
                        <Calendar size={16} />
                        <span>Enrolled 2024</span>
                      </div>
                    </div>
                  </div>
                  <div className="student-footer">
                    <button className="student-action-btn primary">View Profile</button>
                    <button className="student-action-btn secondary">View Grades</button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="students-list-view">
            <StudentList 
              onSelect={setSelectedStudent} 
              refreshKey={refreshKey} 
              students={filteredStudents}
            />
          </div>
        )}
      </div>

      {/* Student Details Sidebar */}
      {selectedStudent && (
        <div className="student-details-sidebar">
          <div className="sidebar-content">
            <div className="sidebar-header">
              <h3>Student Details</h3>
              <button 
                className="close-sidebar"
                onClick={() => setSelectedStudent(null)}
              >
                ×
              </button>
            </div>
            <div className="sidebar-body">
              <div className="student-profile">
                <div className="profile-avatar">
                  <User size={48} />
                </div>
                <div className="profile-info">
                  <h4>{selectedStudent.name}</h4>
                  <p>{selectedStudent.major}</p>
                  <p>ID: {selectedStudent.studentId || selectedStudent.id}</p>
                </div>
              </div>
              <div className="profile-details">
                <div className="detail-item">
                  <Mail size={16} />
                  <span>{selectedStudent.email}</span>
                </div>
                {selectedStudent.phone && (
                  <div className="detail-item">
                    <Phone size={16} />
                    <span>{selectedStudent.phone}</span>
                  </div>
                )}
                {selectedStudent.address && (
                  <div className="detail-item">
                    <MapPin size={16} />
                    <span>{selectedStudent.address}</span>
                  </div>
                )}
              </div>
              <StudentGrades studentId={selectedStudent?.id} />
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <StudentForm onCreated={onStudentCreated} />
      </Modal>
    </div>
  );
}
