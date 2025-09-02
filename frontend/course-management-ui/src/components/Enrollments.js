import React, { useState, useEffect } from 'react';
import './Enrollments.css';
import EnrollmentForm from './EnrollmentForm';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp,
  Calendar,
  Eye,
  Edit,
  Trash2,
  GraduationCap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showForm, setShowForm] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [stats, setStats] = useState({
    totalEnrollments: 0,
    activeEnrollments: 0,
    completedEnrollments: 0,
    averageGrade: 0
  });

  useEffect(() => {
    fetchEnrollments();
  }, []);

  async function fetchEnrollments() {
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

      const res = await fetch(`${API_BASE}/api/enrollments`, {
        method: 'GET',
        headers: headers
      });
      
      if (res.ok) {
        const data = await res.json();
        setEnrollments(data);
        calculateStats(data);
      } else {
        console.error('Failed to fetch enrollments:', res.status, res.statusText);
        setError('Failed to load enrollments from server.');
      }
    } catch (e) {
      console.error('Error fetching enrollments:', e);
      setError('Could not connect to server.');
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  }

  function calculateStats(enrollmentsData) {
    const totalEnrollments = enrollmentsData.length;
    const activeEnrollments = enrollmentsData.filter(e => e.status === 'ACTIVE' || e.status === 'ENROLLED').length;
    const completedEnrollments = enrollmentsData.filter(e => e.status === 'COMPLETED').length;
    
    // Calculate average grade for enrollments with grades
    const gradesArray = enrollmentsData
      .filter(e => e.grade && e.grade !== 'N/A' && e.grade !== null)
      .map(e => parseFloat(e.grade));
    
    const averageGrade = gradesArray.length > 0 
      ? gradesArray.reduce((sum, grade) => sum + grade, 0) / gradesArray.length 
      : 0;

    setStats({
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      averageGrade: averageGrade.toFixed(1)
    });
  }

  // Form handlers
  const handleAddEnrollment = () => {
    setEditingEnrollment(null);
    setShowForm(true);
  };

  const handleEditEnrollment = (enrollment) => {
    setEditingEnrollment(enrollment);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEnrollment(null);
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingEnrollment(null);
    fetchEnrollments(); // Refresh the list
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
      case 'ENROLLED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'COMPLETED':
        return <Award className="w-4 h-4 text-blue-500" />;
      case 'DROPPED':
      case 'WITHDRAWN':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
      case 'ENROLLED':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'DROPPED':
      case 'WITHDRAWN':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = searchTerm === '' || 
      (enrollment.student?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       enrollment.student?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       enrollment.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       enrollment.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       enrollment.course?.code?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === '' || enrollment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const uniqueStatuses = [...new Set(enrollments.map(e => e.status))].filter(Boolean);

  if (loading) {
    return (
      <div className="enrollments-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading enrollments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="enrollments-container">
      {/* Header */}
      <div className="enrollments-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="header-title">
              <GraduationCap className="header-icon" />
              Enrollment Management
            </h1>
            <p className="header-subtitle">Monitor student course enrollments and academic progress</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={handleAddEnrollment}>
              <Plus className="btn-icon" />
              New Enrollment
            </button>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-blue-500">
            <Users />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalEnrollments}</div>
            <div className="stat-label">Total Enrollments</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-green-500">
            <BookOpen />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.activeEnrollments}</div>
            <div className="stat-label">Active Enrollments</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-purple-500">
            <Award />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.completedEnrollments}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-orange-500">
            <TrendingUp />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.averageGrade || 'N/A'}</div>
            <div className="stat-label">Average Grade</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="enrollments-controls">
        <div className="search-filter-group">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search students, courses, or enrollment details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-box">
            <Filter className="filter-icon" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="">All Statuses</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="view-controls">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <Grid className="view-icon" />
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <List className="view-icon" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <AlertCircle className="error-icon" />
          <span>{error}</span>
          <button onClick={fetchEnrollments} className="retry-btn">Retry</button>
        </div>
      )}

      {/* Enrollments Content */}
      <div className="enrollments-content">
        {filteredEnrollments.length === 0 ? (
          <div className="empty-state">
            <GraduationCap className="empty-icon" />
            <h3>No Enrollments Found</h3>
            <p>
              {searchTerm || filterStatus 
                ? "No enrollments match your current filters. Try adjusting your search criteria."
                : "No enrollments have been created yet. Create your first enrollment to get started."}
            </p>
            <button className="btn btn-primary">
              <Plus className="btn-icon" />
              Create First Enrollment
            </button>
          </div>
        ) : (
          <div className={`enrollments-grid ${viewMode}`}>
            {filteredEnrollments.map(enrollment => (
              <div key={enrollment.id} className="enrollment-card">
                <div className="enrollment-header">
                  <div className="enrollment-status">
                    {getStatusIcon(enrollment.status)}
                    <span className={`status-badge ${getStatusColor(enrollment.status)}`}>
                      {enrollment.status || 'Unknown'}
                    </span>
                  </div>
                  <div className="enrollment-actions">
                    <button className="action-btn view" title="View Details">
                      <Eye className="action-icon" />
                    </button>
                    <button className="action-btn edit" title="Edit Enrollment" onClick={() => handleEditEnrollment(enrollment)}>
                      <Edit className="action-icon" />
                    </button>
                    <button className="action-btn delete" title="Remove Enrollment">
                      <Trash2 className="action-icon" />
                    </button>
                  </div>
                </div>

                <div className="enrollment-body">
                  <div className="student-info">
                    <h4 className="student-name">
                      {enrollment.student ? 
                        `${enrollment.student.firstName} ${enrollment.student.lastName}` : 
                        'Unknown Student'}
                    </h4>
                    <p className="student-email">
                      {enrollment.student?.email || 'No email available'}
                    </p>
                  </div>

                  <div className="course-info">
                    <h5 className="course-title">
                      {enrollment.course?.title || 'Unknown Course'}
                    </h5>
                    <p className="course-code">
                      {enrollment.course?.code || 'No code'}
                    </p>
                  </div>

                  <div className="enrollment-details">
                    <div className="detail-item">
                      <Calendar className="detail-icon" />
                      <span className="detail-label">Enrolled:</span>
                      <span className="detail-value">
                        {enrollment.enrollmentDate ? 
                          new Date(enrollment.enrollmentDate).toLocaleDateString() : 
                          'Unknown'}
                      </span>
                    </div>

                    {enrollment.grade && (
                      <div className="detail-item">
                        <Award className="detail-icon" />
                        <span className="detail-label">Grade:</span>
                        <span className="detail-value grade">
                          {enrollment.grade}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enrollment Form Modal */}
      {showForm && (
        <EnrollmentForm
          editingEnrollment={editingEnrollment}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
