// hooks/useTrips.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getSingleTrip, getTrips } from "@/lib/api";

export function useTrips(page: number, limit: number) {
  return useQuery({
    queryKey: ["Trips", page, limit],
    queryFn: () => getTrips({ page, limit }),
    // keepPreviousData: true,
  });
}



export function useSingleTrip(id: string) {
  return useQuery({
    queryKey: ["Trip", id],
    queryFn: () => getSingleTrip(id),
    enabled: !!id,  
  });
}