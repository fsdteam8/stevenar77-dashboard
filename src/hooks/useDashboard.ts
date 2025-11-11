// hooks/useDashboard.ts
import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard, getDashboardChartData } from "@/lib/api";

export function useDashboard() {
  return useQuery({
    queryKey: ["adminDashboard"],
    queryFn: getAdminDashboard,
  });
}

//  hook for fetching dashboard chart data
export function useDashboardChartData(year: number) {
  return useQuery({
    queryKey: ["dashboardChartData", year],  
    queryFn: () => getDashboardChartData(year),
    enabled: !!year,  
  });
}