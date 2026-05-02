import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import useAuth from '@/hooks/useAuth';
import { convertRoleToTitle, formatName } from '@/utils/format';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Bell, Calendar as CalIcon, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from "react-router-dom";

function DashboardHeader() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    /**
     * 1. Permission-Based Logic (Recommended)
     * Instead of hardcoding roles, we check if the user has the 'create_event' permission.
     */
    const canCreateEvent = user?.permissions?.includes("create_event");

    /**
     * 2. Role-Based Display
     * Since a user can have multiple roles, we decide which one to show as the "Primary" title.
     * Usually, we take the first one or the most senior one.
     */
    const primaryRole = user?.roles?.[0] || "student";

    const handleLogout = async () => {
        await logout();
        navigate('/auth/login');
    };

    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-4 md:px-8 py-4 flex justify-between items-center border-b border-slate-100">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="text-[#001e40]" />
                <div className="h-6 w-px bg-slate-200 hidden md:block" />
                {/* Displaying the primary role title */}
                <h2 className="text-sm font-semibold text-slate-500 hidden md:block uppercase tracking-wider">
                    {primaryRole && convertRoleToTitle(primaryRole)}
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-3">
                    {
                        canCreateEvent &&
                        <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-bold shadow-lg hover:scale-95 transition-all">
                            <PlusCircle size={18} />
                            <span className="hidden lg:inline">Create Event</span>
                        </button>
                    }
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
                                    <AvatarImage src={user?.profile_picture_url || "https://github.com/shadcn.png"} />
                                    <AvatarFallback className="bg-[#001e40] text-white">
                                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-left hidden lg:block">
                                    <p className="text-xs font-bold text-[#001e40]">
                                        { user && user?.first_name && user?.last_name && formatName(user?.first_name, user?.last_name) }
                                    </p>
                                    <p className="text-[10px] text-slate-500 uppercase font-medium">
                                        {user?.roles?.length && user.roles.length > 1 
                                            ? `${convertRoleToTitle(primaryRole)} +${user.roles.length - 1}`
                                            : convertRoleToTitle(primaryRole)
                                        }
                                    </p>
                                </div>
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56 mt-2" align="end">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-bold text-[#001e40]">
                                        {user?.first_name} {user?.last_name}
                                    </p>
                                    <p className="text-xs text-slate-500">{user?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/dashboard/profile')}>
                                    <User className="mr-2 h-4 w-4" />Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />Settings
                                </DropdownMenuItem>
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
    )
}

export default DashboardHeader;