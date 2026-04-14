import {
    LayoutDashboard,
    CalendarDays,
    MapPin,
    UserRoundCheck,
    CalendarCheck,
    ChartNoAxesColumn,
    Users,
    BarChart3,
    Settings,
    type LucideIcon
} from 'lucide-react';

export interface NavItem {
    icon: LucideIcon;
    label: string;
    path: string;
}

export const adminNavItems: NavItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/admin' },
    { icon: CalendarDays, label: 'Events', path: '/dashboard/admin/events' },
    { icon: MapPin, label: 'Venues', path: '/dashboard/admin/venues' },
    { icon: UserRoundCheck, label: 'Attendance', path: '/dashboard/admin/attendance' },
    { icon: Users, label: 'Users', path: '/dashboard/admin/users' },
    { icon: BarChart3, label: 'Reports', path: '/dashboard/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/dashboard/admin/settings' }
];

export const userNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/user', active: true },
    { icon: CalendarDays, label: 'Calendar', path: '/dashboard/user/calendar' },
    { icon: CalendarCheck, label: 'My Events', path: '/dashboard/user/my-events' },
    { icon: ChartNoAxesColumn, label: 'Analytics', path: '/dashboard/user/analytics' },
    { icon: Settings, label: 'Settings', path: '/dashboard/user/settings' }
  ];