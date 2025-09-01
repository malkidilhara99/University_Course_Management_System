import React, { useEffect, useState } from 'react';
import './StudentGrades.css';
import API_BASE from '../api';

export default function StudentGrades({ studentId }){
  const [grades, setGrades] = useState([]);
  useEffect(()=>{
    if(!studentId) return;
    // fetch grades for the student
    (async ()=>{
      try{
  const res = await fetch(`${API_BASE}/api/students/${studentId}/grades`);
        if(!res.ok) throw new Error('no grades');
        const data = await res.json();
        setGrades(data);
      }catch(e){
        // sample data fallback
        setGrades([
          {course:'CS101', grade:'A'},
          {course:'MATH201', grade:'B+'}
        ]);
      }
    })();
  },[studentId]);

  if(!studentId) return <div className="grades-root card">Select a student to view grades</div>

  return (
    <div className="grades-root card">
      <h4>Grades</h4>
      <table className="grades-table">
        <thead><tr><th>Course</th><th>Grade</th></tr></thead>
        <tbody>
          {grades.map((g,i)=> (
            <tr key={i}><td>{g.course}</td><td>{g.grade}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
