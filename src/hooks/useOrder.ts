// useOrders.ts
import { allOrder, deleteAllOrders } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
 

export function useOrders(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["orders", page, limit],
    queryFn: () => allOrder(page, limit),
  });
}


export function useDeleteAllOrders() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (selectedIds: string[]) => deleteAllOrders(selectedIds),
    onSuccess: () => {
      // Invalidate all orders queries
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("Failed to delete orders:", error);
    },
  });
}