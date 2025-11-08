//hooks/useUser.ts

"use client";

import { User } from "@/components/Dashboard/Table/PaymentsTrip";
import { deletesingelUser, fetchsingleUser, fetchUsers, updatesingleUser } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Fetch all users
export function useUser() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });
}

// Fetch single user
export function useSingleUser(id: string) {
  return useQuery({
    queryKey: ["singleuser", id],
    queryFn: () => fetchsingleUser(id),
    enabled: !!id, // Only run if id exists
  });
}

// Delete single user
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletesingelUser(id),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] }); // Refetch users
    },
    onError: () => {
      toast.error("Failed to delete user");
    },
  });
}

// Update single user
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => 
      updatesingleUser(id, data),
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["singleuser"] });
    },
    onError: () => {
      toast.error("Failed to update user");
    },
  });
}
