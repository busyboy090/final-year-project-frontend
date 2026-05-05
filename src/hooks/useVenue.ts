import { apiClient } from "@/apis/axios";
import { useQuery } from "@tanstack/react-query";

export const useVenues = () => {
    return useQuery({
        queryKey: ["venues"],
        queryFn: async () => {
            const response = await apiClient.get("/v1/venues");
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