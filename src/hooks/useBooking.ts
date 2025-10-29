// hooks/useBookings.ts
import { getSingleBooking } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// ✅ Simple custom hook to fetch a single booking
export function useSingleBooking(id: string) {
  return useQuery({
    queryKey: ["Booking", id],
    queryFn: () => getSingleBooking(id),
    enabled: !!id,  
  });
}