
import { Download, RefreshCcw, UsersRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  exportEventAttendance,
  exportEventRegistrants,
  useEventAttendanceStats,
  useGetEvents,
  useRegenerateEnrollmentQr,
} from "@/hooks/useEvent";
import { formatDate } from "@/utils/format";

export default function Attendance() {
  const { data, isLoading, isError } = useGetEvents({ limit: 50, status: "approved" });
  const events = data?.events ?? [];
  const [selectedEventId, setSelectedEventId] = useState<number | undefined>();
  const [enrollmentId, setEnrollmentId] = useState("");
  const { data: selectedStats } = useEventAttendanceStats(selectedEventId);
  const regenerateQr = useRegenerateEnrollmentQr();

  const handleExport = async (eventId: number, type: "registrants" | "attendance") => {
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

  const handleRegenerateQr = async () => {
    const id = Number(enrollmentId);
    if (!id) {
      toast.error("Enter a valid enrollment ID");
      return;
    }

    try {
      await regenerateQr.mutateAsync(id);
      toast.success("QR regenerated and emailed");
      setEnrollmentId("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not regenerate QR");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7b5800]">
          Participation
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#001e40]">
          Attendance
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersRound className="size-4" />
            Approved Event Attendance
          </CardTitle>
          <CardDescription>Registration fill levels for events currently open or approved.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Capacity</TableHead>
                <TableHead className="text-right">Fill</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Loading attendance records...</TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-red-600">Could not load attendance records.</TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-semibold text-[#001e40]">{event.title}</TableCell>
                  <TableCell>{event.venue?.name ?? "No venue"}</TableCell>
                  <TableCell>{formatDate(event.start_date)}</TableCell>
                  <TableCell className="text-right">{event.capacity}</TableCell>
                  <TableCell className="text-right">{event.fillPercentage ?? 0}%</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => setSelectedEventId(event.id)}>
                        Stats
                      </Button>
                      <Button type="button" variant="outline" size="icon" onClick={() => handleExport(event.id, "registrants")} title="Export registrants">
                        <Download className="size-4" />
                      </Button>
                      <Button type="button" variant="outline" size="icon" onClick={() => handleExport(event.id, "attendance")} title="Export attendance">
                        <UsersRound className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <aside className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Event Stats</CardTitle>
            <CardDescription>Select an event row to inspect attendance totals.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {[
              ["Enrolled", selectedStats?.total_enrolled ?? 0],
              ["Attended", selectedStats?.total_attended ?? 0],
              ["Cancelled", selectedStats?.total_cancelled ?? 0],
              ["No-show", selectedStats?.no_show ?? 0],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-xl font-black text-[#001e40]">{value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Regenerate QR</CardTitle>
            <CardDescription>Send a fresh QR email for a known enrollment ID.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              value={enrollmentId}
              onChange={(event) => setEnrollmentId(event.target.value)}
              placeholder="Enrollment ID"
              inputMode="numeric"
            />
            <Button type="button" onClick={handleRegenerateQr} disabled={regenerateQr.isPending}>
              <RefreshCcw className="size-4" />
            </Button>
          </CardContent>
        </Card>
      </aside>
      </div>
    </div>
  );
}
