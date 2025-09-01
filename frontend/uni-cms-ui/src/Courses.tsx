import { useEffect, useState } from "react";
import { api } from "./api";
import type { Course } from "./types";

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<Course>({ code: "", title: "", credits: 3 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => api.listCourses().then(setCourses).catch((e) => setError(String(e)));

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        // update existing
        await fetch(`http://localhost:8080/api/courses/${editingId}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ ...form }) });
        setEditingId(null);
      } else {
        await api.createCourse(form);
      }
      setForm({ code: "", title: "" });
      load();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    }
  };

  const remove = async (id?: number) => {
    if (!id) return;
    try {
      await api.deleteCourse(id);
      load();
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError(String(e));
    }
  };

  const edit = (c: Course) => {
    setEditingId(c.id ?? null);
    setForm({ code: c.code, title: c.title, credits: c.credits ?? 3 });
  };

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: "0 16px" }}>
      <h1>Courses</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <form onSubmit={submit} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <button type="submit">Add</button>
      </form>

      <table width="100%" cellPadding={6} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Code</th>
            <th align="left">Title</th>
            <th align="left">Credits</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id} style={{ borderTop: "1px solid #ddd" }}>
              <td>{c.code}</td>
              <td>{c.title}</td>
              <td>{c.credits ?? 3}</td>
              <td align="center">
                <button onClick={() => edit(c)}>Edit</button>
                <button onClick={() => remove(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {courses.length === 0 && (
            <tr>
              <td colSpan={3}>No courses yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
