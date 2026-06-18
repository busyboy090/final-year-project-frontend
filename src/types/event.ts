import type { User } from './user';
import type { Venue } from './venue';
import type { Organisation } from './organisation';

export type EventCategory = 'Academic Conference' | 'Workshop' | 'Cultural Event' | 'Sports Match' | 'Exhibition/Expo' | 'Social Gathering/Party';
export type EventStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type EventAudienceScope = 'all' | 'custom';
export type EventAudienceRole = 'staff' | 'student';
export type EventAudienceGender = 'male' | 'female' | 'other';
export type EventAudienceStaffType = 'academic-staff' | 'non-academic-staff';

export interface EventAudienceRule {
    id?: number;
    event_id?: number;
    role: EventAudienceRole;
    staff_type?: EventAudienceStaffType | null;
    level_id?: number | null;
    gender?: EventAudienceGender | null;
    level?: {
        id: number;
        name: string;
        code?: string;
    };
}

export interface Event {
    id: number;
    title: string;
    thumbnail: string;
    category: EventCategory;
    description: string;
    duration: number;
    venue_id: number;
    venue: Venue;
    organisation_id?: number | null;
    organisation?: Organisation;
    creator?: User;
    fillPercentage: number;
    start_date: Date;
    end_date: Date;
    capacity: number;
    status: EventStatus;
    audience_scope: EventAudienceScope;
    audienceRules?: EventAudienceRule[];
    created_at: Date;
    updated_at: Date;
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

export interface EventStats {
    total_events: number;
    pending_approval: number;
    approved_events: number;
    rejected_events: number;
    cancelled_events: number;
    upcoming_events: number;
    active_events: number;
    past_events: number;
}

export interface EventFilters {
    limit?: number;
    page?: number;
    search?: string;
    status?: EventStatus;
    category?: EventCategory;
    organisation_id?: number;
    venue_id?: number;
    created_by?: number;
    creator_by?: number;
    start_date_from?: Date;
    start_date_to?: Date;
    start_time?: string;
    end_time?: string;
}
