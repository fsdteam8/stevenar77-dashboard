// hooks/useAbout.ts
"use client"

import { getAboutData, updateAbout } from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// get about page
export function useAbout() {
  return useQuery({
    queryKey: ["about"],
    queryFn: getAboutData,
  })
}

// update about page
export function useUpdateAbout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data, id }: { data: FormData; id: string }) =>
      updateAbout(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about"] })
    },
    onError: (error) => {
      console.error("Update about failed:", error)
    },
  })
}