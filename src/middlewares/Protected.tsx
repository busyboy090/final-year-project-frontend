import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";

/**
 * Layout guard for authenticated-only pages (Dashboards, Settings, etc.).
 * Unauthenticated users are redirected to the login page.
 */
function Protected({ children }: { children?: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { profile } = useUser();
  const location = useLocation();

  // 2. Redirect to login if not authenticated
  if (!isAuthenticated || !profile) {
    return (
      <Navigate
        to="/auth/login"
        replace
        // Save the current location so we can redirect back after login
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  // 3. Render the protected content
  return <>{children ?? <Outlet />}</>;
}

export default Protected;