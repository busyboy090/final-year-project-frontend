import { Navigate, Outlet } from "react-router-dom";
import { dashboardPathForRole } from "@/utils/route";
import type { UserRole } from "@/types/user";
import useUser from "@/hooks/useUser";

// Maps route segment to the role that can access it
const routeRoleMap: Record<string, UserRole> = {
  admin:          "super-admin",
  "event-organiser": "event-organiser",
  staff:          "staff",
  student:        "student",
};

function CheckUserRole({
  children,
  role,
}: {
  children?: React.ReactNode;
  role: string;
}) {
  const { profile } = useUser();

  // 1. Redirect to login if no user
  if (!profile) {
    return <Navigate to="/auth/login" replace />;
  }

  // 2. Check if the user's single role matches the required route role
  const requiredRole = routeRoleMap[role];
  const hasAccess = !!requiredRole && profile.role === requiredRole;

  if (!hasAccess) {
    // Redirect to their own dashboard
    return <Navigate to={dashboardPathForRole(profile?.role as UserRole)} replace />;
  }

  return <>{children ?? <Outlet />}</>;
}

export default CheckUserRole;