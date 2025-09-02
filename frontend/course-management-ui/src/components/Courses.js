import React, { useState, useEffect } from 'react';
import CourseList from './CourseList';
import CourseFillForm from './CourseFillForm';
import Modal from './Modal';
import './Courses.css';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  BookOpen, 
  Users, 
  Clock, 
  TrendingUp,
  Award
} from 'lucide-react';

export default function Courses() {
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseEnrollments, setCourseEnrollments] = useState({});
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    activeCourses: 0,
    departments: []
  });

  useEffect(() => {
    fetchCourses();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchCourses() {
    setLoading(true);
    try {
      const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';
      const res = await fetch(`${API_BASE}/api/courses`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
        // Fetch enrollment data for each course
        await fetchCourseEnrollments(data);
        // Calculate real stats from the data
        await calculateStats(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCourseEnrollments(coursesData) {
    const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';
    const enrollmentCounts = {};
    
    try {
      // Fetch all enrollments at once for better performance
      const enrollmentRes = await fetch(`${API_BASE}/api/enrollments`);
      if (enrollmentRes.ok) {
        const enrollments = await enrollmentRes.json();
        
        // Count enrollments per course
        coursesData.forEach(course => {
          const courseEnrollments = enrollments.filter(enrollment => 
            enrollment.course?.id === course.id || enrollment.courseId === course.id
          );
          enrollmentCounts[course.id] = courseEnrollments.length;
        });
      }
    } catch (error) {
      console.error('Error fetching enrollment data:', error);
      // Set all course enrollments to 0 if there's an error
      coursesData.forEach(course => {
        enrollmentCounts[course.id] = 0;
      });
    }
    
    setCourseEnrollments(enrollmentCounts);
  }

  async function calculateStats(coursesData) {
    const departments = [...new Set(coursesData.map(course => course.department))].filter(Boolean);
    
    // Fetch enrollment data to calculate total students
    let totalStudents = 0;
    try {
      const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';
      const enrollmentRes = await fetch(`${API_BASE}/api/enrollments`);
      if (enrollmentRes.ok) {
        const enrollments = await enrollmentRes.json();
        // Count unique students across all enrollments
        const uniqueStudents = new Set(enrollments.map(enrollment => enrollment.student?.id || enrollment.studentId));
        totalStudents = uniqueStudents.size;
      }
    } catch (error) {
      console.error('Error fetching enrollment data:', error);
    }
    
    setStats({
      totalCourses: coursesData.length,
      totalStudents: totalStudents,
      activeCourses: coursesData.length, // Assuming all courses are active
      departments: departments
    });
  }

  function onCourseCreated() {
    setRefreshKey(k => k + 1);
    setModalOpen(false);
    fetchCourses(); // This will refresh all data including enrollments and stats
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || course.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(courses.map(course => course.department))].filter(Boolean);

  return (
    <div className="courses-page">
      {/* Header Section */}
      <div className="courses-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">
              <BookOpen className="title-icon" />
              Course Management
            </h1>
            <p className="page-subtitle">Manage and organize your academic courses</p>
          </div>
          <div className="header-actions">
            <button className="add-course-btn" onClick={() => setModalOpen(true)}>
              <Plus size={20} />
              Add New Course
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <BookOpen size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalCourses}</h3>
              <p>Total Courses</p>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalStudents}</h3>
              <p>Enrolled Students</p>
            </div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.activeCourses}</h3>
              <p>Active Courses</p>
            </div>
          </div>
          <div className="stat-card info">
            <div className="stat-icon">
              <Award size={24} />
            </div>
            <div className="stat-content">
              <h3>{departments.length}</h3>
              <p>Departments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="courses-controls">
        <div className="controls-left">
          <div className="search-box">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search courses by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-box">
            <Filter className="filter-icon" size={20} />
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="filter-select"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
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

      {/* Courses Content */}
      <div className="courses-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading courses...</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="courses-grid">
            {filteredCourses.length === 0 ? (
              <div className="empty-state">
                <BookOpen size={64} className="empty-icon" />
                <h3>No courses found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              filteredCourses.map(course => (
                <div key={course.id} className="course-card">
                  <div className="course-header">
                    <div className="course-code-badge">{course.code}</div>
                    <div className="course-credits">{course.credits} Credits</div>
                  </div>
                  <div className="course-body">
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-department">{course.department}</p>
                    <div className="course-meta">
                      <div className="meta-item">
                        <Users size={16} />
                        <span>{courseEnrollments[course.id] || 0} Students</span>
                      </div>
                      <div className="meta-item">
                        <Clock size={16} />
                        <span>Academic Course</span>
                      </div>
                    </div>
                  </div>
                  <div className="course-footer">
                    <button className="course-action-btn primary">View Details</button>
                    <button className="course-action-btn secondary">Edit</button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="courses-list-view">
            <CourseList 
              refreshKey={refreshKey} 
              courses={filteredCourses} 
              courseEnrollments={courseEnrollments}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <CourseFillForm onCreated={onCourseCreated} />
      </Modal>
    </div>
  );
}
