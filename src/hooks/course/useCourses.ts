import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseApi, getAllCourses, singleUpdateCourse, updateReassignBooking } from "@/lib/api";

export const COURSES_QUERY_KEY = "courses";

export function useCourses(page = 1, limit = 10) {
  return useQuery({
    queryKey: [COURSES_QUERY_KEY, { page, limit }],
    queryFn: () => courseApi.getCourses(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: [COURSES_QUERY_KEY, id],
    queryFn: () => courseApi.getCourse(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: courseApi.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      courseApi.updateCourse(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY, id] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: courseApi.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] });
    },
  });
}

// All Course Get Hook No Pagination
export function useAllCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
  });
}

// Course Update Hook (Single)
export function useSingleUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      courseData,
    }: {
      id: string | number;
      courseData: FormData;
    }) => singleUpdateCourse(id, courseData),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses", id] });
    },

    onError: (error) => {
      console.error("Failed to update course:", error);
    },
  });
}

// Reassign Booking Hook
export function useReassignBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      newScheduleId,
    }: {
      id: string;
      newScheduleId: string;
    }) => updateReassignBooking(id, newScheduleId),

    onSuccess: (_, { id }) => {
      // Invalidate booking-related data after success
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", id] });
    },

    onError: (error) => {
      console.error("Failed to reassign booking:", error);
    },
  });
}
