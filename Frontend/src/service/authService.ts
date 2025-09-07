import axiosInstance from "@/config/axiosInstance";

interface userData {
  name: string;
  email: string;
  password: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export const registerUser = async (data: userData): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post<ApiResponse>("/auth/register", data);
    return response.data;
  } catch (error: any) {
    // normalize error
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const loginUser = async (data: userData): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post<ApiResponse>("/auth/login", data);
    return response.data;
  } catch (error: any) {
    // normalize error
    throw new Error(error.response?.data?.message || "login failed");
  }
};
