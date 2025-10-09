// useOrders.ts
import { allOrder } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
// import { allOrder } from "@/api/order"; // adjust the import path as needed

export function useOrders(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["orders", page, limit],
    queryFn: () => allOrder(page, limit),
  });
}