import { useEffect, useState } from "react";
import { api } from "./api";
import type { Result } from "./types";

export default function Results() {
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = () => api.listResults().then(setResults).catch((e) => setError(String(e)));

  useEffect(() => { load(); }, []);

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: "0 16px" }}>
      <h1>Results</h1>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <table width="100%" cellPadding={6} style={{ borderCollapse: 'collapse' }}>
        <thead><tr><th>Student</th><th>Course</th><th>Marks</th><th>Grade</th><th>Remarks</th></tr></thead>
        <tbody>
          {results.map(r=> (
            <tr key={r.id} style={{ borderTop: '1px solid #ddd' }}>
              <td>{r.enrollment.student.indexNo} - {r.enrollment.student.fullName}</td>
              <td>{r.enrollment.course.code} - {r.enrollment.course.title}</td>
              <td>{r.marks}</td>
              <td>{r.grade}</td>
              <td>{r.remarks}</td>
            </tr>
          ))}
          {results.length===0 && <tr><td colSpan={5}>No results yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
