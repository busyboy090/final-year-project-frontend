import { TableCell, TableRow } from "@/components/ui/table";
import StatusBadge from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Event } from "@/types/event";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";


function EventTableRow({ event, index }: { event: Event, index: number }) {
    return (
        <TableRow key={event.id} className="group hover:bg-slate-50/80 transition-colors">
            <TableCell>
                <span className="text-sm font-bold px-6">{index + 1}</span>
            </TableCell>
            <TableCell className="px-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="size-10 rounded-lg bg-slate-100 shrink-0 overflow-hidden border">
                        <img src={event.thumbnail} alt="" className="size-full object-cover" />
                    </div>
                    <span className="font-bold text-[#001e40] tracking-tight">{event.title}</span>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[#001e40]">{event.organizer}</span>
                    <span className="text-[10px] text-slate-400">{event.department}</span>
                </div>
            </TableCell>
            <TableCell className="text-sm text-slate-600">{event.venue}</TableCell>
            <TableCell>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[#001e40]">{event.date}</span>
                    <span className="text-[10px] text-slate-400">{event.time}</span>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2 min-w-[120px]">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-700",
                                event.fillPercentage >= 100 ? "bg-emerald-500" : "bg-[#003366]"
                            )}
                            style={{ width: `${event.fillPercentage}%` }}
                        />
                    </div>
                    <span className="text-xs font-bold text-slate-600">{event.capacity}</span>
                </div>
            </TableCell>
            <TableCell>
                <StatusBadge status={event.status} />
            </TableCell>
            <TableCell className="text-right px-6">
                <DropdownMenu>
                    <DropdownMenuTrigger className="w-full">
                        <Button variant="ghost" size="icon" className="size-8 text-[#001e40] hover:bg-blue-50 mx-auto">
                            <EllipsisVertical className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Approve</DropdownMenuItem>
                        <DropdownMenuItem>Reject</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    )
}

export default EventTableRow