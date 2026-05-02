import type { UserRole } from "@/types/user";

export function dashboardPathForRole(role: UserRole): string {
  switch (role) {
    case "super-admin":
      return "/dashboard/admin";
    case "event-organiser":
      return "/dashboard/event-organiser";
    default:
      return "/dashboard/student";
  }
}