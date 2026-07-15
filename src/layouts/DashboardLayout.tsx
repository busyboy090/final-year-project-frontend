import { Outlet, useNavigate } from "react-router-dom";
import {
  superAdminNavItems,
  studentNavItems,
  staffNavItems,
  eventOrganiserNavItems,
} from "@/configs/nav-config";
import { DashboardSidebar } from "./DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { ReactNode } from "react";
import DashboardHeader from "./DashboardHeader";
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import { useEffect } from "react";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import type { UserRole } from "@/types/user";

const ROLE_SETTINGS_PATH: Record<UserRole, string> = {
  "super-admin":     "admin",
  "event-organiser": "event-organiser",
  "staff":           "staff",
  "student":         "student",
};

const PROFILE_TOAST_ID = "profile-completion";

function DashboardLayout({ children }: { children?: ReactNode }) {
  const { user } = useAuth();
  const { needsProfileCompletion } = useUser();
  const navigate = useNavigate();

  // ✅ single role string directly from user
  const role = user?.role as UserRole | undefined;

  const activeNavItems = (() => {
    switch (role) {
      case "super-admin":     return superAdminNavItems;
      case "event-organiser": return eventOrganiserNavItems;
      case "staff":           return staffNavItems;
      case "student":
      default:                return studentNavItems;
    }
  })();

  useEffect(() => {
    if (!needsProfileCompletion) {
      toast.dismiss(PROFILE_TOAST_ID);
      return;
    }

    const settingsSegment = role
      ? (ROLE_SETTINGS_PATH[role] ?? "student")
      : "student";

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
          onClick={() => {
            navigate(`/dashboard/${settingsSegment}/profile`);
            toast.dismiss(PROFILE_TOAST_ID);
          }}
          className="ml-2 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors shrink-0"
        >
          Complete Now
        </button>
      </div>,
      {
        id:          PROFILE_TOAST_ID,
        duration:    Infinity,
        closeButton: false,
      },
    );
  }, [needsProfileCompletion, role, navigate]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">
        <DashboardSidebar navItems={activeNavItems} />

        <main className="flex-1 flex flex-col min-w-0">
          <DashboardHeader />

          <div className="p-4 md:p-8 flex-1">
            {children ?? <Outlet />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default DashboardLayout;