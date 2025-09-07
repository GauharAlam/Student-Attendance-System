import axiosInstance from "@/config/axiosInstance";

interface Student {
  _id: string;
  name: string;
  email: string;
}

export const getUnapprovedStudents = async (): Promise<Student[]> => {
  try {
    const response = await axiosInstance.get<Student[]>("/teacher/unapproved-students");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch students");
  }
};

export const approveStudent = async (studentId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axiosInstance.put(`/teacher/approve-student/${studentId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to approve student");
  }
};