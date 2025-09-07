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
    _id: string;
    name: string;
    email: string;
    rollNo?: string; // Make rollNo optional
    role: 'student' | 'teacher' | 'admin';
    isApproved: boolean;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface AttendanceData {
  [date: string]: {
    [studentId: string]: 'present' | 'absent';
  };
}
