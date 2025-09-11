import axiosInstance from '../config/axiosInstance';

export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent';
}

export const getStudentAttendance = async (): Promise<AttendanceRecord[]> => {
  const { data } = await axiosInstance.get('/student/attendance');
  console.log(data+"Hello data");
  
  return data;
};