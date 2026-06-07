
import { UsersRound } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetEvents } from "@/hooks/useEvent";
import { formatDate } from "@/utils/format";

export default function Attendance() {
  const { data, isLoading, isError } = useGetEvents({ limit: 50, status: "approved" });
  const events = data?.events ?? [];

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
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Loading attendance records...</TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-red-600">Could not load attendance records.</TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-semibold text-[#001e40]">{event.title}</TableCell>
                  <TableCell>{event.venue?.name ?? "No venue"}</TableCell>
                  <TableCell>{formatDate(event.start_date)}</TableCell>
                  <TableCell className="text-right">{event.capacity}</TableCell>
                  <TableCell className="text-right">{event.fillPercentage ?? 0}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
