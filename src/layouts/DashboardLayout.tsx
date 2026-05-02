import Sidebar from './DashboardSidebar';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { userNavItems, adminNavItems } from '@/configs/nav-config';
import DashboardHeader from './DashboardHeader';
import StudentProfileModal from '@/components/modals/StudentCompleteProfile';
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser"

function DashboardLayout({ children }: { children?: React.ReactNode }) {
    const { user } = useAuth();
    const { needsProfileCompletion } = useUser();

    /**
     * 1. Dynamic Navigation Logic
     * Check if the user has any administrative roles to determine which nav config to show.
     * For ADUN-EMS, we check if the roles array contains admin-level codes.
     */
    const isAdminView = user?.roles?.some(role => 
        ["super-admin", "faculty-admin", "department-admin", "student-affairs"].includes(role)
    );

    const activeNavItems = isAdminView ? adminNavItems : userNavItems;

  return (
    <SidebarProvider>
        {/* 
            2. Profile Completion Logic
            The 'needsProfileCompletion' flag from useUser now accounts for 
            multiple roles via the backend check.
        */}
        {
            needsProfileCompletion && <StudentProfileModal />
        }

      <div className="flex bg-slate-50 min-h-screen font-sans">
        {/* Pass the dynamically resolved navigation items */}
        <Sidebar navItems={activeNavItems} />

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