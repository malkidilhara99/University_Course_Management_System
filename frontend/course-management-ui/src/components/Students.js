import React, { useState } from 'react';
import StudentList from './StudentList';
import StudentForm from './StudentForm';
import StudentGrades from './StudentGrades';
import './Students.css';

export default function Students(){
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function onStudentCreated(){
    setRefreshKey(k => k + 1);
  }

  return (
    <div className="students-page">
      <h2>Students</h2>
      <div className="students-grid">
        <div className="students-col">
          <StudentForm onCreated={onStudentCreated} />
          <StudentList onSelect={setSelectedStudent} refreshKey={refreshKey} />
        </div>
        <div className="students-col grades-col">
          <StudentGrades studentId={selectedStudent?.id} />
        </div>
      </div>
    </div>
  );
}
