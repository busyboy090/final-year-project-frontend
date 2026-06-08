import { TableCell, TableRow } from "@/components/ui/table";
import StatusBadge from "./StatusBadge";
import { Button } from "@/components/ui/button";
// Imported Trash2 for the delete action
import { Eye, Pencil, Check, X, UserPlus, Loader2, Ban, Trash2 } from "lucide-react"; 
import { cn } from "@/lib/utils";
import type { Event, EventStatus } from "@/types/event";
import { formatDate, formatMinutes } from "@/utils/format";
import useAuth from "@/hooks/useAuth";
import { apiClient } from "@/apis/axios";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface EventTableRowProps {
    event: Event;
    index: number;
}

function EventTableRow({ event, index }: EventTableRowProps) {
    // Added "deleted" as a temporary target state for managing the delete spinner
    const [actionTarget, setActionTarget] = useState<EventStatus | "register" | "cancelled" | "deleted" | null>(null);
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const userRole = user?.role?.toLowerCase();
    const isSuperAdmin = userRole === "super-admin";
    const isStaff = userRole === "staff";
    const isStudent = userRole === "student";

    const creator = user?.id === event.created_by;
    const canManageActions = isSuperAdmin || creator;
    const canRegister = isStaff || isStudent;

    const isLoading = actionTarget !== null;
    const normalizedStatus = event.status?.toLowerCase();

    const updateStatus = async (status: EventStatus) => {
        if (isLoading) return;
        try {
            setActionTarget(status);
            await apiClient.patch(`/v1/events/${event.id}/status`, { status });
            toast.success(`Event status updated to ${status.toLowerCase()}`);

            await queryClient.invalidateQueries({
                queryKey: ["events"],
                exact: false,
                refetchType: "active"
            });
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to update event status");
        } finally {
            setActionTarget(null);
        }
    };

    const cancelEvent = async () => {
        if (isLoading) return;
        try {
            setActionTarget("cancelled");
            await apiClient.patch(`/v1/events/${event.id}/cancel`);
            toast.success("Event has been successfully cancelled");

            await queryClient.invalidateQueries({
                queryKey: ["events"],
                exact: false,
                refetchType: "active"
            });
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to cancel event");
        } finally {
            setActionTarget(null);
        }
    };

    const deleteEvent = async () => {
        if (isLoading) return;
        try {
            setActionTarget("deleted");
            await apiClient.delete(`/v1/events/${event.id}`);
            toast.success("Event has been successfully deleted");

            await queryClient.invalidateQueries({
                queryKey: ["events"],
                exact: false,
                refetchType: "active"
            });
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to delete event");
        } finally {
            setActionTarget(null);
        }
    };

    const handleRegister = async () => {
        if (isLoading) return;
        try {
            setActionTarget("register");
            console.log(`Registering user for event: ${event.title}`);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to register for event");
        } finally {
            setActionTarget(null);
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
                        {event.organization?.name ?? "N/A"}
                    </span>
                </div>
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
            <TableCell>
                <div className="flex items-center justify-center gap-1.5">
                    {/* View Button (Always visible to everyone) */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-[#001e40] hover:bg-slate-100 hover:text-[#001e40]"
                        title="View Event"
                        disabled={isLoading}
                    >
                        <Eye className="size-4" />
                        <span className="sr-only">View</span>
                    </Button>

                    {/* Register / Join Button */}
                    {canRegister && normalizedStatus !== "cancelled" && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            title="Register for Event"
                            disabled={isLoading}
                            onClick={handleRegister}
                        >
                            {actionTarget === "register" ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
                            <span className="sr-only">Register</span>
                        </Button>
                    )}

                    {/* Conditional Management Actions */}
                    {canManageActions && (
                        <>
                            {/* Edit Button: Visible to Event Organiser (creator) or Super Admin */}
                            {normalizedStatus !== "cancelled" && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    title="Edit Event"
                                    disabled={isLoading}
                                >
                                    <Pencil className="size-4" />
                                    <span className="sr-only">Edit</span>
                                </Button>
                            )}

                            {/* Delete Button: Visible ONLY to Event Organiser (creator) or Super Admin */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                                title="Delete Event"
                                disabled={isLoading}
                                onClick={deleteEvent}
                            >
                                {actionTarget === "deleted" ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                                <span className="sr-only">Delete</span>
                            </Button>

                            {/* Cancel Button: Shifted strictly to Super Admin based on rules */}
                            {isSuperAdmin && normalizedStatus !== "cancelled" && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                                    title="Cancel Event"
                                    disabled={isLoading}
                                    onClick={cancelEvent}
                                >
                                    {actionTarget === "cancelled" ? <Loader2 className="size-4 animate-spin" /> : <Ban className="size-4" />}
                                    <span className="sr-only">Cancel</span>
                                </Button>
                            )}

                            {/* Super Admin Moderation Workflows (Approve/Reject) */}
                            {isSuperAdmin && (
                                <>
                                    {/* Approve Button */}
                                    {["pending", "rejected"].includes(normalizedStatus) && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                                            title="Approve Event"
                                            disabled={isLoading}
                                            onClick={() => updateStatus("approved")}
                                        >
                                            {actionTarget === "approved" ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                                            <span className="sr-only">Approve</span>
                                        </Button>
                                    )}

                                    {/* Reject Button */}
                                    {["pending", "approved"].includes(normalizedStatus) && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                                            title="Reject Event"
                                            disabled={isLoading}
                                            onClick={() => updateStatus("rejected")}
                                        >
                                            {actionTarget === "rejected" ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
                                            <span className="sr-only">Reject</span>
                                        </Button>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
}

export default EventTableRow;