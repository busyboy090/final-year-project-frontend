import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Event } from "@/types/event";
import EventTableRow from "./components/EventTableRow";

// Typed the pagination prop to map your API schema safely
interface PaginationData {
    total: number;
    limit: number;
    page: number;
    pages: number;
}

interface EventsTableProps {
    events: Event[];
    pagination: PaginationData;
    onPageChange?: (page: number) => void; // Optional handler to change pages
}

function EventsTable({ events, pagination, onPageChange }: EventsTableProps) {
    const { total, limit, page, pages } = pagination;

    // Dynamically calculate the item boundaries for the "Showing X-Y of Z" metadata
    const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, total);

    return (
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            {/* Removed w-[350px] from S/N and added explicit right alignment for Actions header */}
                            <TableHead className="w-16 uppercase text-[11px] font-extrabold tracking-widest px-6 py-5">S/N</TableHead>
                            <TableHead className="min-w-[200px] uppercase text-[11px] font-extrabold tracking-widest">Event Title</TableHead>
                            <TableHead className="uppercase text-[11px] font-extrabold tracking-widest">Organizer</TableHead>
                            <TableHead className="uppercase text-[11px] font-extrabold tracking-widest text-center">Category</TableHead>
                            <TableHead className="uppercase text-center text-[11px] font-extrabold tracking-widest">Venue</TableHead>
                            <TableHead className="uppercase text-center text-[11px] font-extrabold tracking-widest">Date & Time</TableHead>
                            <TableHead className="uppercase text-[11px] font-extrabold tracking-widest">Duration</TableHead>
                            <TableHead className="uppercase text-[11px] font-extrabold tracking-widest text-center">Capacity</TableHead>
                            <TableHead className="uppercase text-[11px] font-extrabold tracking-widest text-center">Status</TableHead>
                            <TableHead className="text-center uppercase text-[11px] font-extrabold tracking-widest px-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center text-sm text-slate-500">
                                    No events found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            events.map((event, index) => (
                                // Replaced index with event.id for stable React reconciliation
                                <EventTableRow 
                                    key={event.id} 
                                    index={(page - 1) * limit + index} // Dynamic list serial sequencing across multiple pages
                                    event={event} 
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Dynamic Pagination Strip */}
            <div className="px-6 py-4 flex items-center justify-between bg-slate-50/30 border-t">
                <span className="text-xs text-slate-500 font-medium italic">
                    Showing {startItem} to {endItem} of {total} scheduled events
                </span>
                
                <div className="flex items-center gap-1">
                    {/* Previous Button */}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="size-8" 
                        disabled={page <= 1}
                        onClick={() => onPageChange?.(page - 1)}
                    >
                        <ChevronLeft className="size-4" />
                    </Button>
                    
                    {/* Numeric Indicators (Simple display for current page) */}
                    <Button size="sm" className="size-8 bg-[#001e40] text-white font-bold p-0 hover:bg-[#001e40]/90">
                        {page}
                    </Button>
                    
                    {/* Next Button */}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="size-8"
                        disabled={page >= pages}
                        onClick={() => onPageChange?.(page + 1)}
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default EventsTable;