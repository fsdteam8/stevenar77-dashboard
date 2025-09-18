import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for sending cookies
});

// Track token refresh state
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

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

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // If refresh is already in progress, queue this request
      if (isRefreshing) {
        try {
          const token = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );

        const newAccessToken = response.data.data.accessToken;

        if (newAccessToken) {
          // Update session token - this updates the session in memory
          const session = await getSession();
          if (session) {
            session.accessToken = newAccessToken;
          }

          // Process other requests waiting for the token
          processQueue(null, newAccessToken);

          // Update the current request's authorization header
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          isRefreshing = false;
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError as Error);
        isRefreshing = false;

        // Sign out user and redirect to login
        await signOut({ callbackUrl: "/auth/signin" });
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
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

// Get dashboard admin dashboard
export const getAdminDashboard = async () => {
  try {
    const res = await api.get(`/dashboard/admin-dashboard`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    throw error;
  }
};

// Get Dashboard Chart Data with dynamic year
export const getDashboardChartData = async (year: number) => {
  try {
    const res = await api.get(`/dashboard/chart-data?year=${year}`);
    return res.data;
  } catch (error) {
    console.log("Error fetching dashboard chart data:", error);
  }
};

// get all notifications
export const getNotifications = async (token: string) => {
  try {
    if (!token) {
      console.log("No access token available");
      return [];
    }

    const res = await api.get("/notifications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.log("Error fetching notifications:", error);
    return [];
  }
};

// Get All getAllTripPayments
export const getAllTripPayments = async () => {
  try {
    const res = await api.get(`/class/bookings/payment/history`);
    return res.data.data.tripPayments;
  } catch (error) {
    console.error("Error fetching trip payments:", error);
    return [];
  }
};

// Get All classPayments
export const getAllClassPayments = async () => {
  try {
    const res = await api.get(`/class/bookings/payment/history`);
    return res.data.data.classPayments;
  } catch (error) {
    console.error("Error fetching trip payments:", error);
    return [];
  }
};

// change password
export const postChangePassword = async (
  currentPassword: string,
  newPassword: string,
  token: string
) => {
  try {
    const res = await api.post(
      "/auth/change-password",
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch {
    throw new Error("Failed to Change Password");
  }
};
