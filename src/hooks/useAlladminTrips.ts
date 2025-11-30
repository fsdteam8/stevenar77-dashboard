//  hooks/useAlladminTrips.ts 
import { useQuery } from '@tanstack/react-query';
import { getAllPaidTrips } from '@/lib/api';

export function useAllAdminTrips(page: number, limit: number) {
    return useQuery({
        queryKey: ['all-admin-trips', page, limit],
        queryFn: () => getAllPaidTrips({ page, limit }),
        // keepPreviousData: true,
    });
}   