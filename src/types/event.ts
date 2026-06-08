import type { User } from './user';
import type { Venue } from './venue';
import type { Organisation } from './organisation';

export type EventCategory = 'Academic Conference' | 'Workshop' | 'Cultural Event' | 'Sports Match' | 'Exhibition/Expo' | 'Social Gathering/Party';
export type EventStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface Event {
    id: number;
    title: string;
    thumbnail: string;
    category: EventCategory;
    description: string;
    duration: number;
    venue_id: number;
    venue: Venue;
    organization_id?: number | null;
    organization: Organisation;
    fillPercentage: number;
    start_date: Date;
    end_date: Date;
    capacity: number;
    status: EventStatus;
    created_at: Date;
    updated_at: Date;
    creator: User;
    created_by: number;
}

export interface EventFormValues {
    title: string;
    category: EventCategory;
    description: string;
    venue_id: number;
    capacity: number;
    startdate: Date;
    end_date: Date;
    start_time: string;
    end_time: string;
}

export interface PaginatedEventsResponse {
    events: Event[];
    total: number;
    page: number;
    pages: number;
    limit: number;
}

export interface EventFilters {
    limit?: number;
    page?: number;
    search?: string;
    status?: EventStatus;
    category?: EventCategory;
    organisation_id?: number;
    created_by?: number;
    venue_id?: number;
    creator_by?: number;
    start_date?: Date;
    end_date?: Date;
    start_time?: string;
    end_time?: string;
}