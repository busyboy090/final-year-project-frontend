import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export const useCreateFaculty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { name: string; code: string }) => {
      const response = await apiClient.post("/v1/faculties", payload);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["faculties"] });
    },
  });
};
