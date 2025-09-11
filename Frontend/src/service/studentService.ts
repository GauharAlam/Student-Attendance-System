import axiosInstance from '../config/axiosInstance';

export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent';
}

export const getStudentAttendance = async (): Promise<AttendanceRecord[]> => {
  const { data } = await axiosInstance.get('/api/student/attendance');
  return data;
};