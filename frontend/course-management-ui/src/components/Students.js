import React, { useState } from 'react';
import StudentList from './StudentList';
import StudentForm from './StudentForm';
import StudentGrades from './StudentGrades';
import Modal from './Modal';
import './Students.css';

export default function Students(){
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  function onStudentCreated(){
    setRefreshKey(k => k + 1);
    setModalOpen(false);
  }

  return (
    <div className="students-page">
      <h2>Students</h2>
      <div className="students-grid">
        <div className="students-col">
          <button className="open-modal-btn" onClick={()=>setModalOpen(true)}>+ Add Student</button>
          <Modal open={modalOpen} onClose={()=>setModalOpen(false)}>
            <StudentForm onCreated={onStudentCreated} />
          </Modal>
          <StudentList onSelect={setSelectedStudent} refreshKey={refreshKey} />
        </div>
        <div className="students-col grades-col">
          <StudentGrades studentId={selectedStudent?.id} />
        </div>
      </div>
    </div>
  );
}
