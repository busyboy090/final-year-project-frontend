import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { dashboardPathForRole } from "@/utils/route";
import type { UserRole } from "@/types/user";

const routeRoleMap: Record<string, UserRole> = {
  admin:             "super-admin",
  "event-organiser": "event-organiser",
  staff:             "staff",
  student:           "student",
};

function CheckUserRole({
  children,
  role, // Keeps the string[] type
}: {
  children?: React.ReactNode;
  role: string[];
}) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Map the array of route segments to their actual UserRole values
  const allowedRoles = role.map(r => routeRoleMap[r]).filter(Boolean);
  
  // Check if the current user's role is included in the allowed roles
  const hasAccess = allowedRoles.includes(user.role as UserRole);

  if (!hasAccess) {
    return <Navigate to={dashboardPathForRole(user.role as UserRole)} replace />;
  }

  return <>{children ?? <Outlet />}</>;
}

export default CheckUserRole;