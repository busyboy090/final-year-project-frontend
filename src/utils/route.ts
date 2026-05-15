import type { UserRole } from "@/types/user";

export const dashboardPathForRole = (role: UserRole): string => {
  switch (role) {
    case "super-admin":     return "/dashboard/admin";
    case "event-organiser": return "/dashboard/event-organiser";
    case "staff":           return "/dashboard/staff";
    case "student":
    default:                return "/dashboard/student";
  }
};