// hooks/useProducts.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteProduct,
  getProducts,
  createProduct,
  updateSingleProduct,
  getSingleProduct,
} from "@/lib/api";

// ✅ Get Products with pagination
export function useProducts(page: number, limit: number) {
  return useQuery({
    queryKey: ["products", page, limit],
    queryFn: () => getProducts({ page, limit }),
    // keepPreviousData: true,
  });
}

// ✅ Delete Product
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// ✅ Create Product
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createProduct(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// single get product (useProducthooks)
export function useSingleProduct(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getSingleProduct(id),
    enabled: !!id,
  });
}

// ✅ Update single Product (useProducthooks)
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateSingleProduct(id, data),
    onSuccess: () => {
      // Product list refresh
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
