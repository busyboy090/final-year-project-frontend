import { Navigate, Outlet } from "react-router-dom";
import { dashboardPathForRole } from "@/types/auth";
import useAuth from "@/hooks/useAuth";

/**
 * Layout guard for auth-only pages (login, signup, etc.).
 * Authenticated users are redirected to their dashboard.
 */
function Guest() {
  const { isAuthenticated, user, initialized } = useAuth();

  // 1. Wait for the bootstrap (ping/csrf/refresh) to finish
  if (!initialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F4F6F9]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  // 2. Redirect authenticated users to their specific dashboard
  if (isAuthenticated && user) {
    return (
      <Navigate 
        to={dashboardPathForRole(user.role)} 
        replace 
      />
    );
  }

  // 3. Allow guest access to login/signup
  return <Outlet />;
}

export default Guest;