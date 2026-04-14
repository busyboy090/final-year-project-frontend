export interface Venue {
    id: string;
    name: string;
    location?: string;
    capacity?: string;
    type?: string;
    status: string;
    image?: string; // Optional URL for the featured image
    isMaintenance?: boolean;
    lastUpdated?: string;
    features?: string[]; // e.g., ["AV System", "Projector", "Maritime Simulators"]
}

// Using Enums or Union Types ensures data consistency across the dashboard
export type VenueStatus = 'Available' | 'Occupied' | 'Maintenance' | 'Reserved';

export type VenueType =
    | 'Auditorium'
    | 'Research Lab'
    | 'Lecture Hall'
    | 'Ceremonial Plaza'
    | 'Conference Room'
    | 'Maritime Lab';