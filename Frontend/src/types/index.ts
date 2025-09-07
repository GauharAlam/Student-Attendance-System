export interface Student {
  id: string;
  name: string;
  rollNo: string;
  email: string;
}

export interface AttendanceRecord {
  studentId: string;
  date: string;
  status: 'present' | 'absent';
}

export interface User {
  id: string;
  email: string;
  role: 'teacher' | 'student';
  name: string;
}

export interface AttendanceData {
  [date: string]: {
    [studentId: string]: 'present' | 'absent';
  };
}