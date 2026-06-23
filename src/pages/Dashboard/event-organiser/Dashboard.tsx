import {
  CalendarDays,
  Users,
  Wallet,
  TrendingUp,
  FileEdit,
  BarChart3,
  Pin,
  ArrowRight,
  ChevronUp,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import WelcomeBack from '@/components/ui/welcome-back';
import StatCard from '@/features/dashboard/components/StatCard';
import { useVenues } from '@/hooks/useVenue';
import { useEventStats, useGetEvents } from '@/hooks/useEvent';
import { formatDate } from '@/utils/format';
import useAuth from '@/hooks/useAuth';

export default function CuratorDashboardMain() {
  const { user } = useAuth();
  const { data: stats } = useEventStats();
  const { data: recentEventsData } = useGetEvents({ limit: 4, created_by: user?.id });
  const { data: upcomingEventsData } = useGetEvents({
    limit: 3,
    status: "approved",
    created_by: user?.id,
    start_date_from: new Date(),
  });
  const recentEvents = recentEventsData?.events ?? [];
  const upcomingEvents = (upcomingEventsData?.events ?? [])
    .slice()
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  const chartData = recentEvents.slice(0, 7).map((event) => {
    const value = Math.round(event.fillPercentage ?? 0);
    return {
      id: event.id,
      day: new Date(event.start_date).toLocaleDateString("en-US", { weekday: "short" }),
      title: event.title,
      value: Math.max(value, value > 0 ? 8 : 2),
      hoverVal: value,
    };
  });
  const peakFill = chartData.reduce((peak, item) => item.hoverVal > peak.hoverVal ? item : peak, { hoverVal: 0, day: "" });
  const latestEventUpdate = recentEvents
    .map((event) => new Date(event.updated_at ?? event.start_date).getTime())
    .filter(Number.isFinite)
    .sort((a, b) => b - a)[0];
  const recentEventsUpdatedLabel = latestEventUpdate
    ? `updated ${new Date(latestEventUpdate).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`
    : "no updates yet";

  // shadcn-safe status badge styles
  const statusConfig: Record<string, string> = {
    approved: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    rejected: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    cancelled: 'bg-muted text-muted-foreground ring-1 ring-border',
  };

  const { data: venues = [] } = useVenues({ limit: 3, status: "available" });
  const venueList = Array.isArray(venues) ? venues : [];
  const heroVenue = venueList[0];
  const sideVenues = venueList.slice(1);

  return (
    <div className="mx-auto space-y-10">

      {/* ── Header ── */}
      <div className="flex items-end justify-between">
        <div>
          <WelcomeBack />
          <p className="text-muted-foreground text-sm mt-1 font-medium tracking-wide">
            Curating your academic experience
          </p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={CalendarDays} label="Active Events" value={String(stats?.active_events ?? 0)} trend="Live now" />
        <StatCard icon={Users} label="Upcoming Events" value={String(stats?.upcoming_events ?? 0)} trend="Scheduled" />
        <StatCard icon={Wallet} label="Pending Approval" value={String(stats?.pending_approval ?? 0)} trend="Awaiting review" isUpdate={true} />
        <StatCard icon={TrendingUp} label="Registrations" value={String(stats?.total_registrations ?? 0)} trend="Confirmed" />
      </section>

      {/* ── Bento Grid ── */}
      <div className="grid grid-cols-12 gap-6">

        {/* ── Events Table ── */}
        <div className="col-span-12 lg:col-span-8 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-border">
            <div>
              <h3 className="font-heading text-lg font-bold tracking-tight text-foreground">My Recent Events</h3>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                {recentEvents.length} events · {recentEventsUpdatedLabel}
              </p>
            </div>
            <Link to="/dashboard/event-organiser/events" className="flex items-center gap-1 text-foreground font-bold text-xs hover:text-primary transition-colors group">
              View All
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[520px]">
              <thead>
                <tr className="bg-muted/40">
                  <th className="px-6 py-3 font-heading text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold">Event Name</th>
                  <th className="px-4 py-3 font-heading text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold">Date</th>
                  <th className="px-4 py-3 font-heading text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold">Status</th>
                  <th className="px-6 py-3 font-heading text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-t border-border hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${event.status === "approved" ? "bg-primary" : "bg-border"}`} />
                        <span className="font-semibold text-sm text-foreground leading-snug">{event.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground whitespace-nowrap">{formatDate(event.start_date)}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${statusConfig[event.status] ?? ''}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/dashboard/event-organiser/events/${event.id}/edit`} className="p-2 hover:bg-muted rounded-lg text-foreground transition-colors" title="Edit">
                          <FileEdit className="w-3.5 h-3.5" />
                        </Link>
                        <Link to={`/dashboard/event-organiser/events/${event.id}`} className="p-2 hover:bg-muted rounded-lg text-foreground transition-colors" title="Details">
                          <BarChart3 className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {recentEvents.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-muted-foreground">
                      No events have been created yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">

          <div className="relative bg-[#002244] rounded-2xl p-6 shadow-xl overflow-hidden">
            <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full border border-white/8" />
            <div className="pointer-events-none absolute -bottom-6 -left-6 w-28 h-28 rounded-full border border-white/5" />

            <div className="relative flex justify-between items-start mb-6">
              <div>
                <h3 className="font-heading text-base font-bold text-background">Upcoming Events</h3>
                <p className="text-[11px] text-background/50 mt-0.5 font-medium">{upcomingEvents.length} approved events scheduled</p>
              </div>
              <Pin className="w-4 h-4 text-background/70 mt-0.5 shrink-0" />
            </div>

            <div className="relative space-y-5 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-white/10">
              {upcomingEvents.map((event, index) => (
                <Link key={event.id} to={`/dashboard/event-organiser/events/${event.id}`} className="block relative pl-8 group cursor-pointer">
                  <div className={`
                    absolute left-0 top-1 w-6 h-6 rounded-full border-[3px] border-foreground z-10
                    flex items-center justify-center transition-all duration-200
                    ${index === 0
                      ? 'bg-background scale-110 border-background'
                      : 'bg-white/15 group-hover:bg-background/80 group-hover:border-background/80'
                    }
                  `} />
                  <p className={`text-[10px] uppercase tracking-widest font-black mb-0.5 ${index === 0 ? 'text-background' : 'text-background/40'}`}>
                    {formatDate(event.start_date)}
                  </p>
                  <h4 className="font-semibold text-sm text-background leading-snug">{event.title}</h4>
                  <p className="text-[11px] text-background/50 mt-0.5">{event.venue?.name ?? "Venue pending"}</p>
                </Link>
              ))}
              {upcomingEvents.length === 0 && (
                <div className="rounded-xl border border-white/10 p-4 text-sm text-background/70">
                  No approved upcoming events yet.
                </div>
              )}
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex-1">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="font-heading text-base font-bold text-foreground">Event Fill Levels</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">Recent event registration capacity</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mb-4">
              <ChevronUp className="w-3.5 h-3.5 text-foreground" />
              <span className="text-xs font-bold text-foreground">
                Peak: {peakFill.hoverVal}%{peakFill.day ? ` on ${peakFill.day}` : ""}
              </span>
            </div>

            <div className="h-36 flex items-end justify-between gap-1.5">
              {chartData.map((bar, index) => (
                <div key={bar.id} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className={`text-[9px] font-bold transition-opacity ${index === 0 ? 'text-foreground opacity-100' : 'opacity-0 group-hover:opacity-100 text-muted-foreground'}`}>
                    {bar.hoverVal}%
                  </span>
                  <div
                    className={`
                      w-full rounded-t-md transition-all duration-300 cursor-pointer
                      ${bar.hoverVal === peakFill.hoverVal && peakFill.hoverVal > 0
                        ? 'bg-primary shadow-sm hover:opacity-90'
                        : 'bg-muted hover:bg-muted-foreground/20'
                      }
                    `}
                    style={{ height: `${bar.value}%` }}
                  />
                </div>
              ))}
              {chartData.length === 0 && (
                <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
                  Fill levels appear after creating events.
                </div>
              )}
            </div>
            {chartData.length > 0 && <div className="flex justify-between mt-3">
              {chartData.map((bar, index) => (
                <span key={bar.id} className={`flex-1 text-center text-[9px] font-heading font-bold uppercase tracking-widest ${index === 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {bar.day}
                </span>
              ))}
            </div>}
          </div>
        </div>
      </div>

      {/* ── Campus Venues ── */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="font-heading text-2xl font-black text-foreground tracking-tight">Campus Venues</h3>
            <p className="text-muted-foreground text-sm font-medium mt-0.5">Quick reservation for your next academic session</p>
          </div>
          <Link to="/dashboard/event-organiser/events/create" className="hidden sm:flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:text-background hover:scale-95 transition-all">
            Create Event
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-7 relative rounded-2xl overflow-hidden group h-80 shadow-xl bg-muted">
            {heroVenue ? (
              <>
                <img
                  alt={heroVenue.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.65]"
                  src={heroVenue.thumbnail || "/favicon.svg"}
                />
                <div className="absolute inset-0 bg-linear-to-t from-foreground/90 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <div className="flex justify-between items-end gap-4">
                    <div>
                      <h4 className="text-background text-xl font-bold leading-tight">{heroVenue.name}</h4>
                      <p className="text-background/65 text-sm mt-1">
                        Capacity: {heroVenue.capacity} guests / {heroVenue.location}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-center text-sm text-muted-foreground">
                Available venues will appear here when they are added.
              </div>
            )}
          </div>

          <div className="col-span-12 md:col-span-5 flex flex-col gap-5">
            {sideVenues.map((venue: any) => (
              <div
                key={venue.name}
                className={`
                  bg-card rounded-2xl border border-l-4 border-amber-500
                  flex items-center gap-5 p-5 group cursor-pointer
                  hover:bg-muted/30 hover:shadow-md
                  transition-all duration-200 shadow-sm
                `}
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-sm">
                  <img
                    alt={venue.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-105 group-hover:scale-110 transition-all duration-500"
                    src={venue.thumbnail}
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-foreground leading-snug truncate">{venue.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{venue.capacity} capacity</p>
                  <span className={`text-[10px] font-black uppercase tracking-widest mt-2 block`}>
                    {venue.status}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-border shrink-0 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
            {sideVenues.length === 0 && (
              <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                No additional available venues found.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
