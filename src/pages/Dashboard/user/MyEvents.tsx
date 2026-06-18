import { Calendar, CheckCircle2, Loader2, MapPin, QrCode, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  useCancelEnrollment,
  useCheckInEnrollment,
  useMyEnrollments,
} from "@/hooks/useEvent";
import { formatDate } from "@/utils/format";

export default function MyEvents() {
  const { data: enrollments = [], isLoading, isError } = useMyEnrollments();
  const cancelEnrollment = useCancelEnrollment();
  const checkInEnrollment = useCheckInEnrollment();

  const handleCancel = async (id: number) => {
    try {
      await cancelEnrollment.mutateAsync(id);
      toast.success("Registration cancelled");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not cancel registration");
    }
  };

  const handleCheckIn = async (id: number) => {
    try {
      await checkInEnrollment.mutateAsync(id);
      toast.success("Checked in successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not check in");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[#7b5800] text-xs uppercase tracking-widest font-bold mb-2">
          Registration Ledger
        </p>
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#001e40]">
          My Events
        </h1>
      </div>

      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-[#001e40]" />
        </div>
      )}

      {isError && (
        <Card>
          <CardContent className="py-16 text-center text-sm text-red-600">
            Could not load your registered events.
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && enrollments.length === 0 && (
        <Card>
          <CardContent className="py-20 text-center">
            <Calendar className="mx-auto mb-4 size-10 text-slate-300" />
            <p className="font-bold text-[#001e40]">No registered events yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Events you register for will appear here.
            </p>
          </CardContent>
        </Card>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {enrollments.map((enrollment) => {
          const event = enrollment.event;
          const isCancelled = enrollment.status === "cancelled";
          const isAttended = enrollment.status === "attended";

          return (
            <Card key={enrollment.id} className="overflow-hidden">
              <div className="h-44 bg-slate-100">
                {event?.thumbnail ? (
                  <img
                    src={event.thumbnail}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <Calendar className="size-10" />
                  </div>
                )}
              </div>
              <CardContent className="p-6 space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-[#001e40] leading-tight">
                      {event?.title ?? "Untitled event"}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                      {event?.start_date && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="size-3.5" />
                          {formatDate(new Date(event.start_date))}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5" />
                        {event?.venue?.name ?? "Venue TBA"}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={isCancelled ? "outline" : "default"}
                    className={isAttended ? "bg-emerald-600" : undefined}
                  >
                    {enrollment.status}
                  </Badge>
                </div>

                <p className="line-clamp-2 text-sm text-slate-500">
                  {event?.description ?? "No description available."}
                </p>

                <div className="flex flex-wrap items-center gap-2 border-t pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    disabled={!enrollment.qr_token}
                    onClick={() => {
                      if (enrollment.qr_token) {
                        navigator.clipboard?.writeText(enrollment.qr_token);
                        toast.success("QR token copied");
                      }
                    }}
                  >
                    <QrCode className="size-4" />
                    Copy QR Token
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 text-emerald-700"
                    disabled={isCancelled || isAttended || checkInEnrollment.isPending}
                    onClick={() => handleCheckIn(enrollment.id)}
                  >
                    <CheckCircle2 className="size-4" />
                    Check In
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 text-red-700"
                    disabled={isCancelled || cancelEnrollment.isPending}
                    onClick={() => handleCancel(enrollment.id)}
                  >
                    <XCircle className="size-4" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
