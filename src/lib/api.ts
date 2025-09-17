import axios from "axios";
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface GetCoursesParams {
  page?: number;
  limit?: number;
}

// All Get Courses with pagination
export async function getCourses({
  page = 1,
  limit = 10,
}: GetCoursesParams = {}) {
  try {
    const res = await api.get(`/class?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
}

// All Get trips with pagination
export async function getTrips({
  page = 1,
  limit = 10,
}: GetCoursesParams = {}) {
  try {
    const res = await api.get(`/trip/all?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
}

// single Trip delete
export const deleteTrip = async (id: string | number) => {
  try {
    const res = await api.delete(`/trip/${id}`);
    return res.data;
  } catch (error) {
    console.error("Failed to delete trip:", error);
    throw error;
  }
};

// Single create Trip
export const createTrip = async (tripData: FormData) => {
  try {
    const res = await api.post("/trip/create", tripData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to create trip:", error);
    throw error;
  }
};

// single Trip Get
export const getSingleTrip = async (id: string) => {
  try {
    const res = await api.get(`/trip/${id}`);
    return res.data;
  } catch (error) {
    console.error("Failed to Single trip:", error);
    throw error;
  }
};

// single Trip Update
export const updateSingleTrip = async (id: string, updatedData: FormData) => {
  try {
    const res = await api.put(`/trip/${id}`, updatedData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to update trip:", error);
    throw error;
  }
};

// types.ts (optional - better typing)
export interface GetProductsParams {
  page?: number;
  limit?: number;
}

// All Get products with pagination
export async function getProducts({
  page = 1,
  limit = 10,
}: GetProductsParams = {}) {
  try {
    const res = await api.get(`/product`, {
      params: { page, limit },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

// single product delete
interface ApiResponse {
  success: boolean;
  message: string;
}
export const deleteProduct = async (
  id: string | number
): Promise<ApiResponse> => {
  try {
    const res = await api.delete<ApiResponse>(`/product/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw error;
  }
};

// Single create Product
export const createProduct = async (productData: FormData) => {
  try {
    const res = await api.post("/product/create", productData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to create product:", error);
    throw error;
  }
};

// single product Get
export const getSingleProduct = async (id: string) => {
  try {
    const res = await api.get(`/product/${id}`);
    return res.data;
  } catch (error) {
    console.error("Failed to Single product:", error);
    throw error;
  }
};

// single Product Update
export const updateSingleProduct = async (
  id: string,
  updatedData: FormData
) => {
  try {
    const res = await api.put(`/product/update/${id}`, updatedData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to update Product:", error);
    throw error;
  }
};

// forgot password with email
export const postForgotPassword = async (email: { email: string }) => {
  const res = await api.post(`/auth/forgot-password`, email);
  return res.data;
};

// reset password in forgatepassword
export const postResetPassword = async (
  newPassword: { newPassword: string },
  token: string
) => {
  try {
    const res = await api.post("/auth/reset-password", newPassword, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch {
    throw new Error("Failed to reset password");
  }
};

// Get All User
export const getAllUser = async () => {
  try {
    const res = await api.get(`/user/all-users`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch all users:", error);
    throw error;
  }
};

// Get All User Conversation 
export const getUserConversation = async () => {
  try {
    const res = await api.get(`/conversation`);
    // backend returns { success, data }
    return res.data.data; 
  } catch (error) {
    console.error("Error fetching conversations", error);
    return [];
  }
};

// Get all admin id
export const getAdminId = async () => {
  try {
    const res = await api.get(`/user/admin_id`);
    return res.data;
  } catch {
    console.log("Error fetching admin id");
  }
};
