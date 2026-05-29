import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/apis/axios";

export const useFaculties = () => {
    return useQuery({
      queryKey: ['faculties'],
      queryFn: async () => {
        const response = await apiClient.get("/v1/faculties");
        return response.data;
      },
      staleTime: 1000 * 60 * 60, // Data is fresh for 1 hour (academic data doesn't change often)
    });
  };