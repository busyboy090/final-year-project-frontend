import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

/**
 * Layout guard for authenticated-only pages (Dashboards, Settings, etc.).
 * Unauthenticated users are redirected to the login page.
 */
function Protected({ children }: { children?: React.ReactNode }) {
  const { isAuthenticated, user, initialized } = useAuth();
  const location = useLocation();

  // 1. Wait for the bootstrap sequence to complete
  if (!initialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F4F6F9]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">Securing session...</p>
        </div>
      </div>
    );
  }

  // 2. Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
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