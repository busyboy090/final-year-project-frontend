import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/apis/axios";

export const useFacilities = () => {
    return useQuery({
        queryKey: ["facilities"],
        queryFn: async () => {
            const response = await apiClient.get("/v1/facilities");
            return response.data.data;
        },
        staleTime: 1000 * 60 * 60, // 1 hour
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        refetchIntervalInBackground: false
    });
}