import { BarChart3, CalendarCheck, Clock, FileText } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/features/dashboard/components/StatCard";
import { useEventStats } from "@/hooks/useEvent";

export default function Reports() {
  const { data: stats, isLoading } = useEventStats();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7b5800]">
          Insights
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#001e40]">
          Reports
        </h1>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FileText} label="Total Events" value={isLoading ? "..." : String(stats?.total_events ?? 0)} trend="All time" />
        <StatCard icon={CalendarCheck} label="Approved Events" value={isLoading ? "..." : String(stats?.approved_events ?? 0)} trend="Published" />
        <StatCard icon={Clock} label="Pending Approval" value={isLoading ? "..." : String(stats?.pending_approval ?? 0)} isUpdate />
        <StatCard icon={BarChart3} label="Upcoming Events" value={isLoading ? "..." : String(stats?.upcoming_events ?? 0)} trend="Scheduled" />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Operational Summary</CardTitle>
          <CardDescription>Current report snapshot generated from the events registry.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="text-xs font-bold uppercase text-muted-foreground">Rejected Events</p>
            <p className="mt-2 text-2xl font-black text-[#001e40]">{stats?.rejected_events ?? 0}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-xs font-bold uppercase text-muted-foreground">Past Events</p>
            <p className="mt-2 text-2xl font-black text-[#001e40]">{stats?.past_events ?? 0}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
