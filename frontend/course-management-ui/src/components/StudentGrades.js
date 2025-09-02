import React, { useEffect, useState, useCallback } from 'react';
import './StudentGrades.css';
import { BookOpen, Award, TrendingUp, Calendar, BarChart3 } from 'lucide-react';

export default function StudentGrades({ studentId }) {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    averageGrade: 0,
    totalCourses: 0,
    highestGrade: 0,
    gpa: 0
  });

  // Helper function to determine semester from enrollment date
  const getSemesterFromDate = useCallback((dateString) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    
    if (month >= 1 && month <= 5) {
      return `Spring ${year}`;
    } else if (month >= 6 && month <= 8) {
      return `Summer ${year}`;
    } else {
      return `Fall ${year}`;
    }
  }, []);

  // Helper function to convert letter grades to approximate numerical points
  const convertGradeToPoints = useCallback((grade) => {
    const gradeMap = {
      'A+': 98, 'A': 95, 'A-': 92,
      'B+': 88, 'B': 85, 'B-': 82,
      'C+': 78, 'C': 75, 'C-': 72,
      'D+': 68, 'D': 65, 'D-': 62,
      'F': 50
    };
    return gradeMap[grade] || 0;
  }, []);

  const calculateStats = useCallback((gradesData) => {
    if (gradesData.length === 0) {
      setStats({ averageGrade: 0, totalCourses: 0, highestGrade: 0, gpa: 0 });
      return;
    }

    // Filter enrollments that have actual grades/scores
    const gradedEnrollments = gradesData.filter(g => 
      (g.score && g.score > 0) || (g.grade && g.grade !== 'N/A')
    );

    if (gradedEnrollments.length === 0) {
      setStats({ 
        averageGrade: 0, 
        totalCourses: gradesData.length, 
        highestGrade: 0, 
        gpa: 0 
      });
      return;
    }

    // Calculate average using scores if available, otherwise convert grades
    const totalPoints = gradedEnrollments.reduce((sum, g) => {
      if (g.score && g.score > 0) {
        return sum + g.score;
      } else if (g.grade) {
        // Convert letter grade to points (approximate)
        const gradePoints = convertGradeToPoints(g.grade);
        return sum + gradePoints;
      }
      return sum;
    }, 0);

    const averageGrade = totalPoints / gradedEnrollments.length;
    const highestGrade = Math.max(...gradedEnrollments.map(g => {
      if (g.score && g.score > 0) return g.score;
      return convertGradeToPoints(g.grade);
    }));
    
    // Simple GPA calculation (assuming 4.0 scale)
    const gpa = (averageGrade / 100) * 4.0;

    setStats({
      averageGrade: Math.round(averageGrade),
      totalCourses: gradesData.length,
      highestGrade: Math.round(highestGrade),
      gpa: Math.round(gpa * 100) / 100
    });
  }, [convertGradeToPoints]);

  const fetchGrades = useCallback(async () => {
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
      
      // Fetch enrollments for the student which contain grades
      const res = await fetch(`${API_BASE}/api/enrollments/student/${studentId}`, {
        method: 'GET',
        headers: headers
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch grades: ${res.status}`);
      }
      
      const enrollments = await res.json();
      
      // Transform enrollment data to grades format
      const gradesData = enrollments.map(enrollment => ({
        id: enrollment.id,
        course: enrollment.course?.title || enrollment.course?.name || 'Unknown Course',
        courseCode: enrollment.course?.code || '',
        grade: enrollment.grade || 'N/A',
        score: enrollment.score || null,
        credits: enrollment.course?.credits || enrollment.course?.creditHours || 3,
        enrollmentDate: enrollment.enrollmentDate,
        completionDate: enrollment.completionDate,
        status: enrollment.status,
        semester: getSemesterFromDate(enrollment.enrollmentDate)
      }));
      
      setGrades(gradesData);
      calculateStats(gradesData);
    } catch (error) {
      console.error('Error fetching grades:', error);
      setGrades([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  }, [studentId, getSemesterFromDate, calculateStats]);

  useEffect(() => {
    if (!studentId) return;
    fetchGrades();
  }, [studentId, fetchGrades]);

  function getGradeColor(grade) {
    // Handle numerical scores first
    if (typeof grade === 'number') {
      if (grade >= 90) return '#10b981'; // Green
      if (grade >= 80) return '#f59e0b'; // Yellow
      if (grade >= 70) return '#ef4444'; // Red
      return '#6b7280'; // Gray
    }
    
    // Handle letter grades
    if (typeof grade === 'string') {
      const gradeUpper = grade.toUpperCase();
      if (gradeUpper.startsWith('A')) return '#10b981'; // Green
      if (gradeUpper.startsWith('B')) return '#f59e0b'; // Yellow
      if (gradeUpper.startsWith('C')) return '#ef4444'; // Red
      if (gradeUpper.startsWith('D')) return '#6b7280'; // Gray
      if (gradeUpper === 'F') return '#dc2626'; // Dark red
    }
    
    // Default color for N/A or unknown grades
    return '#6b7280';
  }

  if (!studentId) {
    return (
      <div className="grades-placeholder">
        <BookOpen size={48} className="placeholder-icon" />
        <h4>Academic Performance</h4>
        <p>Select a student to view their grades and academic performance</p>
      </div>
    );
  }

  return (
    <div className="grades-modern">
      <div className="grades-header">
        <div className="header-icon">
          <Award size={20} />
        </div>
        <div>
          <h4>Academic Performance</h4>
          <p>Grades and academic statistics</p>
        </div>
      </div>

      {/* Academic Stats */}
      <div className="academic-stats">
        <div className="stat-item">
          <div className="stat-icon success">
            <TrendingUp size={16} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{stats.averageGrade}%</span>
            <span className="stat-label">Average</span>
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon primary">
            <BookOpen size={16} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{stats.totalCourses}</span>
            <span className="stat-label">Courses</span>
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon warning">
            <Award size={16} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{stats.gpa}</span>
            <span className="stat-label">GPA</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grades-loading">
          <div className="spinner-small"></div>
          <span>Loading grades...</span>
        </div>
      ) : (
        <div className="grades-content">
          {grades.length === 0 ? (
            <div className="empty-grades">
              <BarChart3 size={32} className="empty-icon" />
              <p>No grades recorded yet</p>
            </div>
          ) : (
            <div className="grades-list">
              {grades.map((grade, index) => (
                <div key={index} className="grade-item">
                  <div className="grade-info">
                    <h5 className="course-name">{grade.course}</h5>
                    <div className="course-meta">
                      <span className="credits">{grade.credits} Credits</span>
                      <span className="semester">
                        <Calendar size={12} />
                        {grade.semester}
                      </span>
                    </div>
                  </div>
                  <div className="grade-display">
                    <span 
                      className="grade-badge"
                      style={{ backgroundColor: getGradeColor(grade.grade) }}
                    >
                      {grade.grade}
                    </span>
                    {grade.score && (
                      <span className="grade-points">{grade.score}%</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
