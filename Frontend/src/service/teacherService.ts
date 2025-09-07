import axiosInstance from '../config/axiosInstance';
import { User } from '../types'; // 1. Import the User type

// Define the function to get unapproved students
export const getUnapprovedStudents = async (): Promise<User[]> => { // 2. Set the return type
    const response = await axiosInstance.get('/teacher/unapproved-students');
    return response.data;
};

// Define the function to approve a student
export const approveStudent = async (studentId: string) => {
    const response = await axiosInstance.patch(`/teacher/approve-student/${studentId}`);
    return response.data;
};

// Define the function to get approved students
export const getApprovedStudents = async (): Promise<User[]> => { // 3. Set the return type here as well
    const response = await axiosInstance.get('/teacher/approved-students');
    return response.data;
};