// hooks/useDashboard.ts
import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "@/lib/api";

export function useDashboard() {
  return useQuery({
    queryKey: ["adminDashboard"],
    queryFn: getAdminDashboard,
  });
}
