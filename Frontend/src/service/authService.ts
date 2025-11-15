import axiosInstance from '../config/axiosInstance';

// Define the structure of the data you expect from the login API
interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher';
    rollNo?: string;
  };
}

export const loginUser = async (email: string, password: string) => {
    // Tell Axios to expect the LoginResponse shape
    const response = await axiosInstance.post<LoginResponse>('/auth/login', { email, password });
    return response;
};

export const registerUser = async (userData: object) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
};

// REMOVED verifyOtp function