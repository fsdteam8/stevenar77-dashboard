// src/hooks/templates.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addTemplate,
  deleteTemplate,
  getAllTemplate,
  getSingleTemplate,
  singleTemplateStatusUpdate,
  updateTemplate,
} from "@/lib/api";
import { TemplateData, TemplateResponse, TemplateUpdateData } from "@/types/template";
import { toast } from "sonner";

// Add Template
export function useAddTemplate() {
  const queryClient = useQueryClient();

  return useMutation<TemplateResponse, Error, TemplateData>({
    mutationFn: (templateData: TemplateData) => addTemplate(templateData),

    onSuccess: () => {
      toast.success(" Template added successfully!");
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },

    onError: (error: Error) => {
      console.error("❌ Failed to add template:", error.message);
      toast.error(`❌ Failed to add template: ${error.message}`);
    },
  });
}

// Get All Templates
export function useGetTemplates() {
  return useQuery<TemplateResponse[], Error>({
    queryKey: ["templates"],
    queryFn: getAllTemplate,
    staleTime: 1000 * 60 * 5,
  });
}

// Get Single Template
export function useGetSingleTemplate(id: string) {
  return useQuery<TemplateResponse, Error>({
    queryKey: ["template", id],
    queryFn: () => getSingleTemplate(id),
    enabled: !!id,  
    staleTime: 1000 * 60 * 5,  
  });
}

//  Delete Template
export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteTemplate(id),

    onSuccess: () => {
      // toast.success("🗑️ Template deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },

    onError: (error: Error) => {
      console.error("❌ Failed to delete template:", error.message);
      toast.error(`❌ Failed to delete template: ${error.message}`);
    },
  });
}

//  Update Template Status
export function useUpdateTemplateStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    TemplateResponse,
    Error,
    { id: string; status: "active" | "deactivate" }
  >({
    mutationFn: ({ id, status }) => singleTemplateStatusUpdate(id, status),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },

    onError: (error: Error) => {
      console.error("❌ Failed to update template status:", error.message);
    },
  });
}


//  ✅ Update Template Hook
export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation<TemplateResponse, Error, { id: string; data: TemplateUpdateData }>({
    mutationFn: ({ id, data }) => updateTemplate(id, data),

    onSuccess: (data) => {
      toast.success(`Template "${data.tempName || "Untitled"}" updated successfully!`);
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      queryClient.invalidateQueries({ queryKey: ["template", data._id] });
    },

    onError: (error: Error) => {
      console.error("❌ Failed to update template:", error.message);
      toast.error(`❌ Failed to update template: ${error.message}`);
    },
  });
}
