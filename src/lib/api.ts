import { Social } from "@/hooks/social";
import { BookingData, Session } from "@/types/class";
import type {
  ApiResponse as CourseApiResponse,
  ApiCourse,
  // PaginationParams,
  // CourseFilters,
} from "@/types/course";
import { TemplateData, TemplateResponse } from "@/types/template";
import { useQuery } from "@tanstack/react-query";

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
    const res = await api.get(`/shop`, {
      params: { page, limit },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
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
    const res = await api.delete<ApiResponse>(`/shop/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw error;
  }
};

// Single create Product
export const createProduct = async (productData: FormData) => {
  try {
    const res = await api.post("/shop/create", productData, {
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
    const res = await api.get(`/shop/${id}`);
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
    const res = await api.put(`/shop/update/${id}`, updatedData, {
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
// Course API
export const courseApi = {
  getCourses: async (
    page: number,
    limit: number
  ): Promise<CourseApiResponse<ApiCourse[]>> => {
    try {
      const res = await api.get(
        `/class?isAdmin=true&page=${page}&limit=${limit}`
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },

  getCourse: async (id: string): Promise<CourseApiResponse<ApiCourse>> => {
    try {
      const res = await api.get(`/class/${id}`);
      return res.data;
    } catch (error) {
      console.error("Failed to delete product:", error);
      throw error;
    }
  },

  createCourse: async (
    formData: FormData
  ): Promise<{ success: boolean; message: string; data?: ApiCourse }> => {
    try {
      const res = await api.post("/class", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error) {
      console.error("Failed to create trip:", error);
      throw error;
    }
  },

  updateCourse: async (
    id: string,
    courseData: Partial<FormData>
  ): Promise<CourseApiResponse<ApiCourse>> => {
    try {
      const res = await api.patch(`/class/update/${id}`, courseData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      console.error("Failed to update Product:", error);
      throw error;
    }
  },

  deleteCourse: async (id: string): Promise<CourseApiResponse<null>> => {
    try {
      const res = await api.delete(`/class/delete/${id}`);
      return res.data;
    } catch (error) {
      console.error("Failed to delete product:", error);
      throw error;
    }
  },
};

// API types based on the demo data structure

export async function getAllClassBookings(): Promise<BookingData[]> {
  try {
    const res = await api.get(`/class/bookings/all-bookings`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch all booked classes:", error);
    throw error;
  }
}

export function transformBookingsToSessions(
  bookings: BookingData[] | undefined
): Session[] {
  const sessions: Session[] = [];

  bookings?.forEach((booking) => {
    booking.classDate.forEach((dateString) => {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.getMonth(); // 0-based month
      const year = date.getFullYear();

      // Format time from ISO string
      const time = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      // Format price - use the first price if array, or totalPrice
      const price =
        booking.classId?.price.length > 0
          ? `$${booking?.classId?.price[0]}`
          : `$${booking?.totalPrice}`;

      sessions.push({
        id: `${booking?._id}-${dateString}`,
        title: booking?.classId?.title,
        time,
        price,
        day,
        month,
        year,
      });
    });
  });

  return sessions;
}
// Get dashboard admin dashboard
export const getAdminDashboard = async () => {
  try {
    const res = await api.get(`/dashboard/admin-dashboard`);
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

// Update Profile
export const updateProfile = async (data: FormData, token: string) => {
  try {
    const res = await api.put("/user/update-profile", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data?.data;
  } catch {
    console.error("Failed to update profile:");
  }
};

// Get My Profile data
export const getMyProfileData = async () => {
  try {
    const res = await api.get(`/user/my-profile`);
    return res.data;
  } catch (error) {
    console.error("Error fetching My Profile Data:", error);
    return [];
  }
};

// Get All Booking
export const getAllBookings = async () => {
  try {
    const res = await api.get(`/class/bookings/all-bookings`);
    return res.data;
  } catch (error) {
    console.error("Error fetching All Bookings:", error);
    return [];
  }
};

// Get about Data
export const getAboutData = async () => {
  try {
    const res = await api.get(`/about`);
    return res.data;
  } catch (error) {
    console.error("Error fetching about:", error);
    return [];
  }
};

// Update About From
export const updateAbout = async (data: FormData, id: string) => {
  try {
    const res = await api.put(`/about/${id}`, data);
    return res.data?.data;
  } catch {
    console.error("Failed to update About");
  }
};

// Get All Courses
export const getAllCourses = async () => {
  try {
    const res = await api.get(`/class`);
    return res.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

// Courses Update API
export const singleUpdateCourse = async (
  id: string | number,
  courseData: FormData
) => {
  try {
    const res = await api.patch(`/class/update/${id}`, courseData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to update course:", error);
    throw error;
  }
};

// social link or updata function
export async function fetchSocial() {
  try {
    const res = await api.get(`/social`);

    // console.log("1", res.data);
    return res.data;
  } catch (err) {
    if (err instanceof Error) throw new Error("Failed to fetch social data");
    throw err;
  }
}

export async function updateSocial(id: string, data: Social) {
  try {
    // console.log("2", data);
    const res = await api.put(`/social/${id}`, data);
    // console.log("3", res.data);
    return res.data;
  } catch (err) {
    console.log("4", err);
    if (err instanceof Error) throw new Error("Failed to update social data");
    throw err;
  }
}

// send quick review form link api
export async function sentQuickReview(
  userId: string,
  link: string,
  token: string
) {
  const data = {
    userId: userId,
    formLink: link,
    token: token,
  };

  try {
    const res = await api.post(`/class/bookings/send-form-link`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error sending review:", err);
    if (err instanceof Error)
      throw new Error(err.message || "Failed to send review form");
    throw err;
  }
}

// About Gallery Images Delete api
export async function galleryImageDelete(aboutId: string, imageId: string) {
  try {
    const res = await api.delete(`/about/${aboutId}/gallery/${imageId}`);
    return res.data;
  } catch (err) {
    if (err instanceof Error) throw new Error("Failed to Delete gallery Image");
    throw err;
  }
}

// Get All Orders with pagination and dynamic params
export async function allOrder(page = 1, limit = 10) {
  try {
    const res = await api.get(`/order/all-order?page=${page}&limit=${limit}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching orders:", err);
    throw new Error("Failed to fetch all orders with pagination");
  }
}

// hupdateReassignBooking API function
export async function updateReassignBooking(id: string, newScheduleId: string) {
  try {
    const res = await api.put(`/class/bookings/re-assign/${id}`, {
      newScheduleId,
    });
    return res.data;
  } catch (err) {
    console.error("Error updating booking re-assignment:", err);
    if (err instanceof Error)
      throw new Error("Failed to reassign booking schedule");
    throw err;
  }
}

// ✅ Corrected Delete Booking API function
export async function deleteBooking(bookingId: string, token: string) {
  try {
    const res = await api.delete(`/class/bookings/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Send token properly
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error deleting booking:", err);
    if (err instanceof Error) {
      throw new Error("Failed to delete booking");
    }
    throw err;
  }
}

// Custom hook or API function to fetch a single booking
export const getSingleBooking = async (bookingId: string) => {
  try {
    const res = await api.get(`/class/bookings/${bookingId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching single booking:", error);
    throw new Error("Failed to fetch booking data");
  }
};

// Get reviews all with pagination and dynamic params
export async function getAllReview(page = 1, limit = 10) {
  try {
    const res = await api.get(`/reviews/all?page=${page}&limit=${limit}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching reviewss:", err);
    throw new Error("Failed to fetch all reviews with pagination");
  }
}

// Corrected Delete Review API function
export async function deleteReview(bookingId: string, token: string) {
  try {
    const res = await api.delete(`/reviews/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error deleting Review:", err);
    if (err instanceof Error) {
      throw new Error("Failed to delete Review");
    }
    throw err;
  }
}

//  Delete All Bookings API function
export async function deleteAllBookings(selectedIds: string[]) {
  try {
    const res = await api.delete(`/class/bookings/all-booking/deleted`, {
      data: {
        bookingIds: selectedIds,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting bookings");
    throw error;
  }
}

//  Delete All Order API function
export async function deleteAllOrders(selectedIds: string[]) {
  try {
    const res = await api.delete(`/order/deleted-order`, {
      data: {
        orderIds: selectedIds,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting bookings");
    throw error;
  }
}

//  Add Template API
export const addTemplate = async (
  templateData: TemplateData
): Promise<TemplateResponse> => {
  try {
    const res = await api.post<TemplateResponse>(
      "/message-template",
      templateData
    );
    return res.data;
  } catch {
    // console.error("❌ Failed to add template:", error);
    throw new Error("Failed to add email template");
  }
};

// Get All Template
export const getAllTemplate = async (): Promise<TemplateResponse[]> => {
  try {
    const res = await api.get<{ data: TemplateResponse[] }>(
      "/message-template"
    );
    return res.data.data || [];
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ Failed to fetch templates:", err.message);
      throw new Error("Failed to fetch templates");
    }
    throw err;
  }
};

// Get single Template
export const getSingleTemplate = async (
  id: string
): Promise<TemplateResponse> => {
  try {
    const res = await api.get<TemplateResponse>(`/message-template/${id}`);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ Failed to fetch template:", err.message);
      throw new Error("Failed to fetch template");
    }
    throw err;
  }
};

// Put Template API
export const updateTemplate = async (
  id: string,
  templateData: TemplateData
): Promise<TemplateResponse> => {
  try {
    const res = await api.put<TemplateResponse>(
      `/message-template/${id}`,
      templateData
    );
    return res.data;
  } catch (err) {
    if (err instanceof Error) {
      console.error("❌ Failed to update template:", err.message);
      throw new Error("Failed to update template");
    }
    throw err;
  }
};

// delete Template API
export const deleteTemplate = async (id: string): Promise<void> => {
  try {
    await api.delete(`/message-template/${id}`);
  } catch (err) {
    if (err instanceof Error) {
      console.error("❌ Failed to delete template:", err.message);
      throw new Error("Failed to delete template");
    }
    throw err;
  }
};

//  Single Template Status Update API
export const singleTemplateStatusUpdate = async (
  id: string,
  status: "active" | "deactivate"
): Promise<TemplateResponse> => {
  try {
    const res = await api.patch<TemplateResponse>(
      `/message-template/${id}/status`,
      { status }
    );
    return res.data;
  } catch (err) {
    if (err instanceof Error) {
      console.error("❌ Failed to update template status:", err.message);
      throw new Error("Failed to update template status");
    }
    throw err;
  }
};

// I couldn’t create this hook inside the courses.ts file, so I implemented it directly in api.ts instead. Sorry about that.
export function useSingleUpdateCourse(id: string) {
  return useQuery({
    queryKey: ["singleCourse", id],
    queryFn: () => courseApi.getCourse(id),
    enabled: !!id,
  });
}

// Dynamic user fetch
export async function fetchUsers(
  endpoint: string = "/user/all-users",
  page: number = 1,
  limit: number = 10
) {
  try {
    const res = await api.get(`${endpoint}?page=${page}&limit=${limit}`);

    return {
      users: res.data.data || [],
      pagination: res.data.pagination || {
        page,
        limit,
        total: 0,
        totalPages: 1,
      },
    };
  } catch (err) {
    if (err instanceof Error) throw new Error("Failed to fetch users");
    throw err;
  }
}

//user fetch single

// // Get reviews all with pagination and dynamic params
// export async function getAllReview(page = 1, limit = 10) {
//   try {
//     const res = await api.get(`/reviews/all?page=${page}&limit=${limit}`);
//     return res.data;
//   } catch (err) {
//     console.error("Error fetching reviewss:", err);
//     throw new Error("Failed to fetch all reviews with pagination");
//   }
// }

//user fetch single

export async function fetchsingleUser(id: string) {
  try {
    const res = await api.get(`/user/single-user/${id}`);

    // console.log("Fetched users:", res.data);

    // ✅ Return only the actual user array
    return res.data.data || [];
  } catch (err) {
    if (err instanceof Error) throw new Error("Failed to fetch users");
    throw err;
  }
}

//user delete single

export async function deletesingelUser(id: string) {
  try {
    const res = await api.delete(`/user/delete-user/${id}`);
    return res.data.data || [];
  } catch (err) {
    if (err instanceof Error) throw new Error("Failed to delete user");
    throw err;
  }
}

// User update single

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updatesingleUser(id: string, data: any) {
  try {
    const res = await api.put(`/user/profile/${id}`, data);
    console.log("Updated user:", res.data);
    return res.data.data || {};
  } catch (err) {
    if (err instanceof Error) throw new Error("Failed to update user");
    throw err;
  }
}

//message delete conversation

export async function deletesingelConv(id: string) {
  try {
    const res = await api.delete(`/conversation/${id}`);
    return res.data.data || [];
  } catch (err) {
    if (err instanceof Error) throw new Error("Failed to delete user");
    throw err;
  }
}


// All Paid Get trips with pagination
export async function getAllPaidTrips({ page = 1, limit = 10 }) {
  const res = await api.get(`/trip/all/trips/booking`, {
    params: { page, limit },
  });
  return res.data;
}
