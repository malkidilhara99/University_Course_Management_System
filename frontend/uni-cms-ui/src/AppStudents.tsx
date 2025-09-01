import { useEffect, useState } from "react";
import { api } from "./api";
import type { Student } from "./types";

export default function StudentsView() {
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState<Student>({ indexNo: "", fullName: "", email: "" });
  const [error, setError] = useState<string | null>(null);

  const load = () => api.listStudents().then(setStudents).catch((e) => setError(String(e)));

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.createStudent(form);
      setForm({ indexNo: "", fullName: "", email: "" });
      load();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    }
  };

  const remove = async (id?: number) => {
    if (!id) return;
    try {
      await api.deleteStudent(id);
      load();
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError(String(e));
    }
  };

  return (
    <div>
      <h1>Students</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <form onSubmit={submit} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input placeholder="Index No" value={form.indexNo} onChange={(e) => setForm({ ...form, indexNo: e.target.value })} />
        <input placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <button type="submit">Add</button>
      </form>

      <table width="100%" cellPadding={6} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Index</th>
            <th align="left">Name</th>
            <th align="left">Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id} style={{ borderTop: "1px solid #ddd" }}>
              <td>{s.indexNo}</td>
              <td>{s.fullName}</td>
              <td>{s.email}</td>
              <td align="center">
                <button onClick={() => remove(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan={4}>No students yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
