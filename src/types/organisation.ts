export interface Organisation {
    id: number;
    name: string;
    faculty_id: number | null;
    department_id: number | null;
    faculty?: { id: number; name: string };
    department?: { id: number; name: string };
    created_at: string;
    updated_at: string;
}

export interface OrganisationFilters {
    page?: number;
    limit?: number;
    name?: string;
    faculty_id?: number;
    department_id?: number;
}

export interface PaginatedOrganisationsResponse {
    success: boolean;
    message: string;
    data: Organisation[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}