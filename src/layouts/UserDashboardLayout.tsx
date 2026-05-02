import Sidebar from './DashboardSidebar';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { userNavItems } from '@/configs/nav-config';
import DashboardHeader from './DashboardHeader';

function StudentDashboardLayout({ children }: { children?: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex bg-slate-50 min-h-screen font-sans">
        <Sidebar navItems={userNavItems} />

        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <DashboardHeader />

          <div className="p-4 md:p-8 flex-1">
            {children ? children : <Outlet />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default StudentDashboardLayout;