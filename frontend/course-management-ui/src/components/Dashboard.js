import React, { useState, useEffect } from 'react';
import { BookOpen, Users, ClipboardList } from 'lucide-react';
import Modal from './Modal';
import CourseFillForm from './CourseFillForm';
import API_BASE from '../api';
import './Dashboard.css';

export default function Dashboard() {
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [stats, setStats] = useState([]);
  const [coursesByDept, setCoursesByDept] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);

  useEffect(() => {
    // Fetch stats
    fetch(`${API_BASE}/api/dashboard/stats`).then(res => res.json()).then(data => {
      setStats([
        { label: 'Total Courses', value: data.totalCourses, icon: <BookOpen size={32} /> },
        { label: 'Total Students', value: data.totalStudents, icon: <Users size={32} /> },
        { label: 'Total Enrollments', value: data.totalEnrollments, icon: <ClipboardList size={32} /> },
      ]);
    }).catch(() => {});
    // Fetch courses by department
    fetch(`${API_BASE}/api/courses/by-department`).then(res => res.json()).then(setCoursesByDept).catch(() => setCoursesByDept([]));
    // Fetch recent courses
    fetch(`${API_BASE}/api/courses/recent`).then(res => res.json()).then(setRecentCourses).catch(() => setRecentCourses([]));
    // Fetch recent students
    fetch(`${API_BASE}/api/students/recent`).then(res => res.json()).then(setRecentStudents).catch(() => setRecentStudents([]));
  }, []);

  function handleCourseCreated() {
    setCourseModalOpen(false);
    // Optionally refresh course data here
  }

  return (
    <div className="dash-root container">
      <div className="dash-header">
        <h2>Dashboard</h2>
        <div className="muted">Your university at a glance</div>
      </div>

      <div className="stats-row">
        {stats.map((stat, i) => (
          <div className="stat-card creative" key={stat.label}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <button className="open-modal-btn" onClick={()=>setCourseModalOpen(true)}>
        + Add Course
      </button>
      <Modal open={courseModalOpen} onClose={()=>setCourseModalOpen(false)}>
        <CourseFillForm onCreated={handleCourseCreated} />
      </Modal>

      <div className="dash-sections">
        <div className="section-card">
          <h3>Courses by Department</h3>
          <table className="section-table">
            <thead>
              <tr><th>Department</th><th>Course Count</th></tr>
            </thead>
            <tbody>
              {coursesByDept.map(row => (
                <tr key={row.dept}><td>{row.dept}</td><td>{row.count}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="section-card">
          <h3>Recent Courses</h3>
          <table className="section-table">
            <thead>
              <tr><th>Code</th><th>Title</th><th>Credits</th></tr>
            </thead>
            <tbody>
              {recentCourses.map(row => (
                <tr key={row.code}><td>{row.code}</td><td>{row.title}</td><td>{row.credits}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="section-card">
          <h3>Recent Students</h3>
          <table className="section-table">
            <thead>
              <tr><th>Student ID</th><th>Name</th><th>Major</th><th>Year</th></tr>
            </thead>
            <tbody>
              {recentStudents.map(row => (
                <tr key={row.id}><td>{row.id}</td><td>{row.name}</td><td>{row.major}</td><td>{row.year}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
