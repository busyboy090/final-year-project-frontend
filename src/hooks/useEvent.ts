import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/apis/axios";
import type { EventFilters, EventStats, EventStatus, PaginatedEventsResponse } from "@/types/event";
import useAuth from "./useAuth";

export const useGetEvents = (params: EventFilters = {}) => {
    const { limit = 20, page = 1, search, status, category, organisation_id, venue_id, created_by, creator_by, start_date_from, start_date_to } = params;
    return useQuery({
        queryKey: ["events", params],
        queryFn: async () => {
            const response = await apiClient.get<PaginatedEventsResponse>("/v1/events", {
                params: {
                    limit,
                    page,
                    search,
                    status,
                    category,
                    organisation_id,
                    venue_id,
                    created_by: created_by ?? creator_by,
                    start_date_from,
                    start_date_to,
                }
            });
            return response.data;
        },
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        refetchIntervalInBackground: false
    });
}

export const useUpdateEventStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: number; status: Extract<EventStatus, "approved" | "rejected"> }) => {
            const response = await apiClient.patch(`/v1/events/${id}/status`, { status });
            return response.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["events"] });
            void queryClient.invalidateQueries({ queryKey: ["event-stats"] });
        },
    });
};

export const useCancelEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const response = await apiClient.patch(`/v1/events/${id}/cancel`);
            return response.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["events"] });
            void queryClient.invalidateQueries({ queryKey: ["event-stats"] });
        },
    });
};

export const useDeleteEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const response = await apiClient.delete(`/v1/events/${id}`);
            return response.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["events"] });
            void queryClient.invalidateQueries({ queryKey: ["event-stats"] });
        },
    });
};

export const useEventStats = () => {
    const { user, isAuthenticated } = useAuth();

    return useQuery({
        queryKey: ["event-stats", user?.id, user?.role],
        queryFn: async () => {
            const response = await apiClient.get("/v1/events/analytics/dashboard");
            return response.data.data as EventStats;
        },
        enabled: isAuthenticated && Boolean(user),
        retry: false,
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
    });
};

export const useJoinEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (eventId: number) => {
            const response = await apiClient.post("/v1/events/enrollments/join", { eventId });
            return response.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["events"] });
            void queryClient.invalidateQueries({ queryKey: ["my-enrollments"] });
        },
    });
};

export const useMyEnrollments = () => {
    return useQuery({
        queryKey: ["my-enrollments"],
        queryFn: async () => {
            const response = await apiClient.get("/v1/events/enrollments/me");
            return response.data.data as Array<{
                id: number;
                status: string;
                event?: {
                    id: number;
                    title: string;
                    description?: string;
                    thumbnail?: string;
                    start_date: string;
                    venue?: { name: string };
                };
            }>;
        },
    });
};
