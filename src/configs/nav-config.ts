import {
    LayoutDashboard,
    CalendarDays,
    CalendarCog,
    MapPin,
    UserRoundCheck,
    CalendarCheck,
    ChartNoAxesColumn,
    Users,
    BarChart3,
    Building2,
    GraduationCap,
    Layers3,
    Wrench,
    ScanLine,
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
    { icon: CalendarDays, label: 'Calendar', path: '/dashboard/calendar' },
    { icon: CalendarCheck, label: 'Events', path: '/dashboard/admin/events' },
    { icon: MapPin, label: 'Venues', path: '/dashboard/admin/venues' },
    { icon: Building2, label: 'Faculties', path: '/dashboard/admin/faculties' },
    { icon: Layers3, label: 'Departments', path: '/dashboard/admin/departments' },
    { icon: Building2, label: 'Organisations', path: '/dashboard/admin/organisations' },
    { icon: CalendarCog, label: 'Sessions', path: '/dashboard/admin/sessions' },
    { icon: GraduationCap, label: 'Levels', path: '/dashboard/admin/levels' },
    { icon: Wrench, label: 'Facilities', path: '/dashboard/admin/facilities' },
    { icon: UserRoundCheck, label: 'Attendance', path: '/dashboard/admin/attendance' },
    { icon: ScanLine, label: 'Scan Check-In', path: '/dashboard/admin/scan' },
    { icon: Users, label: 'Users', path: '/dashboard/admin/users' },
    { icon: BarChart3, label: 'Reports', path: '/dashboard/admin/reports' },
];

export const studentNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/student', active: true },
    { icon: CalendarDays, label: 'Calendar', path: '/dashboard/calendar' },
    { icon: CalendarCheck, label: 'Events', path: '/dashboard/student/events' },
    { icon: UserRoundCheck, label: 'My Events', path: '/dashboard/student/my-events' },
    { icon: ChartNoAxesColumn, label: 'Analytics', path: '/dashboard/student/analytics' },
    { icon: User, label: 'Profile', path: '/dashboard/student/profile' }
  ];

export const staffNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/staff', active: true },
    { icon: CalendarDays, label: 'Calendar', path: '/dashboard/calendar' },
    { icon: CalendarCheck, label: 'Events', path: '/dashboard/staff/events' },
    { icon: UserRoundCheck, label: 'My Events', path: '/dashboard/staff/my-events' },
    { icon: ChartNoAxesColumn, label: 'Analytics', path: '/dashboard/staff/analytics' },
    { icon: User, label: 'Profile', path: '/dashboard/staff/profile' }
  ];

export const eventOrganiserNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/event-organiser', active: true },
    { icon: CalendarDays, label: 'Calendar', path: '/dashboard/calendar' },
    { icon: CalendarCheck, label: 'My Events', path: '/dashboard/event-organiser/my-events' },
    { icon: ScanLine, label: 'Scan Check-In', path: '/dashboard/event-organiser/scan' },
    { icon: ChartNoAxesColumn, label: 'Analytics', path: '/dashboard/event-organiser/analytics' },
    { icon: User, label: 'Profile', path: '/dashboard/event-organiser/profile' }
  ];