import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/apis/axios";
import type { Event, EventAudienceRule, EventFilters, EventStats, EventStatus, PaginatedEventsResponse } from "@/types/event";
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

export const useGetEvent = (id?: number | string) => {
    return useQuery({
        queryKey: ["event", id],
        queryFn: async () => {
            const response = await apiClient.get<{ success: boolean; data: Event }>(`/v1/events/${id}`);
            return response.data.data;
        },
        enabled: Boolean(id),
    });
};

export type UpdateEventPayload = {
    title?: string;
    category?: Event["category"];
    description?: string;
    venue_id?: number;
    capacity?: number;
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
    audience_scope?: "all" | "custom";
    audience_rules?: EventAudienceRule[];
};

export const useUpdateEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, payload }: { id: number; payload: UpdateEventPayload }) => {
            const response = await apiClient.patch(`/v1/events/${id}`, payload);
            return response.data;
        },
        onSuccess: (_data, variables) => {
            void queryClient.invalidateQueries({ queryKey: ["events"] });
            void queryClient.invalidateQueries({ queryKey: ["event", variables.id] });
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

export const useCancelEnrollment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (enrollmentId: number) => {
            const response = await apiClient.patch(`/v1/events/enrollments/${enrollmentId}/cancel`);
            return response.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["events"] });
            void queryClient.invalidateQueries({ queryKey: ["my-enrollments"] });
        },
    });
};

export const useCheckInEnrollment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (enrollmentId: number) => {
            const response = await apiClient.patch(`/v1/events/enrollments/${enrollmentId}/check-in`);
            return response.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["my-enrollments"] });
        },
    });
};

export const useEventAttendanceStats = (eventId?: number) => {
    return useQuery({
        queryKey: ["event-attendance-stats", eventId],
        queryFn: async () => {
            const response = await apiClient.get(`/v1/events/enrollments/${eventId}/stats`);
            return response.data.data as {
                event_id: number;
                total_enrolled: number;
                total_attended: number;
                total_cancelled: number;
                no_show: number;
                attendance_rate: string | number;
            };
        },
        enabled: Boolean(eventId),
    });
};

export const useRegenerateEnrollmentQr = () => {
    return useMutation({
        mutationFn: async (enrollmentId: number) => {
            const response = await apiClient.post(`/v1/admin/enrollments/${enrollmentId}/regenerate-qr`);
            return response.data;
        },
    });
};

export const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};

export const exportEventRegistrants = async (eventId: number) => {
    const response = await apiClient.get(`/v1/events/${eventId}/registrants/export`, {
        responseType: "blob",
    });
    downloadBlob(response.data, `event-${eventId}-registrants.csv`);
};

export const exportEventAttendance = async (eventId: number) => {
    const response = await apiClient.get(`/v1/admin/events/${eventId}/attendance/export`, {
        responseType: "blob",
    });
    downloadBlob(response.data, `event-${eventId}-attendance.csv`);
};

export const exportAllUsers = async () => {
    const response = await apiClient.get("/v1/admin/users/export", {
        responseType: "blob",
    });
    downloadBlob(response.data, "users-export.csv");
};

export const useMyEnrollments = () => {
    return useQuery({
        queryKey: ["my-enrollments"],
        queryFn: async () => {
            const response = await apiClient.get("/v1/events/enrollments/me");
            return response.data.data as Array<{
                id: number;
                status: string;
                qr_token?: string | null;
                qr_issued_at?: string | null;
                check_in_time?: string | null;
                event?: {
                    id: number;
                    title: string;
                    category?: Event["category"];
                    description?: string;
                    thumbnail?: string;
                    fillPercentage?: number;
                    start_date: string;
                    end_date?: string;
                    venue?: { name: string };
                };
            }>;
        },
    });
};
