import { Outlet, useNavigate } from "react-router-dom";
import { adminNavItems, userNavItems } from "@/configs/nav-config";
import { DashboardSidebar } from "./DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { ReactNode } from "react";
import DashboardHeader from "./DashboardHeader";
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

function DashboardLayout({ children }: { children?: ReactNode }) {
  const { user } = useAuth();
  const { needsProfileCompletion } = useUser();
  const navigate = useNavigate();
  const [hasShownToast, setHasShownToast] = useState(false);

  const isAdminView = user?.roles?.some((role) =>
    [
      "super-admin",
      "faculty-admin",
      "department-admin",
      "student-affairs",
    ].includes(role),
  );

  const isSuperAdminAccount =
    user?.roles?.includes("super-admin") && user?.is_super_admin === true;

  const activeNavItems = isAdminView
    ? adminNavItems.filter(
      (item) => item.path !== "/dashboard/admin/users" || isSuperAdminAccount,
    )
    : userNavItems;

  // Show persistent toast notification when profile completion is needed
  useEffect(() => {
    if (needsProfileCompletion && !hasShownToast) {
      // Determine the role for the path. 
      // We pick the first available role or fallback to 'user'
      const userRole = user?.roles?.[0] || 'user';

      setHasShownToast(true);
      toast(
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm">Complete Your Profile</p>
            <p className="text-xs text-gray-600">
              You need to complete your profile to continue using the system.
            </p>
          </div>
          <button
            onClick={() => navigate(`/dashboard/${userRole}/settings`)}
            className="ml-2 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors shrink-0"
          >
            Complete Now
          </button>
        </div>,
        {
          duration: Infinity,
          closeButton: false,
          action: undefined,
        },
      );
    }
  }, [needsProfileCompletion, hasShownToast, navigate, user?.roles]); // Added user?.roles to dependency array

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">
        <DashboardSidebar navItems={activeNavItems} />

        <main className="flex-1 flex flex-col min-w-0">
          <DashboardHeader />

          <div className="p-4 md:p-8 flex-1">
            {children ? children : <Outlet />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default DashboardLayout;
