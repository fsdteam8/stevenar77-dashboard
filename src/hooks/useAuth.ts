// hooks/useAuth.ts
"use client";

import { postForgotPassword } from "@/lib/api";
import { signOut, useSession } from "next-auth/react";
import { useState, useCallback } from "react";

interface ForgotPasswordData {
  email: string;
}

export const useAuth = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut({ callbackUrl: '/auth/signin' });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  // Forgot password
  const forgotPassword = async (data: ForgotPasswordData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await postForgotPassword(data);
      setLoading(false);
      setSuccess("Password reset email sent successfully");
      return response;
    } catch (err) {
      setError("Failed to send reset email");
      setLoading(false);
      throw err;
    }
  };

  return { 
    forgotPassword,
    loading,
    error,
    success,
    signOut: handleSignOut,
    session,
    status,
  };
};
