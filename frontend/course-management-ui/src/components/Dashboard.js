
import React from 'react';
import './Dashboard.css';
import { BookOpen, Users, ClipboardList } from 'lucide-react';

export default function Dashboard() {
  // Demo stat values; replace with real data as needed
  const stats = [
    { label: 'Total Courses', value: 12, icon: <BookOpen size={32} /> },
    { label: 'Total Students', value: 240, icon: <Users size={32} /> },
    { label: 'Total Enrollments', value: 482, icon: <ClipboardList size={32} /> },
  ];

  // Demo table data; replace with real API data as needed
  const coursesByDept = [
    { dept: 'Computer Science', count: 5 },
    { dept: 'Mathematics', count: 3 },
    { dept: 'Physics', count: 4 },
  ];
  const recentCourses = [
    { code: 'CS101', title: 'Intro to CS', credits: 3 },
    { code: 'MATH201', title: 'Calculus II', credits: 4 },
  ];
  const recentStudents = [
    { id: 'S001', name: 'Alice', major: 'CS', year: '2' },
    { id: 'S002', name: 'Bob', major: 'Math', year: '1' },
  ];

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
