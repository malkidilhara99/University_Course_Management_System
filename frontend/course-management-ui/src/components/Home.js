import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import { BookOpen, Users, ClipboardList } from 'lucide-react';

export default function Home(){
  return (
  <div className="home-root">
    <section className="hero">
  {/* decorative blobs behind hero */}
  <div className="decor-blob decor-blob-1" aria-hidden={true}></div>
  <div className="decor-blob decor-blob-2" aria-hidden={true}></div>
      <div className="hero-inner">
        <h1>Welcome to University Course Management System</h1>
        <p className="hero-sub">An enterprise-grade platform to manage courses, student records, registrations, and academic workflows.</p>

        <div className="hero-actions">
          <Link to="/dashboard" className="btn primary hero-btn"><BookOpen size={18} style={{marginRight:10}}/> Explore Courses</Link>
          <Link to="/students" className="btn success hero-btn"><Users size={18} style={{marginRight:10}}/> View Students</Link>
        </div>
      </div>
    </section>
  <div className="decor-divider" aria-hidden={true}></div>
    
    <section className="features">
      <div className="feature">
        <div className="feature-ico"><BookOpen /></div>
        <h3>Course Catalog &amp; Scheduling</h3>
        <p>Create and organize course offerings, set credits, and manage departments and schedules.</p>
        <div className="feature-cta"><Link to="/dashboard" className="btn outline">Explore Courses</Link></div>
      </div>

      <div className="feature">
        <div className="feature-ico"><Users /></div>
        <h3>Student Records</h3>
        <p>Maintain student profiles, academic histories, and program details in one place.</p>
        <div className="feature-cta"><Link to="/students" className="btn outline success">View Students</Link></div>
      </div>

      <div className="feature">
        <div className="feature-ico"><ClipboardList /></div>
        <h3>Enrollment &amp; Registration</h3>
        <p>Manage registrations, enrollment status, waitlists, and class rosters efficiently.</p>
        <div className="feature-cta"><Link to="/enrollments" className="btn outline warning">Manage Enrollments</Link></div>
      </div>
    </section>
    
   
  </div>
  )
}
