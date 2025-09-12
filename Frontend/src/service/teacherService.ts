import axiosInstance from '../config/axiosInstance';
import { User } from '../types';

export const getUnapprovedStudents = async (): Promise<User[]> => {
    const response = await axiosInstance.get('/teacher/unapproved-students');
    return response.data;
};

export const getApprovedStudents = async (): Promise<User[]> => {
    const response = await axiosInstance.get('/teacher/approved-students');
    return response.data;
};

export const approveStudent = async (studentId: string): Promise<{ success: boolean, message: string, student: User }> => {
    const response = await axiosInstance.patch(`/teacher/approve-student/${studentId}`);
    return response.data;
};

export const getAttendance = async (): Promise<any[]> => {
    const response = await axiosInstance.get('/teacher/attendance');
    return response.data;
}

// FIX: Update this function to use axios and send the correct data structure
export const saveAttendance = async (date: string, records: { studentId: string; status: 'present' | 'absent' }[]): Promise<any> => {
    const response = await axiosInstance.post('/teacher/attendance', { date, records });
    return response.data;
}