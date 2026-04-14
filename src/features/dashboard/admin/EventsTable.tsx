import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Event } from "@/types/event";
import EventTableRow from "./components/EventTableRow";


function EventsTable({ events }: { events: Event[] }) {
    return (
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <Table className="overflow-x-auto">
                <TableHeader className="bg-slate-50/50">
                    <TableRow>
                        <TableHead className="w-[350px] uppercase text-[11px] font-extrabold tracking-widest px-6 py-5">S/N</TableHead>
                        <TableHead className="w-[350px] uppercase text-[11px] font-extrabold tracking-widest">Event Title</TableHead>
                        <TableHead className="uppercase text-[11px] font-extrabold tracking-widest">Organizer</TableHead>
                        <TableHead className="uppercase text-[11px] font-extrabold tracking-widest">Venue</TableHead>
                        <TableHead className="uppercase text-[11px] font-extrabold tracking-widest">Date & Time</TableHead>
                        <TableHead className="uppercase text-[11px] font-extrabold tracking-widest">Capacity</TableHead>
                        <TableHead className="uppercase text-[11px] font-extrabold tracking-widest">Status</TableHead>
                        <TableHead className="text-right uppercase text-[11px] font-extrabold tracking-widest px-6">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {events.map((event, index) => (
                        <EventTableRow key={index} index={index} event={event} />
                    ))}
                </TableBody>
            </Table>

            {/* Pagination Strip */}
            <div className="px-6 py-4 flex items-center justify-between bg-slate-50/30 border-t">
                <span className="text-xs text-slate-500 font-medium italic">
                    Showing 2 of 24 scheduled events
                </span>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="size-8" disabled><ChevronLeft className="size-4" /></Button>
                    <Button size="sm" className="size-8 bg-[#001e40] font-bold p-0">1</Button>
                    <Button variant="ghost" size="sm" className="size-8 font-bold p-0 text-slate-400">2</Button>
                    <Button variant="ghost" size="icon" className="size-8"><ChevronRight className="size-4" /></Button>
                </div>
            </div>
        </div>
    )
}

export default EventsTable