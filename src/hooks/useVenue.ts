import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/apis/axios";
import type { Venue } from "@/types/venue";

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
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchIntervalInBackground: true
  });
};

export const useVenueStats = () => {
  return useQuery({
    queryKey: ["venues", "stats"],
    queryFn: async () => {
      const response = await apiClient.get("/v1/venues", {
        params: { limit: 1000, page: 1 },
      });

      const venues = (response.data.data ?? []) as Venue[];
      const normalizedStatus = (status?: string) => (status ?? "").toLowerCase();
      const total = venues.length;
      const available = venues.filter((venue) => normalizedStatus(venue.status) === "available").length;
      const maintenance = venues.filter((venue) => normalizedStatus(venue.status) === "maintenance").length;
      const occupied = venues.filter((venue) => normalizedStatus(venue.status) === "occupied").length;

      return {
        total,
        available,
        maintenance,
        occupied,
        occupancyRate: total > 0 ? Math.round((occupied / total) * 100) : 0,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
};
