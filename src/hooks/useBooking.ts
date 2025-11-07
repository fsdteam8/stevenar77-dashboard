import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSingleBooking, deleteAllBookings } from "@/lib/api";

// ✅ Fetch a single booking
export function useSingleBooking(id: string) {
  return useQuery({
    queryKey: ["Booking", id],
    queryFn: () => getSingleBooking(id),
    enabled: !!id,
  });
}

// ✅ Delete multiple bookings hook
export function useDeleteAllBookings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (selectedIds: string[]) => deleteAllBookings(selectedIds),
    onSuccess: () => {
      // Cache refresh / refetch all bookings if needed
      queryClient.invalidateQueries({ queryKey: ["Booking"] });
    },
    onError: (error) => {
      console.error("❌ Failed to delete bookings:", error);
    },
  });
}
