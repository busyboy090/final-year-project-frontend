import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/apis/axios";

interface FacilityParams {
    search?: string;
    page?: number;
    limit?: number;
}

export const useFacilities = (params: FacilityParams) => {
    const { search, page = 1, limit = 20 } = params;

    return useQuery({
        queryKey: ["facilities", { search, page, limit }],
        queryFn: async () => {
            const query = new URLSearchParams();
            if (search) query.set("search", search);
            query.set("page", String(page));
            query.set("limit", String(limit));

            // PASS THE PARAMS HERE 👇
            const response = await apiClient.get(`/v1/facilities?${query.toString()}`);
            return response.data.facilities;
        },
        staleTime: 1000 * 60 * 60, // 1 hour
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });
};

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
