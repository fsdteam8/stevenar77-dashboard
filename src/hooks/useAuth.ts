"use client";

import { getAllUser,  getUserConversation,  postForgotPassword } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

// --------------------
// Types
// --------------------
interface ForgotPasswordData {
  email: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// --------------------
// useAuth Hook
// --------------------
export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const forgotPassword = async (data: ForgotPasswordData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await postForgotPassword(data);
      setSuccess("Password reset email sent successfully");
      return response;
    } catch  {
      setError("Failed to send reset email");
      console.log("Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return { forgotPassword, loading, error, success };
};

// --------------------
// useAllUsers Hook
// --------------------
export const useAllUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res: ApiResponse<User[]> = await getAllUser();
      return res.data; // ensure only the array of users is returned
    },
    // staleTime: 5 * 60 * 1000, // optional: cache for 5 minutes
  });
};
 
export interface Conversation {
  _id: string;
  members: User[];
  lastMessage: string;
  updatedAt: string;
}

export const useAllConversation = () => {
  return useQuery<Conversation[]>({
    queryKey: ["conversation"],
    queryFn: async () => {
      const data = await getUserConversation();
      return Array.isArray(data) ? data : []; 
    },
  });
};
