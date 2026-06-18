import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  MapPin,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetEvents, useMyEnrollments } from "@/hooks/useEvent";
import useAuth from "@/hooks/useAuth";
import type { Event, EventStatus } from "@/types/event";
import { cn } from "@/lib/utils";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const statusStyles: Record<EventStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  cancelled: "bg-slate-100 text-slate-500 border-slate-200",
};

const dateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const formatMonthTitle = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

const formatFullDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

const formatTime = (date: Date | string) =>
  new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const getEventPath = (eventId: number, role?: string) => {
  if (role === "super-admin" || role === "admin") {
    return `/dashboard/admin/events/${eventId}`;
  }
  if (role === "event-organiser") {
    return `/dashboard/event-organiser/events/${eventId}`;
  }
  if (role === "staff") return `/dashboard/staff/events/${eventId}`;
  return `/dashboard/student/events/${eventId}`;
};

const getCalendarScope = (role?: string) => {
  if (role === "super-admin" || role === "admin") {
    return "All events across the registry.";
  }
  if (role === "event-organiser") {
    return "Your created events grouped by schedule.";
  }
  return "Approved events available to you, with your registered events marked.";
};

function CalendarEventPill({
  event,
  registered,
  compact = false,
}: {
  event: Event;
  registered: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-md border px-2 py-1 text-left text-[11px] leading-tight",
        statusStyles[event.status],
      )}
    >
      <div className="flex items-center gap-1.5">
        {registered && <CheckCircle2 className="size-3 shrink-0" />}
        <span className={cn("font-bold", compact && "truncate")}>
          {event.title}
        </span>
      </div>
      {!compact && (
        <div className="mt-1 flex items-center gap-1 text-[10px] opacity-80">
          <Clock className="size-3" />
          {formatTime(event.start_date)}
        </div>
      )}
    </div>
  );
}

export default function CalendarPage() {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(() => startOfDay(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));

  const monthStart = useMemo(
    () => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
    [currentMonth],
  );
  const monthEnd = useMemo(
    () => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0),
    [currentMonth],
  );
  const gridStart = useMemo(
    () => addDays(monthStart, -monthStart.getDay()),
    [monthStart],
  );
  const gridDays = useMemo(
    () => Array.from({ length: 42 }, (_, index) => addDays(gridStart, index)),
    [gridStart],
  );
  const gridEnd = gridDays[gridDays.length - 1] ?? monthEnd;

  const isUserCalendar = user?.role === "staff" || user?.role === "student";
  const isOrganiserCalendar = user?.role === "event-organiser";

  const { data, isLoading, isError } = useGetEvents({
    limit: 100,
    status: isUserCalendar ? "approved" : undefined,
    created_by: isOrganiserCalendar ? user?.id : undefined,
    start_date_from: gridStart,
    start_date_to: gridEnd,
  });
  const { data: enrollments = [] } = useMyEnrollments();

  const registeredEventIds = useMemo(() => {
    return new Set(
      enrollments
        .filter((item) => item.status !== "cancelled")
        .map((item) => item.event?.id)
        .filter(Boolean),
    );
  }, [enrollments]);

  const events = data?.events ?? [];
  const eventsByDay = useMemo(() => {
    const map = new Map<string, Event[]>();

    events.forEach((event) => {
      const start = startOfDay(new Date(event.start_date));
      const end = startOfDay(new Date(event.end_date || event.start_date));
      let cursor = start;

      while (cursor <= end) {
        const key = dateKey(cursor);
        if (!map.has(key)) map.set(key, []);
        map.get(key)?.push(event);
        cursor = addDays(cursor, 1);
      }
    });

    map.forEach((dayEvents) => {
      dayEvents.sort(
        (a, b) =>
          new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
      );
    });

    return map;
  }, [events]);

  const selectedEvents = eventsByDay.get(dateKey(selectedDate)) ?? [];
  const registeredCount = events.filter((event) =>
    registeredEventIds.has(event.id),
  ).length;

  const moveMonth = (amount: number) => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + amount, 1);
    setCurrentMonth(next);
    setSelectedDate(next);
  };

  const goToday = () => {
    const today = startOfDay(new Date());
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7b5800]">
            Event Schedule
          </p>
          <h1 className="mt-1 text-4xl font-black tracking-tight text-[#001e40]">
            Calendar
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {getCalendarScope(user?.role)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => moveMonth(-1)}>
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <Button variant="outline" onClick={goToday}>
            Today
          </Button>
          <Button variant="outline" onClick={() => moveMonth(1)}>
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Month
          </p>
          <p className="mt-2 text-2xl font-black text-[#001e40]">
            {formatMonthTitle(currentMonth)}
          </p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Events Displayed
          </p>
          <p className="mt-2 text-2xl font-black text-[#001e40]">
            {isLoading ? "..." : events.length}
          </p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Registered
          </p>
          <p className="mt-2 text-2xl font-black text-[#001e40]">
            {isUserCalendar ? registeredCount : "N/A"}
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="grid grid-cols-7 border-b bg-slate-50">
            {WEEK_DAYS.map((day) => (
              <div
                key={day}
                className="px-3 py-3 text-center text-[10px] font-black uppercase tracking-widest text-slate-500"
              >
                {day}
              </div>
            ))}
          </div>

          {isLoading ? (
            <div className="flex h-96 items-center justify-center gap-3 text-slate-500">
              <Loader2 className="size-5 animate-spin" />
              Loading calendar events...
            </div>
          ) : isError ? (
            <div className="flex h-96 items-center justify-center text-sm font-semibold text-red-600">
              Could not load calendar events.
            </div>
          ) : (
            <div className="grid grid-cols-7">
              {gridDays.map((day) => {
                const key = dateKey(day);
                const dayEvents = eventsByDay.get(key) ?? [];
                const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                const isSelected = key === dateKey(selectedDate);
                const isToday = key === dateKey(new Date());
                const registeredToday = dayEvents.some((event) =>
                  registeredEventIds.has(event.id),
                );

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "min-h-32 border-b border-r p-2 text-left transition-colors hover:bg-slate-50",
                      !isCurrentMonth && "bg-slate-50/60 text-slate-400",
                      isSelected && "bg-[#001e40]/5 ring-2 ring-inset ring-[#001e40]",
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className={cn(
                          "flex size-7 items-center justify-center rounded-full text-xs font-black",
                          isToday && "bg-[#7b5800] text-white",
                        )}
                      >
                        {day.getDate()}
                      </span>
                      {registeredToday && (
                        <CheckCircle2 className="size-4 text-emerald-600" />
                      )}
                    </div>

                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <CalendarEventPill
                          key={`${key}-${event.id}`}
                          event={event}
                          registered={registeredEventIds.has(event.id)}
                          compact
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <aside className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#7b5800]">
                Selected Day
              </p>
              <h2 className="mt-1 text-xl font-black text-[#001e40]">
                {formatFullDate(selectedDate)}
              </h2>
            </div>
            <CalendarDays className="size-5 text-[#7b5800]" />
          </div>

          <div className="space-y-3">
            {selectedEvents.map((event) => {
              const registered = registeredEventIds.has(event.id);

              return (
                <Link
                  key={event.id}
                  to={getEventPath(event.id, user?.role)}
                  className="block rounded-xl border p-4 transition-colors hover:bg-slate-50"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-[#001e40]">
                        {event.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {event.category}
                      </p>
                    </div>
                    {registered && (
                      <Badge className="bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="size-3" />
                        Registered
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 text-xs font-semibold text-slate-500">
                    <p className="flex items-center gap-2">
                      <Clock className="size-3.5" />
                      {formatTime(event.start_date)} - {formatTime(event.end_date)}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="size-3.5" />
                      {event.venue?.name ?? "Venue TBA"}
                    </p>
                  </div>

                  <CalendarEventPill
                    event={event}
                    registered={registered}
                  />
                </Link>
              );
            })}

            {selectedEvents.length === 0 && (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">
                No events scheduled for this day.
              </div>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
