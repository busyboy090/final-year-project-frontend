import { Outlet } from 'react-router-dom';
import { adminNavItems } from '@/configs/nav-config';
import { DashboardSidebar } from './DashboardSidebar';
import { SidebarProvider } from "@/components/ui/sidebar";
import type { ReactNode } from 'react';
import DashboardHeader from './DashboardHeader';


function AdminDashboardLayout({ children }: { children?: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">
        <DashboardSidebar navItems={adminNavItems} />

        <main className="flex-1 flex flex-col min-w-0">
          <DashboardHeader />

          <div className="p-4 md:p-8 flex-1">
            { children ? children : <Outlet /> }
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default AdminDashboardLayout;