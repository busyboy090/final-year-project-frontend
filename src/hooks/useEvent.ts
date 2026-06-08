import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/apis/axios";
import type { EventFilters, PaginatedEventsResponse } from "@/types/event";

export const useGetEvents = (params: EventFilters = {}) => {
    const { limit = 20, page = 1, search, status, category, organisation_id, venue_id, created_by, start_date, end_date, start_time, end_time } = params;
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
                    created_by,
                    start_date,
                    end_date,
                    start_time,
                    end_time
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