import { Navigate, Outlet } from "react-router-dom";
import { dashboardPathForRole } from "@/utils/route";
import useAuth from "@/hooks/useAuth";
import type { UserRole } from "@/types/user";
import useUser from "@/hooks/useUser";

/**
 * Layout guard for auth-only pages (login, signup, etc.).
 * Authenticated users are redirected to their dashboard.
 */
function Guest() {
  const { isAuthenticated } = useAuth();
  const { profile } = useUser();

  if (isAuthenticated && profile?.role) {
    return (
      <Navigate
        to={dashboardPathForRole(profile?.role as UserRole)}
        replace
      />
    );
  }

  return <Outlet />;
}

export default Guest;