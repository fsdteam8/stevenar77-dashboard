import { getAllClassBookings } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useAllClassBookings() {
  return useQuery({
    queryKey: ["all-class-bookings"],
    queryFn: () => getAllClassBookings(),
    // keepPreviousData: true,
  });
}
