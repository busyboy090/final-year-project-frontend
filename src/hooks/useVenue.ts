import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/apis/axios";

// Define an interface for your filter arguments
interface UseVenuesFilters {
  page?: number;
  limit?: number;
  minCapacity?: number;
  search?: string;
  status?: 'available' | 'maintenance' | 'occupied';
  type?: 'hall' | 'outdoor' | 'classroom' | 'auditorium' | 'lab';
}

export const useVenues = (filters: UseVenuesFilters = {}) => {
  return useQuery({
    // 1. Include filters in the queryKey so it refetches when filters change
    queryKey: ["venues", filters],
    
    queryFn: async () => {
      // 2. Pass filters as query parameters (axios automatically serializes objects into ?key=value)
      const response = await apiClient.get("/v1/venues", {
        params: filters,
      });
      
      // Note: Since the backend now returns { success: true, data: [...], pagination: {...} }
      // You might want to return the whole response object or just response.data depending on your needs.
      return response.data.data; 
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false
  });
};