import {
    LayoutDashboard,
    CalendarDays,
    MapPin,
    UserRoundCheck,
    CalendarCheck,
    ChartNoAxesColumn,
    Users,
    BarChart3,
    Building2,
    Layers3,
    Wrench,
    Settings,
    type LucideIcon,
    User
} from 'lucide-react';

export interface NavItem {
    icon: LucideIcon;
    label: string;
    path: string;
}

export const superAdminNavItems: NavItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/admin' },
    { icon: CalendarDays, label: 'Events', path: '/dashboard/admin/events' },
    { icon: MapPin, label: 'Venues', path: '/dashboard/admin/venues' },
    { icon: Building2, label: 'Faculties', path: '/dashboard/admin/faculties' },
    { icon: Layers3, label: 'Departments', path: '/dashboard/admin/departments' },
    { icon: Wrench, label: 'Facilities', path: '/dashboard/admin/facilities' },
    { icon: UserRoundCheck, label: 'Attendance', path: '/dashboard/admin/attendance' },
    { icon: Users, label: 'Users', path: '/dashboard/admin/users' },
    { icon: BarChart3, label: 'Reports', path: '/dashboard/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/dashboard/admin/settings' }
];

export const studentNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/student', active: true },
    { icon: CalendarDays, label: 'Calendar', path: '/dashboard/student/calendar' },
    { icon: CalendarCheck, label: 'Events', path: '/dashboard/student/events' },
    { icon: ChartNoAxesColumn, label: 'Analytics', path: '/dashboard/student/analytics' },
    { icon: User, label: 'Profile', path: '/dashboard/student/profile' },
    { icon: Settings, label: 'Settings', path: '/dashboard/student/settings' }
  ];

export const staffNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/staff', active: true },
    { icon: CalendarDays, label: 'Calendar', path: '/dashboard/staff/calendar' },
    { icon: CalendarCheck, label: 'Events', path: '/dashboard/staff/events' },
    { icon: ChartNoAxesColumn, label: 'Analytics', path: '/dashboard/staff/analytics' },
    { icon: User, label: 'Profile', path: '/dashboard/staff/profile' },
    { icon: Settings, label: 'Settings', path: '/dashboard/staff/settings' }
  ];

export const eventOrganiserNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/event-organiser', active: true },
    { icon: CalendarDays, label: 'Calendar', path: '/dashboard/event-organiser/calendar' },
    { icon: CalendarCheck, label: 'My Events', path: '/dashboard/event-organiser/my-events' },
    { icon: ChartNoAxesColumn, label: 'Analytics', path: '/dashboard/event-organiser/analytics' },
    { icon: User, label: 'Profile', path: '/dashboard/event-organiser/profile' },
    { icon: Settings, label: 'Settings', path: '/dashboard/event-organiser/settings' }
  ];
