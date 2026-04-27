import Sidebar from './DashboardSidebar';
import {
  Bell, Calendar as CalIcon,
  Settings,
  PlusCircle,
  LogOut,
  User,
  CreditCard,
} from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { userNavItems } from '@/configs/nav-config';
import useAuth from '@/hooks/useAuth';

function StudentDashboardLayout({ children }: { children?: React.ReactNode }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };
  return (
    <SidebarProvider>
      <div className="flex bg-slate-50 min-h-screen font-sans">
        <Sidebar navItems={userNavItems} />

        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-4 md:px-8 py-4 flex justify-between items-center border-b border-slate-100">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-[#001e40]" />
              <div className="h-6 w-px bg-slate-200 hidden md:block" />
              <h2 className="text-sm font-semibold text-slate-500 hidden md:block uppercase tracking-wider">Student</h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-bold shadow-lg hover:scale-95 transition-all">
                  <PlusCircle size={18} />
                  <span className="hidden lg:inline">Create Event</span>
                </button>
                <button className="p-2 text-[#001e40] hover:bg-slate-100 rounded-full transition-colors">
                  <CalIcon size={20} />
                </button>
              </div>

              <div className="h-8 w-px bg-slate-200" />

              <div className="flex items-center gap-2">
                <button className="relative p-2 text-[#001e40] hover:bg-slate-100 rounded-full">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white" />
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 pl-2 group outline-none">
                      <Avatar className="h-9 w-9 border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback className="bg-[#001e40] text-white">BA</AvatarFallback>
                      </Avatar>
                      <div className="text-left hidden lg:block">
                        <p className="text-xs font-bold text-[#001e40]">{ user?.first_name + " " + user?.last_name }</p>
                        <p className="text-[10px] text-slate-500 uppercase font-medium">STUDENT</p>
                      </div>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-56 mt-2" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold text-[#001e40]">{ user?.first_name + " " + user?.last_name }</p>
                        <p className="text-xs text-slate-500">{ user?.email }</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="cursor-pointer"><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer"><CreditCard className="mr-2 h-4 w-4" />Billing</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer"><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <div className="p-4 md:p-8 flex-1">
            {children ? children : <Outlet />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default StudentDashboardLayout;