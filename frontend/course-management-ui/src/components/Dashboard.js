import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  ClipboardList, 
  TrendingUp, 
  Calendar, 
  Award, 
  Activity,
  PlusCircle,
  ArrowRight,
  Star,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
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
  const [recentActivity, setRecentActivity] = useState([]);
  const [enrollmentStats, setEnrollmentStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('STUDENT');

  useEffect(() => {
    // Get user role from localStorage
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setUserRole(user?.role || 'STUDENT');
    } catch (error) {
      setUserRole('STUDENT');
    }

    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      // Fetch dashboard stats
      try {
        const statsRes = await fetch(`${API_BASE}/api/dashboard/stats`, { headers });
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats([
            { 
              label: 'Total Courses', 
              value: data.totalCourses || 0, 
              icon: <BookOpen size={28} />, 
              color: 'from-blue-500 to-blue-600',
              change: data.courseGrowth || '+0%'
            },
            { 
              label: 'Total Students', 
              value: data.totalStudents || 0, 
              icon: <Users size={28} />, 
              color: 'from-green-500 to-green-600',
              change: data.studentGrowth || '+0%'
            },
            { 
              label: 'Active Enrollments', 
              value: data.totalEnrollments || 0, 
              icon: <ClipboardList size={28} />, 
              color: 'from-purple-500 to-purple-600',
              change: data.enrollmentGrowth || '+0%'
            },
            { 
              label: 'Completion Rate', 
              value: `${data.completionRate || 0}%`, 
              icon: <TrendingUp size={28} />, 
              color: 'from-orange-500 to-orange-600',
              change: data.completionGrowth || '+0%'
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Set default stats if API fails
        setStats([
          { 
            label: 'Total Courses', 
            value: 0, 
            icon: <BookOpen size={28} />, 
            color: 'from-blue-500 to-blue-600',
            change: '+0%'
          },
          { 
            label: 'Total Students', 
            value: 0, 
            icon: <Users size={28} />, 
            color: 'from-green-500 to-green-600',
            change: '+0%'
          },
          { 
            label: 'Active Enrollments', 
            value: 0, 
            icon: <ClipboardList size={28} />, 
            color: 'from-purple-500 to-purple-600',
            change: '+0%'
          },
          { 
            label: 'Completion Rate', 
            value: '0%', 
            icon: <TrendingUp size={28} />, 
            color: 'from-orange-500 to-orange-600',
            change: '+0%'
          },
        ]);
      }

      // Fetch other dynamic data
      const [coursesRes, studentsRes, enrollmentStatsRes, activityRes, deptRes] = await Promise.allSettled([
        fetch(`${API_BASE}/api/courses`, { headers }),
        fetch(`${API_BASE}/api/students`, { headers }),
        fetch(`${API_BASE}/api/dashboard/enrollment-stats`, { headers }),
        fetch(`${API_BASE}/api/dashboard/recent-activity`, { headers }),
        fetch(`${API_BASE}/api/dashboard/courses-by-department`, { headers })
      ]);

      // Process courses data
      if (coursesRes.status === 'fulfilled' && coursesRes.value.ok) {
        const courses = await coursesRes.value.json();
        setRecentCourses(courses.slice(0, 5));
      }

      // Process students data
      if (studentsRes.status === 'fulfilled' && studentsRes.value.ok) {
        const students = await studentsRes.value.json();
        setRecentStudents(students.slice(0, 5));
      }

      // Process enrollment stats
      if (enrollmentStatsRes.status === 'fulfilled' && enrollmentStatsRes.value.ok) {
        const enrollmentStatsData = await enrollmentStatsRes.value.json();
        setEnrollmentStats(enrollmentStatsData);
      }

      // Process recent activity
      if (activityRes.status === 'fulfilled' && activityRes.value.ok) {
        const activityData = await activityRes.value.json();
        setRecentActivity(activityData);
      }

      // Process courses by department
      if (deptRes.status === 'fulfilled' && deptRes.value.ok) {
        const deptData = await deptRes.value.json();
        setCoursesByDept(deptData);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  function handleCourseCreated() {
    setCourseModalOpen(false);
    // Optionally refresh course data here
  }

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="dashboard-title">
              <Activity className="title-icon" />
              Dashboard
            </h1>
            <p className="dashboard-subtitle">
              Welcome back! Here's what's happening at your university
            </p>
          </div>
          <div className="header-actions">
            <div className="welcome-card">
              <Calendar className="calendar-icon" />
              <div>
                <p className="date-text">{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
                <p className="time-text">{new Date().toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="stats-container">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={stat.label} className="stat-card modern" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className={`stat-background bg-gradient-to-r ${stat.color}`}></div>
                  <div className="stat-content">
                    <div className="stat-header">
                      <div className="stat-icon-wrapper">
                        {stat.icon}
                      </div>
                      <div className="stat-change">
                        <TrendingUp className="change-icon" />
                        <span>{stat.change}</span>
                      </div>
                    </div>
                    <div className="stat-main">
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3 className="section-title">Quick Actions</h3>
            <div className="actions-grid">
              <button 
                className={`action-card ${userRole === 'STUDENT' ? 'restricted' : ''}`} 
                onClick={() => {
                  if (userRole === 'STUDENT') {
                    alert('Course creation is restricted for students. Contact your administrator.');
                  } else {
                    setCourseModalOpen(true);
                  }
                }}
              >
                <PlusCircle className="action-icon" />
                <span>Add New Course</span>
                {userRole === 'STUDENT' && <span className="restriction-note">Admin Only</span>}
                <ArrowRight className="arrow-icon" />
              </button>
              <button className="action-card" onClick={() => window.location.href = '/students'}>
                <Users className="action-icon" />
                <span>Manage Students</span>
                <ArrowRight className="arrow-icon" />
              </button>
              <button className="action-card" onClick={() => window.location.href = '/enrollments'}>
                <ClipboardList className="action-icon" />
                <span>View Enrollments</span>
                <ArrowRight className="arrow-icon" />
              </button>
            </div>
          </div>

          {/* Content Sections */}
          <div className="dashboard-content">
            {/* Enrollment Overview */}
            <div className="content-section enrollment-overview">
              <div className="section-header">
                <h3 className="section-title">
                  <ClipboardList className="section-icon" />
                  Enrollment Overview
                </h3>
                <span className="section-subtitle">Current enrollment statistics</span>
              </div>
              <div className="enrollment-stats">
                <div className="enrollment-stat">
                  <div className="enrollment-stat-icon active">
                    <CheckCircle />
                  </div>
                  <div className="enrollment-stat-content">
                    <span className="enrollment-stat-value">{enrollmentStats.active || 0}</span>
                    <span className="enrollment-stat-label">Active</span>
                  </div>
                </div>
                <div className="enrollment-stat">
                  <div className="enrollment-stat-icon completed">
                    <Award />
                  </div>
                  <div className="enrollment-stat-content">
                    <span className="enrollment-stat-value">{enrollmentStats.completed || 0}</span>
                    <span className="enrollment-stat-label">Completed</span>
                  </div>
                </div>
                <div className="enrollment-stat">
                  <div className="enrollment-stat-icon pending">
                    <Clock />
                  </div>
                  <div className="enrollment-stat-content">
                    <span className="enrollment-stat-value">{enrollmentStats.pending || 0}</span>
                    <span className="enrollment-stat-label">Pending</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="content-section recent-activity">
              <div className="section-header">
                <h3 className="section-title">
                  <Clock className="section-icon" />
                  Recent Activity
                </h3>
                <span className="section-subtitle">Latest updates and changes</span>
              </div>
              <div className="activity-list">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className={`activity-icon ${activity.icon}`}>
                        {activity.icon === 'new-course' && <BookOpen />}
                        {activity.icon === 'new-student' && <Users />}
                        {activity.icon === 'enrollment' && <ClipboardList />}
                      </div>
                      <div className="activity-content">
                        <p className="activity-text">{activity.text}</p>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="activity-item">
                    <div className="activity-icon new-course">
                      <BookOpen />
                    </div>
                    <div className="activity-content">
                      <p className="activity-text">Welcome to the dashboard</p>
                      <span className="activity-time">Recently</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Courses by Department */}
            <div className="content-section">
              <div className="section-header">
                <h3 className="section-title">
                  <BookOpen className="section-icon" />
                  Courses by Department
                </h3>
                <span className="section-subtitle">Distribution across departments</span>
              </div>
              <div className="data-table-container">
                {coursesByDept.length > 0 ? (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Department</th>
                        <th>Courses</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coursesByDept.map((row, index) => {
                        const total = coursesByDept.reduce((sum, item) => sum + item.count, 0);
                        const percentage = total > 0 ? Math.round((row.count / total) * 100) : 0;
                        return (
                          <tr key={row.dept}>
                            <td>
                              <div className="department-cell">
                                <div className="department-color" style={{backgroundColor: `hsl(${index * 60}, 70%, 60%)`}}></div>
                                {row.dept}
                              </div>
                            </td>
                            <td className="count-cell">{row.count}</td>
                            <td>
                              <div className="percentage-cell">
                                <div className="percentage-bar">
                                  <div className="percentage-fill" style={{width: `${percentage}%`}}></div>
                                </div>
                                <span>{percentage}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-state">
                    <BookOpen className="empty-icon" />
                    <p>No courses available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Courses */}
            <div className="content-section">
              <div className="section-header">
                <h3 className="section-title">
                  <Star className="section-icon" />
                  Recent Courses
                </h3>
                <span className="section-subtitle">Latest course additions</span>
              </div>
              <div className="data-table-container">
                {recentCourses.length > 0 ? (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Title</th>
                        <th>Credits</th>
                        <th>Department</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentCourses.map(course => (
                        <tr key={course.id || course.code}>
                          <td className="code-cell">{course.code}</td>
                          <td className="title-cell">{course.title}</td>
                          <td className="credits-cell">
                            <span className="credits-badge">{course.credits}</span>
                          </td>
                          <td>{course.department || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-state">
                    <BookOpen className="empty-icon" />
                    <p>No recent courses</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Students */}
            <div className="content-section">
              <div className="section-header">
                <h3 className="section-title">
                  <Users className="section-icon" />
                  Recent Students
                </h3>
                <span className="section-subtitle">Latest student registrations</span>
              </div>
              <div className="data-table-container">
                {recentStudents.length > 0 ? (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Major</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentStudents.map(student => (
                        <tr key={student.id}>
                          <td className="id-cell">{student.studentId || student.id}</td>
                          <td className="name-cell">
                            <div className="student-name">
                              {student.firstName} {student.lastName}
                            </div>
                          </td>
                          <td>{student.major || 'Undeclared'}</td>
                          <td>
                            <span className="status-badge active">Active</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-state">
                    <Users className="empty-icon" />
                    <p>No recent students</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Course Modal */}
      <Modal open={courseModalOpen} onClose={() => setCourseModalOpen(false)}>
        <CourseFillForm onCreated={handleCourseCreated} />
      </Modal>
    </div>
  );
}
