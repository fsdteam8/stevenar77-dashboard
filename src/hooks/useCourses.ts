// hooks/useCourses.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getCourses } from "@/lib/api";

export function useCourses(page: number, limit: number) {
  return useQuery({
    queryKey: ["courses", page, limit],
    queryFn: () => getCourses({ page, limit }),
    // keepPreviousData: true,
  });
}
