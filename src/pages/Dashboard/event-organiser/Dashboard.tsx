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
  const recentEvents = recentEventsData?.events ?? [];

  const deadlines = [
    { id: 1, day: "Today",  title: "Submit catering for Symposium",   detail: "Vendor: Royal Palate Ltd.",     active: true  },
    { id: 2, day: "Oct 16", title: "Finalize AV for Lecture",         detail: "Venue: Grand Hall A",           active: false },
    { id: 3, day: "Oct 18", title: "Guest Speaker RSVP Follow-up",    detail: "Dept of Maritime Studies",      active: false },
  ];

  const chartData = [
    { day: "Mon", value: 40,  hoverVal: 120 },
    { day: "Tue", value: 55,  hoverVal: 145 },
    { day: "Wed", value: 85,  hoverVal: 210 },
    { day: "Thu", value: 95,  hoverVal: 245, highlight: true },
    { day: "Fri", value: 70,  hoverVal: 180 },
    { day: "Sat", value: 60,  hoverVal: 160 },
    { day: "Sun", value: 45,  hoverVal: 130 },
  ];

  // shadcn-safe status badge styles
  const statusConfig: Record<string, string> = {
    approved: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    rejected: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    cancelled: 'bg-muted text-muted-foreground ring-1 ring-border',
  };

  const { data: venues = [] } = useVenues({ limit: 3, status: "available" })

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
        <StatCard icon={TrendingUp} label="Approved Events" value={String(stats?.approved_events ?? 0)} trend="Published" />
      </section>

      {/* ── Bento Grid ── */}
      <div className="grid grid-cols-12 gap-6">

        {/* ── Events Table ── */}
        <div className="col-span-12 lg:col-span-8 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-border">
            <div>
              <h3 className="font-heading text-lg font-bold tracking-tight text-foreground">My Recent Events</h3>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">{recentEvents.length} events · updated just now</p>
            </div>
            <button className="flex items-center gap-1 text-foreground font-bold text-xs hover:text-primary transition-colors group">
              View All
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
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
                        <button className="p-2 hover:bg-muted rounded-lg text-foreground transition-colors" title="Edit">
                          <FileEdit className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg text-foreground transition-colors" title="Analytics">
                          <BarChart3 className="w-3.5 h-3.5" />
                        </button>
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

          {/* Deadlines card — uses foreground (near-black) as bg for contrast */}
          <div className="relative bg-[#002244] rounded-2xl p-6 shadow-xl overflow-hidden">
            {/* Decorative rings */}
            <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full border border-white/8" />
            <div className="pointer-events-none absolute -bottom-6 -left-6 w-28 h-28 rounded-full border border-white/5" />

            <div className="relative flex justify-between items-start mb-6">
              <div>
                <h3 className="font-heading text-base font-bold text-background">This Week's Deadlines</h3>
                <p className="text-[11px] text-background/50 mt-0.5 font-medium">3 tasks remaining</p>
              </div>
              <Pin className="w-4 h-4 text-background/70 mt-0.5 shrink-0" />
            </div>

            {/* Timeline */}
            <div className="relative space-y-5 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-white/10">
              {deadlines.map((item) => (
                <div key={item.id} className="relative pl-8 group cursor-pointer">
                  <div className={`
                    absolute left-0 top-1 w-6 h-6 rounded-full border-[3px] border-foreground z-10
                    flex items-center justify-center transition-all duration-200
                    ${item.active
                      ? 'bg-background scale-110 border-background'
                      : 'bg-white/15 group-hover:bg-background/80 group-hover:border-background/80'
                    }
                  `} />
                  <p className={`text-[10px] uppercase tracking-widest font-black mb-0.5 ${item.active ? 'text-background' : 'text-background/40'}`}>
                    {item.day}
                  </p>
                  <h4 className="font-semibold text-sm text-background leading-snug">{item.title}</h4>
                  <p className="text-[11px] text-background/50 mt-0.5">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Trends */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex-1">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="font-heading text-base font-bold text-foreground">Registration Trends</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">Daily new sign-ups</p>
              </div>
              <select className="bg-muted border-none text-[11px] font-bold rounded-lg px-2.5 py-1.5 text-foreground outline-none cursor-pointer hover:bg-border transition-colors">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>

            {/* Peak callout */}
            <div className="flex items-center gap-1.5 mb-4">
              <ChevronUp className="w-3.5 h-3.5 text-foreground" />
              <span className="text-xs font-bold text-foreground">Peak: 245 on Thu</span>
            </div>

            {/* Chart bars */}
            <div className="h-36 flex items-end justify-between gap-1.5">
              {chartData.map((bar, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className={`text-[9px] font-bold transition-opacity ${bar.highlight ? 'text-foreground opacity-100' : 'opacity-0 group-hover:opacity-100 text-muted-foreground'}`}>
                    {bar.hoverVal}
                  </span>
                  <div
                    className={`
                      w-full rounded-t-md transition-all duration-300 cursor-pointer
                      ${bar.highlight
                        ? 'bg-primary shadow-sm hover:opacity-90'
                        : 'bg-muted hover:bg-muted-foreground/20'
                      }
                    `}
                    style={{ height: `${bar.value}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3">
              {chartData.map((bar, index) => (
                <span key={index} className={`flex-1 text-center text-[9px] font-heading font-bold uppercase tracking-widest ${bar.highlight ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {bar.day}
                </span>
              ))}
            </div>
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
          <button className="hidden sm:flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:text-background hover:scale-95 transition-all">
            Browse All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Hero venue card */}
          <div className="col-span-12 md:col-span-7 relative rounded-2xl overflow-hidden group cursor-pointer h-80 shadow-xl">
            <img
              alt="The Great Admiral Hall"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.65]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe1RIJDK_venMyycZuErjZHLK31dyRDw6S_8pUP0BHrmaxBxFB6o5Ymx1aC2LqnBkTADo_YXwKRqtsjDJisG0G60adGcDDDG3YVhEL9S7sOPzLu2CoHYFfzmQd9e0e7Y4kE38-QTtOkk7VOK5nhGslNf9H72y-qFtrcZAn4yO_OkoAJ8fC0A9aFAVzW4SldU8io9vEPm6mzHBrmYNASKwSeu6X8dQ0ku0IPreaNWZvBZLHR0lFszPJbVRx6GfPgz37-3xGgzLyFE0"
            />
            <div className="absolute inset-0 bg-linear-to-t from-foreground/90 via-foreground/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-7">
              <div className="flex justify-between items-end gap-4">
                <div>
                  <h4 className="text-background text-xl font-bold leading-tight">The Great Admiral Hall</h4>
                  <p className="text-background/65 text-sm mt-1">Capacity: 500 Guests · AV Ready · Catering Support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar venue cards */}
          <div className="col-span-12 md:col-span-5 flex flex-col gap-5">
            {Array.isArray(venues) && venues.map((venue: any) => (
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
                  <p className="text-xs text-muted-foreground mt-0.5">{venue.capacity}</p>
                  <span className={`text-[10px] font-black uppercase tracking-widest mt-2 block`}>
                    {venue.availability}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-border shrink-0 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
