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
// frontend/src/types/index.ts

// Frontend/src/types/index.ts

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  rollNo?: string;
  isApproved: boolean; // 👈 Add this line
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
    success: boolean;
    message: string;
}
export interface AttendanceData {
  [date: string]: {
    [studentId: string]: 'present' | 'absent';
  };
}
