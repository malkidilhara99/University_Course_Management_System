import React, { useState } from 'react';
import CourseList from './CourseList';
import CourseFillForm from './CourseFillForm';
import Modal from './Modal';
import './Courses.css';

export default function Courses() {
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  function onCourseCreated() {
    setRefreshKey(k => k + 1);
    setModalOpen(false);
  }

  return (
    <div className="courses-page">
      <h2>Courses</h2>
      <button className="open-modal-btn" onClick={()=>setModalOpen(true)}>+ Add Course</button>
      <Modal open={modalOpen} onClose={()=>setModalOpen(false)}>
        <CourseFillForm onCreated={onCourseCreated} />
      </Modal>
      <div className="courses-list">
        <CourseList refreshKey={refreshKey} />
      </div>
    </div>
  );
}
