import {
    TableCell,
    TableRow,
} from "@/components/ui/table";
import type { Venue } from "@/types/venue";
import { MapPin, MoreVertical, Image as ImageIcon } from "lucide-react";
import StatusBadge from "./StatusBadge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

function VenueTableRow({ venue, index }: { venue: Venue, index: number }) {
    return (
        <TableRow key={venue.id} className="group hover:bg-slate-50/80 transition-colors">
             <TableCell>
                <span className="text-sm font-bold px-6">{index + 1}</span>
            </TableCell>
            {/* 1. New Image Column */}
            <TableCell className="pl-6 py-4 w-[80px] gap-2">
                <div className="size-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                    {venue.image ? (
                        <img 
                            src={venue.image} 
                            alt={venue.name} 
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                    ) : (
                        <ImageIcon className="size-5 text-slate-300" />
                    )}
                </div>
                <div className="flex flex-col mt-2">
                    <span className="font-bold text-[#001e40] leading-tight">{venue.name}</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={10} /> {venue.location}
                    </span>
                </div>
            </TableCell>

            <TableCell>
                <span className="text-sm font-medium text-slate-600">{venue.type}</span>
            </TableCell>

            <TableCell>
                <span className="text-sm font-bold text-[#001e40]">{venue.capacity} Seats</span>
            </TableCell>

            <TableCell>
                <StatusBadge status={venue.status} />
            </TableCell>

            <TableCell className="px-6 text-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <MoreVertical size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem className="text-xs cursor-pointer">View Info</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs cursor-pointer">Edit Space</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs cursor-pointer">Schedule</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    )
}

export default VenueTableRow;