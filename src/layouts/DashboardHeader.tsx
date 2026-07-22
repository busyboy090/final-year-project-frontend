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
import useAuth from "@/hooks/useAuth";
import { convertRoleToTitle, formatName } from "@/utils/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PlusCircle,
  Calendar as CalIcon,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { UserRole } from "@/types/user";
import { formatRole } from "@/utils/format";
import useUser from "@/hooks/useUser";
import { Link } from "react-router-dom";

function DashboardHeader() {
  const { logout } = useAuth();
  const { profile, clearProfile } = useUser();
  const navigate = useNavigate();

  const role = profile?.role as UserRole | undefined;
  const roleTitle = role ? convertRoleToTitle(role) : "";

  const handleLogout = async () => {
    await logout();
    clearProfile();
    navigate("/auth/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-4 md:px-8 py-4 flex justify-between items-center border-b border-slate-100">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-[#001e40]" />
        <div className="h-6 w-px bg-slate-200 hidden md:block" />
        <h2 className="text-sm font-semibold text-slate-500 hidden md:block uppercase tracking-wider">
          {roleTitle}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-3">
          {/* Create Event button — visible to super-admin and event-organiser only */}
          {(role === "super-admin" || role === "event-organiser") && (
            <Link
              to="/dashboard/events/create"
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-bold shadow-lg hover:scale-95 transition-all"
            >
              <PlusCircle size={18} />
              <span className="hidden lg:inline">Create Event</span>
            </Link>
          )}
          <Link
            to="/dashboard/calendar"
            className="p-2 text-[#001e40] hover:bg-slate-100 rounded-full transition-colors"
          >
            <CalIcon size={20} />
          </Link>
        </div>

        <div className="h-8 w-px bg-slate-200" />

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 pl-2 group outline-none">
                <Avatar className="h-9 w-9 border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                  <AvatarImage
                    src={
                      profile?.profile_picture_url ||
                      "https://github.com/shadcn.png"
                    }
                  />
                  <AvatarFallback className="bg-[#001e40] text-white">
                    {profile?.first_name?.[0]}
                    {profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-bold text-[#001e40]">
                    {profile?.first_name &&
                      profile?.last_name &&
                      formatName(profile.first_name, profile.last_name)}
                  </p>
                  {/* ✅ single role — no array length check */}
                  <p className="text-[10px] text-slate-500 uppercase font-medium">
                    {roleTitle}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 mt-2" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold text-[#001e40]">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                  <p className="text-xs text-slate-500">{profile?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/dashboard/${profile?.role && formatRole(profile?.role)}/profile`,
                    )
                  }
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
