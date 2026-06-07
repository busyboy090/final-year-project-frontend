import { CalendarDays, Loader2, MapPin, UserCheck } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetEvents, useJoinEvent, useMyEnrollments } from "@/hooks/useEvent";
import { formatDate, formatMinutes } from "@/utils/format";

export default function Events() {
  const { data, isLoading, isError } = useGetEvents({ status: "approved", limit: 50 });
  const { data: enrollments = [] } = useMyEnrollments();
  const joinEvent = useJoinEvent();
  const enrolledEventIds = new Set(enrollments.map((item) => item.event?.id).filter(Boolean));
  const events = data?.events ?? [];

  const handleJoin = async (eventId: number) => {
    try {
      await joinEvent.mutateAsync(eventId);
      toast.success("You are registered for this event");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not register for event");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7b5800]">
          Event Registry
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#001e40]">
          Available Events
        </h1>
      </div>

      {isLoading && (
        <div className="flex h-48 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 size-4 animate-spin" />
          Loading approved events...
        </div>
      )}

      {isError && (
        <Card>
          <CardContent className="py-10 text-center text-red-600">
            Could not load events.
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && (
        <div className="grid gap-5 lg:grid-cols-2">
          {events.map((event) => {
            const isEnrolled = enrolledEventIds.has(event.id);

            return (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>{event.category}</CardDescription>
                    </div>
                    <Badge variant={isEnrolled ? "secondary" : "default"}>
                      {isEnrolled ? "Registered" : "Open"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="line-clamp-3 text-sm text-muted-foreground">{event.description}</p>
                  <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="size-3.5" />
                      {formatDate(event.start_date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5" />
                      {event.venue?.name ?? "Venue pending"}
                    </span>
                    <span>{formatMinutes(event.duration)}</span>
                  </div>
                  <Button disabled={isEnrolled || joinEvent.isPending} onClick={() => handleJoin(event.id)}>
                    <UserCheck className="size-4" />
                    {isEnrolled ? "Registered" : "Register"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
