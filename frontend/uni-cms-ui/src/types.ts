export type Student = {
  id?: number;
  indexNo: string;
  fullName: string;
  email?: string;
};

export type Course = {
  id?: number;
  code: string;
  title: string;
  credits?: number;
};

export type Enrollment = {
  id?: number;
  student: {
    id?: number;
    indexNo: string;
    fullName: string;
  };
  course: {
    id?: number;
    code: string;
    title: string;
  };
  semester?: string;
  internalMarks?: number;
  finalMarks?: number;
};

export type Result = {
  id?: number;
  enrollment: Enrollment;
  marks?: number;
  grade?: string;
  remarks?: string;
};
