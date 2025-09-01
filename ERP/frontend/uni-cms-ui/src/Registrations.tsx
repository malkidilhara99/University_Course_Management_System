import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "./api";
import type { Enrollment, Student, Course } from "./types";

export default function Registrations() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [form, setForm] = useState({ studentId: 0, courseId: 0, semester: "2025S" });
  const [marks, setMarks] = useState<{ internalMarks?: number; finalMarks?: number }>({});
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    api.listStudents().then(setStudents).catch((e) => setError(String(e)));
    api.listCourses().then(setCourses).catch((e) => setError(String(e)));
    api.listEnrollments().then(setEnrollments).catch((e) => setError(String(e)));
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // basic client-side validation
    if (!form.studentId || !form.courseId) {
      const msg = "Please select a student and a course.";
      setError(msg);
      toast.error(msg);
      return;
    }
    try {
      await api.createEnrollment(form.studentId, form.courseId, form.semester, marks.internalMarks, marks.finalMarks);
      toast.success("Enrollment created");
      load();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message); else setError(String(err));
      toast.error(String(err));
    }
  };

  const remove = async (id?: number) => {
    if (!id) return;
    try {
      await api.deleteEnrollment(id);
      load();
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message); else setError(String(e));
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: "0 16px" }}>
      <h1>Registrations</h1>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

  <form onSubmit={submit} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <select value={form.studentId} onChange={e=>setForm({...form, studentId: Number(e.target.value)})}>
          <option value={0}>Select student</option>
          {students.map(s=> <option key={s.id} value={s.id}>{s.indexNo} - {s.fullName}</option>)}
        </select>
        <select value={form.courseId} onChange={e=>setForm({...form, courseId: Number(e.target.value)})}>
          <option value={0}>Select course</option>
          {courses.map(c=> <option key={c.id} value={c.id}>{c.code} - {c.title}</option>)}
        </select>
  <input value={form.semester} onChange={e=>setForm({...form, semester: e.target.value})} />
  <input placeholder="Internal" value={marks.internalMarks ?? ''} onChange={e=>setMarks({...marks, internalMarks: e.target.value?Number(e.target.value):undefined})} style={{width:80}} />
  <input placeholder="Final" value={marks.finalMarks ?? ''} onChange={e=>setMarks({...marks, finalMarks: e.target.value?Number(e.target.value):undefined})} style={{width:80}} />
  <button type="submit">Register</button>
      </form>

      <table width="100%" cellPadding={6} style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Student</th>
            <th>Course</th>
            <th>Semester</th>
            <th>Internal</th>
            <th>Final</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map(en => (
            <tr key={en.id} style={{ borderTop: '1px solid #ddd' }}>
              <td>{en.student.indexNo} - {en.student.fullName}</td>
              <td>{en.course.code} - {en.course.title}</td>
              <td>{en.semester}</td>
              <td style={{ textAlign: 'center' }}>{en.internalMarks ?? '-'}</td>
              <td style={{ textAlign: 'center' }}>{en.finalMarks ?? '-'}</td>
              <td align="center"><button onClick={() => remove(en.id)}>Delete</button></td>
            </tr>
          ))}
          {enrollments.length === 0 && <tr><td colSpan={6}>No registrations yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
