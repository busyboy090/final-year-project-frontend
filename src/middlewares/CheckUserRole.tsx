import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import type { ApiRole } from "@/types/auth";
import { dashboardPathForRole } from "@/types/auth";

const routeRoleToApiRoles: Record<string, ApiRole[]> = {
  admin: ["administrator"],
  user: ["user"],
  "event-organiser": ["organiser"],
};

function CheckUserRole({
  children,
  role,
}: {
  children?: React.ReactNode;
  role: string;
}) {
  const user = useAppSelector((s) => s.auth.user);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const allowed = routeRoleToApiRoles[role];
  if (!allowed || !allowed.includes(user.role)) {
    return <Navigate to={dashboardPathForRole(user.role)} replace />;
  }

  return <>{children ?? <Outlet />}</>;
}

export default CheckUserRole;
