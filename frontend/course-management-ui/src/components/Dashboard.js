import React from 'react';
import './Dashboard.css';
import CourseList from './CourseList';
import CourseFillForm from './CourseFillForm';

export default function Dashboard(){
  function handleCreated(course){
    console.log('course created', course);
    // Could trigger a refresh via event or state in a real app
  }

  return (
    <div className="dash-root container">
      <div className="dash-header">
        <div>
          <h2>Dashboard</h2>
          <div className="muted">Overview of University Course Management System</div>
        </div>
      </div>

      <div className="grid cols-3">
        <div className="card">
          <div style={{fontSize:18,fontWeight:700}}>Courses</div>
          <div className="stat-value">12</div>
        </div>
        <div className="card">
          <div style={{fontSize:18,fontWeight:700}}>Students</div>
          <div className="stat-value">240</div>
        </div>
        <div className="card">
          <div style={{fontSize:18,fontWeight:700}}>Enrollments</div>
          <div className="stat-value">482</div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns: '1fr 420px', gap:18, marginTop:20}}>
        <CourseList onSelect={(c)=>console.log('selected',c)} />
        <CourseFillForm onCreated={handleCreated} />
      </div>
    </div>
  )
}
