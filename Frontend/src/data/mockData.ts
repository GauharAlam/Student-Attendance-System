import { Student, User, AttendanceData } from '../types';

export const mockStudents: Student[] = [
  { id: '1', name: 'Alice Johnson', rollNo: 'CS001', email: 'alice@school.edu' },
  { id: '2', name: 'Bob Smith', rollNo: 'CS002', email: 'bob@school.edu' },
  { id: '3', name: 'Charlie Brown', rollNo: 'CS003', email: 'charlie@school.edu' },
  { id: '4', name: 'Diana Prince', rollNo: 'CS004', email: 'diana@school.edu' },
  { id: '5', name: 'Edward Wilson', rollNo: 'CS005', email: 'edward@school.edu' },
  { id: '6', name: 'Fiona Davis', rollNo: 'CS006', email: 'fiona@school.edu' },
  { id: '7', name: 'George Miller', rollNo: 'CS007', email: 'george@school.edu' },
  { id: '8', name: 'Hannah Lee', rollNo: 'CS008', email: 'hannah@school.edu' },
];

export const mockUsers: User[] = [
  { id: 'teacher1', email: 'teacher@school.edu', role: 'teacher', name: 'John Teacher' },
  { id: 'student1', email: 'student@school.edu', role: 'student', name: 'Jane Student' },
];

// Mock attendance data for the past 30 days
export const generateMockAttendance = (): AttendanceData => {
  const attendance: AttendanceData = {};
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    attendance[dateStr] = {};
    
    mockStudents.forEach(student => {
      // Simulate realistic attendance (85% chance of being present)
      const isPresent = Math.random() > 0.15;
      attendance[dateStr][student.id] = isPresent ? 'present' : 'absent';
    });
  }
  
  return attendance;
};

export const mockAttendanceData = generateMockAttendance();