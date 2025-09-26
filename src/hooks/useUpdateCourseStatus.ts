

// hooks/course/useUpdateCourseStatus.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UpdateStatusResponse {
  success: boolean;
  message: string;
  statusCode: number;
}

// Get auth token from cookies (since no localStorage)
const getAuthToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => 
    cookie.trim().startsWith('auth-token=') || 
    cookie.trim().startsWith('accessToken=') ||
    cookie.trim().startsWith('token=')
  );
  
  return tokenCookie ? decodeURIComponent(tokenCookie.split('=')[1]) : null;
};

const updateCourseStatus = async (courseId: string): Promise<UpdateStatusResponse> => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication token not found. Please log in again.');
  }
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/class/update-status/${courseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Handle 401 specifically
    if (response.status === 401) {
      // Clear invalid token from cookies
      document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      throw new Error('Session expired. Please log in again.');
    }
    
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to update course status');
  }

  return data;
};

interface UseUpdateCourseStatusOptions {
  onSuccess?: (data: UpdateStatusResponse, courseId: string) => void;
  onError?: (error: Error, courseId: string) => void;
  showToasts?: boolean;
}

export const useUpdateCourseStatus = (options?: UseUpdateCourseStatusOptions) => {
  const queryClient = useQueryClient();
  const {
    onSuccess,
    onError,
    showToasts = true
  } = options || {};

  return useMutation({
    mutationFn: updateCourseStatus,
    onSuccess: (data, courseId) => {
      // Invalidate and refetch courses data using TanStack Query
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      
      // Show success toast
      if (showToasts) {
        toast.success(data.message || 'Course status updated successfully');
      }
      
      // Custom success callback
      onSuccess?.(data, courseId);
      
      // console.log('Course status updated successfully:', courseId, data);
    },
    onError: (error: Error, courseId) => {
      // Handle authentication errors
      if (error.message.includes('Session expired') || error.message.includes('Authentication token not found')) {
        if (showToasts) {
          toast.error('Session expired. Redirecting to login...');
        }
        
        // Redirect to login
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        // Show error toast
        if (showToasts) {
          toast.error(error.message || 'Failed to update course status');
        }
      }
      
      // Custom error callback
      onError?.(error, courseId);
      
      console.error('Failed to update course status:', error);
    },
    // TanStack Query retry configuration
    retry: (failureCount, error) => {
      // Don't retry authentication errors
      if (error.message.includes('Session expired') || 
          error.message.includes('Authentication token not found') ||
          error.message.includes('401')) {
        return false;
      }
      
      // Retry up to 2 times for network errors, but not for 4xx errors
      if (failureCount < 2 && !error.message.includes('4')) {
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Alternative hook for batch status updates using TanStack Query
export const useUpdateMultipleCourseStatus = (options?: UseUpdateCourseStatusOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, showToasts = true } = options || {};

  const updateMultipleStatus = async (courseIds: string[]): Promise<UpdateStatusResponse[]> => {
    const promises = courseIds.map(id => updateCourseStatus(id));
    return Promise.all(promises);
  };

  return useMutation({
    mutationFn: updateMultipleStatus,
    onSuccess: (data, courseIds) => {
      // Invalidate queries using TanStack Query
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      
      if (showToasts) {
        toast.success(`Updated status for ${courseIds.length} courses`);
      }
      
      onSuccess?.(data[0], courseIds.join(', '));
    },
    onError: (error: Error, courseIds) => {
      if (showToasts) {
        toast.error('Failed to update some course statuses');
      }
      
      onError?.(error, courseIds.join(', '));
    },
  });
};