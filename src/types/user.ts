export type UserRole = 
  | "super-admin" 
  | "event-organiser" 
  | "staff" 
  | "student";

/**
 * Represents the structure of a permission as it comes from the DB
 */
export type UserPermission = {
  name: string;   // e.g., 'create_event'
  module: string; // e.g., 'events'
};

export type User = {
  id: number;
  first_name: string | null; // Made optional per your schema update
  last_name: string | null;  // Made optional per your schema update
  email: string;
  
  role: UserRole; 
  
  email_verified: boolean;
  is_active: boolean;
  two_factor_enabled: boolean;
  profile_picture_url: string | null;
  created_at: Date;
  updated_at: Date;
};