import { Outlet } from 'react-router-dom';
import { adminNavItems, userNavItems } from '@/configs/nav-config';
import { DashboardSidebar } from './DashboardSidebar';
import { SidebarProvider } from "@/components/ui/sidebar";
import type { ReactNode } from 'react';
import DashboardHeader from './DashboardHeader';
import useAuth from '@/hooks/useAuth';
import useDashboard from '@/hooks/useDashboard';
import AddVenueModal from '@/components/modals/AddVenueModal';
import StudentProfileModal from '@/components/modals/StudentCompleteProfile';
import DashboardProvider from '@/contexts/DashboardProvider';


function DashboardLayout({ children }: { children?: ReactNode }) {
  const { user } = useAuth();
  const { isProfileModalOpen, isVenueModalOpen, closeVenueModal, closeProfileModal } = useDashboard();

  const isAdminView = user?.roles?.some(role =>
    ["super-admin", "faculty-admin", "department-admin", "student-affairs"].includes(role)
  );

  const activeNavItems = isAdminView ? adminNavItems : userNavItems;

  return (
    <DashboardProvider>
      <SidebarProvider>
        {isProfileModalOpen && <StudentProfileModal onClose={closeProfileModal} />}
        {isVenueModalOpen && <AddVenueModal onClose={closeVenueModal} />}

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
    </DashboardProvider>
  );
}

export default DashboardLayout;