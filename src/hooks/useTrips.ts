// hooks/useTrips.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getTrips } from "@/lib/api";

export function useTrips(page: number, limit: number) {
  return useQuery({
    queryKey: ["Trips", page, limit],
    queryFn: () => getTrips({ page, limit }),
    // keepPreviousData: true,
  });
}
