import { Link, useLocation } from 'react-router-dom';
import { type NavItem } from '@/configs/nav-config.ts';
import ADUNLOGO from '@/assets/logo.png';
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

export function DashboardSidebar({ navItems }: { navItems: NavItem[] }) {
  const location = useLocation();
  const { state, isMobile } = useSidebar();

  /**
   * isRailMode is true ONLY when:
   * 1. We are on Desktop (not mobile)
   * 2. The sidebar is explicitly collapsed
   */
  const isRailMode = state === "collapsed" && !isMobile;

  return (
    <Sidebar collapsible="icon" className="border-r-0 shadow-xl">
      <SidebarHeader className="bg-[#002244] pt-6 pb-4">
        <div className={cn(
          "flex items-center transition-all duration-300",
          // Center content only in Desktop Rail mode
          isRailMode ? "justify-center px-0" : "justify-start px-4 gap-3"
        )}>
          {/* Logo Container */}
          <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
            <img 
              src={ADUNLOGO} 
              alt="ADUN Logo" 
              className="size-7 object-contain" 
            />
          </div>

          {/* Branding Text: Hidden in Rail Mode, Visible in Mobile/Expanded */}
          {!isRailMode && (
            <div className="flex flex-col gap-0.5 min-w-0 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
              <h1 className="text-lg font-black text-white leading-none truncate">
                ADUN-EMS
              </h1>
              <p className="text-[10px] text-amber-500/80 uppercase tracking-widest mt-1 truncate">
                Event Management
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-[#002244] w-full">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className={cn(
              isRailMode ? 'w-full flex items-center gap-2' : "gap-1"
            )}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={cn(
                        "py-6 transition-all",
                        isActive 
                          ? 'bg-amber-500/10! text-amber-500! border-r-4 border-amber-500 rounded-none w-full' 
                          : 'text-slate-300 hover:bg-white/5! hover:text-white!'
                      )}
                    >
                      <Link to={item.path}>
                        <item.icon className="size- shrink-0" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-[#002244] p-4">
        {/* Only hide footer in Desktop Rail Mode */}
        {!isRailMode && (
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 animate-in fade-in zoom-in-95 duration-200">
            <p className="text-white/60 text-[10px] uppercase tracking-tighter mb-1">
              Academic Session
            </p>
            <p className="text-amber-500 font-bold text-sm">2023/2024</p>
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default DashboardSidebar;