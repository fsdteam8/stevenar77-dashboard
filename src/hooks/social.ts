"use client";

import { fetchSocial, updateSocial } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// export interface Social {
//   facebook: string;
//   instagram: string;
//   location: string;
//   email: string;
//   phoneNumber: string;
// }
export interface Social {
  email: string;
  phoneNumber: string;
  location?: string;
  facebook?: string;
  instagram?: string;
}

// Fetch hook
export function useSocial() {
  return useQuery({
    queryKey: ["social", ],
    queryFn: () => fetchSocial(),
    
  });
}

// Update hook
export function useUpdateSocial(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["social", id],
    mutationFn: (data: Social) => updateSocial(id, data),
    onSuccess: (data) => {
      toast.success(data?.message || "Updated successfully");
      queryClient.invalidateQueries({ queryKey: ["social", id] });
    },
    onError: (error) => {
      toast.error(error?.message || "Update failed");
    },
  });
}
