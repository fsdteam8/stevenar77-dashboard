//hooks/useConvo.ts

import { deletesingelConv } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Delete single user
export function useDeleteConvo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletesingelConv(id),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["convos"] }); // Refetch users
    },
    onError: () => {
      toast.error("Failed to delete user");
    },
  });
}
