import { Navigate, Outlet } from "react-router-dom";
import { dashboardPathForRole } from "@/utils/route"; // Updated path reference
import useAuth from "@/hooks/useAuth";

/**
 * Layout guard for auth-only pages (login, signup, etc.).
 * Authenticated users are redirected to their dashboard.
 */
function Guest() {
  const { isAuthenticated, user } = useAuth();

  /**
   * 1. Redirect authenticated users.
   * With multiple roles, we use the primary role (index 0) to find 
   * the appropriate dashboard path.
   */
  if (isAuthenticated && user && user.role) {
    // Determine primary role for the redirect
    const primaryRole = user.role; 

    return (
      <Navigate 
        to={dashboardPathForRole(primaryRole)} 
        replace 
      />
    );
  }

  // 2. Allow guest access to login/signup
  return <Outlet />;
}

export default Guest;