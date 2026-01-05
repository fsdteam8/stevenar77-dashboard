//  hooks/useAlladminTrips.ts 
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllPaidTrips, deletePaidTrips } from '@/lib/api';

export function useAllAdminTrips(page: number, limit: number) {
    return useQuery({
        queryKey: ['all-admin-trips', page, limit],
        queryFn: () => getAllPaidTrips({ page, limit }),
        // keepPreviousData: true,
    });
}

export function useDeleteAllAdminTrips() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (selectedIds: string[]) => deletePaidTrips(selectedIds),
        onSuccess: () => {
            // Invalidate all orders queries
            queryClient.invalidateQueries({ queryKey: ["all-admin-trips"] });
        },
        onError: (error) => {
            console.error("Failed to delete orders:", error);
        },
    });
}