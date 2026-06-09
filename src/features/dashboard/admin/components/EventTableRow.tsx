import { TableCell, TableRow } from "@/components/ui/table";
import StatusBadge from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Ban, Check, Eye, Pencil, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Event } from "@/types/event";
import { formatDate, formatMinutes } from "@/utils/format";
import useAuth from "@/hooks/useAuth";
import { useCancelEvent, useDeleteEvent, useUpdateEventStatus } from "@/hooks/useEvent";
import { toast } from "sonner";

interface EventTableRowProps {
    event: Event;
    index: number;
}

function EventTableRow({ event, index }: EventTableRowProps) {
    const { user } = useAuth();
    const updateStatus = useUpdateEventStatus();
    const cancelEvent = useCancelEvent();
    const deleteEvent = useDeleteEvent();

    const isSuperAdmin = user?.role?.toLowerCase() === "super-admin";
    const creator = user?.id === event.created_by;
    const canManageActions = isSuperAdmin || creator;

    const handleStatusChange = async (status: "approved" | "rejected") => {
        try {
            await updateStatus.mutateAsync({ id: event.id, status });
            toast.success(`Event ${status}`);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Could not update event status");
        }
    };

    const handleCancel = async () => {
        try {
            await cancelEvent.mutateAsync(event.id);
            toast.success("Event cancelled");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Could not cancel event");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteEvent.mutateAsync(event.id);
            toast.success("Event removed");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Could not remove event");
        }
    };

    return (
        <TableRow className="group hover:bg-slate-50/80 transition-colors">
            {/* Index Number */}
            <TableCell>
                <span className="text-sm font-bold px-6 text-slate-400">{index + 1}</span>
            </TableCell>

            {/* Event Details Thumbnail + Title */}
            <TableCell className="px-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="size-10 rounded-lg bg-slate-100 shrink-0 overflow-hidden border">
                        <img src={event.thumbnail} alt={event.title} className="size-full object-cover" />
                    </div>
                    <span className="font-bold text-[#001e40] tracking-tight line-clamp-1">{event.title}</span>
                </div>
            </TableCell>

            {/* Organization */}
            <TableCell className="text-center">
                <div className="flex flex-col">
                    <span className="font-semibold text-[#001e40]">
                        {event.organisation?.name ?? "N/A"}
                    </span>
                </div>
            </TableCell>

            {/* Category */}
            <TableCell className="text-sm text-slate-600 text-center">
                <span className="line-clamp-1">{event.category}</span>
            </TableCell>

            {/* Venue */}
            <TableCell className="text-sm text-slate-600">
                <span className="line-clamp-1">{event.venue?.name ?? "N/A"}</span>
            </TableCell>

            {/* Date & Time */}
            <TableCell>
                <span className="font-semibold text-[#001e40] whitespace-nowrap">{formatDate(event.start_date)}</span>
            </TableCell>

            <TableCell>
                <span className="font-semibold text-[#001e40] whitespace-nowrap text-center block">{formatMinutes(event.duration)}</span>
            </TableCell>

            {/* Capacity Progression Bar */}
            <TableCell>
                <div className="flex items-center gap-2 min-w-[120px]">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-700",
                                event.fillPercentage >= 100 ? "bg-emerald-500" : "bg-[#003366]"
                            )}
                            style={{ width: `${Math.min(event.fillPercentage, 100)}%` }}
                        />
                    </div>
                    <span className="text-xs font-bold text-slate-600">{event.capacity}</span>
                </div>
            </TableCell>

            {/* Event Status */}
            <TableCell>
                <StatusBadge status={event.status} />
            </TableCell>

            {/* Inline Actions Group */}
            <TableCell className="">
                <div className="flex items-center justify-end gap-1.5">
                    {/* View Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-[#001e40] hover:bg-slate-100 hover:text-[#001e40]"
                        title="View Event"
                        onClick={() => toast.info(event.description || "No event description available")}
                    >
                        <Eye className="size-4" />
                        <span className="sr-only">View</span>
                    </Button>

                    {/* Edit Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        title="Edit Event"
                        disabled={!creator}
                        onClick={() => toast.info("Event editing screen is coming next.")}
                    >
                        <Pencil className="size-4" />
                        <span className="sr-only">Edit</span>
                    </Button>

                    {/* Conditional Admin/Creator Actions */}
                    {canManageActions && (
                        <>
                            {/* Approve Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                                title="Approve Event"
                                disabled={updateStatus.isPending || event.status === "approved"}
                                onClick={() => handleStatusChange("approved")}
                            >
                                <Check className="size-4" />
                                <span className="sr-only">Approve</span>
                            </Button>

                            {/* Reject Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                                title="Reject Event"
                                disabled={updateStatus.isPending || event.status === "rejected"}
                                onClick={() => handleStatusChange("rejected")}
                            >
                                <X className="size-4" />
                                <span className="sr-only">Reject</span>
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                                title="Cancel Event"
                                disabled={cancelEvent.isPending || event.status === "cancelled"}
                                onClick={handleCancel}
                            >
                                <Ban className="size-4" />
                                <span className="sr-only">Cancel</span>
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-red-700 hover:bg-red-50 hover:text-red-800"
                                title="Delete Event"
                                disabled={deleteEvent.isPending}
                                onClick={handleDelete}
                            >
                                <Trash2 className="size-4" />
                                <span className="sr-only">Delete</span>
                            </Button>
                        </>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
}

export default EventTableRow;
