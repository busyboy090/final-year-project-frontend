import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  Download,
  Edit3,
  Loader2,
  MapPin,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useAuth from "@/hooks/useAuth";
import {
  exportEventAttendance,
  exportEventRegistrants,
  useEventAttendanceStats,
  useGetEvent,
} from "@/hooks/useEvent";
import { formatDate, formatMinutes } from "@/utils/format";
import type { EventAudienceRule } from "@/types/event";

const audienceRuleLabel = (rule: EventAudienceRule) => {
  const role = rule.role === "staff" ? "Staff" : "Students";
  const staffType =
    rule.staff_type === "academic-staff"
      ? "Academic staff"
      : rule.staff_type === "non-academic-staff"
        ? "Non-academic staff"
        : null;
  const level = rule.level?.name ?? (rule.level_id ? `Level #${rule.level_id}` : null);
  const gender = rule.gender ? `${rule.gender} only` : null;

  return [staffType ?? role, level, gender].filter(Boolean).join(" / ");
};

export default function EventDetailsPage() {
  const { id } = useParams();
  const eventId = Number(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: event, isLoading, isError } = useGetEvent(eventId);
  const { data: stats } = useEventAttendanceStats(eventId);

  const canManage =
    user?.role === "super-admin" || user?.id === event?.created_by;
  const editPath =
    user?.role === "super-admin"
      ? `/dashboard/admin/events/${event?.id}/edit`
      : `/dashboard/event-organiser/events/${event?.id}/edit`;

  const audienceLabels = useMemo(() => {
    if (!event || event.audience_scope !== "custom") return ["Everyone"];
    const labels = event.audienceRules?.map(audienceRuleLabel).filter(Boolean) ?? [];
    return labels.length ? labels : ["Custom audience"];
  }, [event]);

  const handleExport = async (type: "registrants" | "attendance") => {
    try {
      if (type === "registrants") {
        await exportEventRegistrants(eventId);
      } else {
        await exportEventAttendance(eventId);
      }
      toast.success("Export started");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not export CSV");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-[#001e40]" />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <Card>
        <CardContent className="py-16 text-center text-sm text-muted-foreground">
          Event details could not be loaded.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[#7b5800] text-xs uppercase tracking-widest font-bold mb-2">
            Event Details
          </p>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#001e40]">
            {event.title}
          </h1>
        </div>
        {canManage && (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => handleExport("registrants")}
            >
              <Download className="size-4" />
              Registrants
            </Button>
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => handleExport("attendance")}
            >
              <Download className="size-4" />
              Attendance
            </Button>
            <Button
              type="button"
              className="bg-[#001e40] text-white hover:bg-[#003366] gap-2"
              onClick={() => navigate(editPath)}
            >
              <Edit3 className="size-4" />
              Edit
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-8">
          <div className="aspect-video overflow-hidden rounded-t-xl bg-slate-100">
            <img
              src={event.thumbnail}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          </div>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-[#001e40]">{event.category}</Badge>
              <Badge variant="outline">{event.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7 text-slate-600 whitespace-pre-wrap">
              {event.description}
            </p>
          </CardContent>
        </Card>

        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Calendar className="size-4 text-[#7b5800]" />
                <span>{formatDate(event.start_date)}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="size-4 text-[#7b5800]" />
                <span>{event.venue?.name ?? "Venue TBA"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="size-4 text-[#7b5800]" />
                <span>{event.capacity} seats / {formatMinutes(event.duration)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Audience</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {audienceLabels.map((label) => (
                <Badge key={label} variant="outline" className="rounded-md">
                  {label}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attendance Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Enrolled</p>
                <p className="text-xl font-black text-[#001e40]">{stats?.total_enrolled ?? 0}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Attended</p>
                <p className="text-xl font-black text-[#001e40]">{stats?.total_attended ?? 0}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Cancelled</p>
                <p className="text-xl font-black text-[#001e40]">{stats?.total_cancelled ?? 0}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Rate</p>
                <p className="text-xl font-black text-[#001e40]">{stats?.attendance_rate ?? 0}%</p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
