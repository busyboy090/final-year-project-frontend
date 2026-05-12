import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { dashboardPathForRole } from "@/utils/route";
import type { UserRole } from "@/types/user";

// Mapping frontend route categories to backend UserRole codes
const routeRoleToApiRoles: Record<string, UserRole[]> = {
  admin: ["super-admin"],
  /** Registry / user management: super-admin role plus `is_super_admin` account flag */
  superAdmin: ["super-admin"],
  user: ["student", "staff"],
  eventOrganiser: ["faculty-admin", "department-admin", "src-exec", "event-organiser"] // Added event-organiser
};

function CheckUserRole({
  children,
  role,
}: {
  children?: React.ReactNode;
  role: string;
}) {
  const user = useAppSelector((s) => s.auth.user);

  // 1. Redirect to login if no user is found
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // 2. Identify roles allowed for this specific route segment
  const allowedApiRoles = routeRoleToApiRoles[role];

  /**
   * 3. Check for Intersection:
   * Does the user have AT LEAST ONE of the roles required for this route?
   */
  const hasRoleMatch = user.roles.some((userRole: UserRole) =>
    allowedApiRoles?.includes(userRole)
  );

  const hasAccess =
    role === "superAdmin"
      ? hasRoleMatch && user.is_super_admin === true
      : hasRoleMatch;

  if (!hasAccess) {
    /**
     * Fallback: Redirect to their primary dashboard. 
     * dashboardPathForRole should be updated to accept the roles array
     */
    const primaryRole = user.roles[0] || "student";
    return <Navigate to={dashboardPathForRole(primaryRole)} replace />;
  }

  return <>{children ?? <Outlet />}</>;
}

export default CheckUserRole;