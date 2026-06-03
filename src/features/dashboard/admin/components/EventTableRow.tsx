import { TableCell, TableRow } from "@/components/ui/table";
import StatusBadge from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Check, X } from "lucide-react"; // Imported specific action icons
import { cn } from "@/lib/utils";
import type { Event } from "@/types/event";
import { formatDate, formatMinutes } from "@/utils/format";
import useAuth from "@/hooks/useAuth";

interface EventTableRowProps {
    event: Event;
    index: number;
}

function EventTableRow({ event, index }: EventTableRowProps) {
    const { user } = useAuth();

    const isSuperAdmin = user?.role?.toLowerCase() === "super-admin";
    const creator = user?.id === event.created_by?.id;
    const canManageActions = isSuperAdmin || creator;

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
            <TableCell className="">
                <div className="flex items-center justify-end gap-1.5">
                    {/* View Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-[#001e40] hover:bg-slate-100 hover:text-[#001e40]"
                        title="View Event"
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
                            >
                                <X className="size-4" />
                                <span className="sr-only">Reject</span>
                            </Button>
                        </>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
}

export default EventTableRow;