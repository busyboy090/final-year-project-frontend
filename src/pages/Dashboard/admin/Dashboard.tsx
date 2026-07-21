import WelcomeBack from '@/components/ui/welcome-back';
import { useMemo } from 'react';
import StatCard from '@/features/dashboard/components/StatCard';
import { Calendar, CalendarDays, Mail, Users, Clock, ChevronRight } from 'lucide-react';
import { useEventStats, useGetEvents } from '@/hooks/useEvent';
import { formatDate } from '@/utils/format';
import StatusBadge from '@/features/dashboard/admin/components/StatusBadge';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function AdminDashboard() {
    const { data: stats } = useEventStats();
    const { data: recentEvents } = useGetEvents({ limit: 5 });
    // Computed once per mount, not on every render — passing `new Date()`
    // directly in the params object below made useGetEvents' query key
    // (["events", params]) change on every render, since react-query
    // serializes the Date and the timestamp differs by milliseconds each
    // time. That made every render look like a brand-new query, which
    // fetched, updated state, re-rendered, and fetched again forever.
    const now = useMemo(() => new Date(), []);
    const { data: upcomingEventsData } = useGetEvents({
        limit: 3,
        status: "approved",
        start_date_from: now,
    });
    const events = recentEvents?.events ?? [];
    const agendaEvents = (upcomingEventsData?.events ?? [])
        .slice()
        .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

    const quickActions = [
        { label: "Create New Event", to: "/dashboard/events/create" },
        { label: "View Calendar", to: "/dashboard/calendar" },
        { label: "Download Reports", to: "/dashboard/admin/reports" },
    ];

    const formatAgendaMonth = (date: Date) =>
        new Date(date).toLocaleDateString("en-US", { month: "short" }).toUpperCase();

    const formatAgendaDay = (date: Date) =>
        new Date(date).toLocaleDateString("en-US", { day: "2-digit" });

    const formatAgendaTime = (date: Date) =>
        new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

    return (
        <div className="px-2 pb-12">
            <div className='mb-4'>
                <WelcomeBack />
                <p className="text-slate-500 text-sm mt-1 font-medium">Monitoring the pulse of Admiralty University Events.</p>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard icon={Calendar} label="Upcoming Events" value={String(stats?.upcoming_events ?? 0)} trend="Scheduled" />
                <StatCard icon={CalendarDays} label="Approved Events" value={String(stats?.approved_events ?? 0)} trend="Published" />
                <StatCard icon={Mail} label="Pending Approvals" value={String(stats?.pending_approval ?? 0)} isUpdate={true} />
                <StatCard icon={Users} label="Total Events" value={String(stats?.total_events ?? 0)} trend="Registry" />
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Table Section */}
                <section className="xl:col-span-2 bg-white rounded-2xl p-8 shadow-sm flex flex-col h-137.5">
                    <div className="flex justify-between items-center mb-8 shrink-0">
                        <h4 className="text-xl font-extrabold text-[#001e40] flex items-center gap-2">
                            <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
                            Recent Events
                        </h4>
                        <div className="flex gap-2">
                            {/* Added View All Button */}
                            <Button asChild className="px-4 py-2 bg-slate-50 h-11 rounded-lg text-xs font-bold text-slate-700 border-slate-200 hover:bg-[#001e40] hover:text-white transition-all">
                                <Link to="/dashboard/admin/events">
                                    View All
                                </Link>
                            </Button>
                            <Button asChild className="px-4 py-2 bg-slate-50 h-11 rounded-lg text-xs font-bold text-slate-700 border-slate-200 hover:bg-[#001e40] hover:text-white transition-all">
                                <Link to="/dashboard/admin/reports">
                                    Reports
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 min-w-full">
                        <Table>
                            <TableHeader className="text-[10px] uppercase tracking-widest text-slate-500 font-bold sticky top-0 bg-white z-10">
                                <TableRow className="hover:bg-transparent border-b">
                                    <TableHead className="pb-4 h-auto font-bold text-slate-500 pl-0">Event Title</TableHead>
                                    <TableHead className="pb-4 h-auto font-bold text-slate-500">Date</TableHead>
                                    <TableHead className="pb-4 h-auto font-bold text-slate-500">Venue</TableHead>
                                    <TableHead className="pb-4 h-auto font-bold text-slate-500 pr-0">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="text-sm">
                                {events.map((event) => (
                                    <TableRow key={event.id} className="group hover:bg-slate-50 border-b transition-colors">
                                        <TableCell className="py-5 font-bold text-[#001e40] pl-0">{event.title}</TableCell>
                                        <TableCell className="py-5 text-slate-500">{formatDate(event.start_date)}</TableCell>
                                        <TableCell className="py-5 text-slate-500">{event.venue?.name ?? "No venue"}</TableCell>
                                        <TableCell className="py-5 pr-0">
                                            <StatusBadge status={event.status} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {events.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-10 text-center text-sm text-slate-500">
                                            No events have been created yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </section>

                {/* Sidebar Cards */}
                <aside className="space-y-8">
                    <div className="bg-[#001e40] text-white rounded-2xl p-8 relative overflow-hidden shadow-xl">
                        <h4 className="text-xl font-black mb-6 relative z-10">Quick Actions</h4>
                        <div className="space-y-3 relative z-10">
                            {quickActions.map((item) => (
                                <Link key={item.label} to={item.to} className="w-full flex items-center justify-between p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all border border-white/10 group">
                                    <span className="font-bold text-sm">{item.label}</span>
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-lg font-extrabold text-[#001e40]">Agenda</h4>
                            <Link to="/dashboard/admin/events" className="text-xs font-bold text-amber-600 uppercase hover:underline">See All</Link>
                        </div>
                        <div className="space-y-4">
                            {agendaEvents.map((event) => (
                                <Link key={event.id} to={`/dashboard/admin/events/${event.id}`} className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                    <div className="flex flex-col items-center justify-center w-12 h-14 bg-white rounded-lg border shadow-sm">
                                        <span className="text-[10px] font-black text-slate-400">{formatAgendaMonth(event.start_date)}</span>
                                        <span className="text-xl font-black text-[#001e40]">{formatAgendaDay(event.start_date)}</span>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-bold text-[#001e40] group-hover:text-amber-600">{event.title}</h5>
                                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                            <Clock size={12} /> {formatAgendaTime(event.start_date)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                            {agendaEvents.length === 0 && (
                                <div className="rounded-xl border border-dashed p-4 text-sm text-slate-500">
                                    No upcoming approved events yet.
                                </div>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default AdminDashboard;