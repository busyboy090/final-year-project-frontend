import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export const useCreateFacility = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: { name: string; description?: string }) => {
            const response = await apiClient.post("/v1/facilities", payload);
            return response.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["facilities"] });
        },
    });
};

export const useUpdateFacility = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, payload }: { id: number; payload: { name?: string; description?: string } }) => {
            const response = await apiClient.patch(`/v1/facilities/${id}`, payload);
            return response.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["facilities"] });
        },
    });
};
