"use client";

import { deleteReview, getAllReview } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useReview(page: number, limit: number) {
  return useQuery({
    queryKey: ["Reviews", page, limit],
    queryFn: () => getAllReview(page, limit),
    // keepPreviousData: true,
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, token }: { bookingId: string; token: string }) =>
      deleteReview(bookingId, token),
    onSuccess: (_, { bookingId }) => {
      // Invalidate queries related to reviews to refresh the list
      queryClient.invalidateQueries({ queryKey: ["Reviews"] });
      console.log(`Review ${bookingId} deleted successfully`);
    },
    onError: (error) => {
      console.error("Failed to delete review:", error);
    },
  });
}