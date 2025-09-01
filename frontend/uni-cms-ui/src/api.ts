import type { Student } from "../src/types";
import type { Course } from "../src/types";
import type { Enrollment } from "../src/types";
import type { Result } from "../src/types";

const BASE = "http://localhost:8080/api";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.status === 204 ? (undefined as unknown as T) : await res.json();
}

export const api = {
  listStudents: () => http<Student[]>("/students"),
  createStudent: (s: Student) =>
    http<Student>("/students", { method: "POST", body: JSON.stringify(s) }),
  deleteStudent: (id: number) =>
    http<void>(`/students/${id}`, { method: "DELETE" }),
  // Courses
  listCourses: () => http<Course[]>("/courses"),
  createCourse: (c: Course) =>
  http<Course>("/courses", { method: "POST", body: JSON.stringify(c) }),
  deleteCourse: (id: number) => http<void>(`/courses/${id}`, { method: "DELETE" }),
  // Enrollments
  listEnrollments: () => http<Enrollment[]>("/enrollments"),
  createEnrollment: (studentId: number, courseId: number, semester: string, internalMarks?: number, finalMarks?: number) =>
    http<Enrollment>(`/enrollments?studentId=${studentId}&courseId=${courseId}&semester=${encodeURIComponent(semester)}${internalMarks!=null?`&internalMarks=${internalMarks}`:''}${finalMarks!=null?`&finalMarks=${finalMarks}`:''}`, { method: "POST" }),
  deleteEnrollment: (id: number) => http<void>(`/enrollments/${id}`, { method: "DELETE" }),
  // Results
  listResults: () => http<Result[]>("/results"),
  createResult: (enrollmentId: number, marks: number, grade: string, remarks?: string) =>
    http<Result>(`/results?enrollmentId=${enrollmentId}&marks=${marks}&grade=${encodeURIComponent(grade)}${remarks ? `&remarks=${encodeURIComponent(remarks)}` : ''}`, { method: "POST" }),
  updateResult: (id: number, marks: number, grade: string, remarks?: string) =>
    http<Result>(`/results/${id}?marks=${marks}&grade=${encodeURIComponent(grade)}${remarks ? `&remarks=${encodeURIComponent(remarks)}` : ''}`, { method: "PUT" }),
};
