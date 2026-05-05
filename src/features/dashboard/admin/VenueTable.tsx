import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Search, Filter, Inbox } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Venue } from "@/types/venue";
import VenueTableRow from "./components/VenueTableRow";
import { VenueTableRowSkeleton } from "./components/VenueTableRowSkeleton";
import { useVenues } from "@/hooks/useVenue";

function VenueTable() {
    const { data: venues, isLoading } = useVenues();
    
    // Check if we have data and it's empty
    const isEmpty = !isLoading && (!venues || venues.length === 0);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input placeholder="Search venues..." className="pl-10 bg-white" />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter size={16} /> Filters
                </Button>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="uppercase text-[11px] font-extrabold tracking-widest px-6 py-4">S/N</TableHead>
                            <TableHead className="w-[300px] uppercase text-[11px] font-extrabold tracking-widest px-6 py-4">Venue Name</TableHead>
                            <TableHead className="uppercase text-[11px] font-extrabold tracking-widest">Type</TableHead>
                            <TableHead className="uppercase text-[11px] font-extrabold tracking-widest">Capacity</TableHead>
                            <TableHead className="uppercase text-[11px] font-extrabold tracking-widest">Status</TableHead>
                            <TableHead className="uppercase text-[11px] font-extrabold tracking-widest px-6 text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>  
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <VenueTableRowSkeleton key={`skeleton-${i}`} />
                            ))
                        ) : isEmpty ? (
                            // 1. Added Venue Not Found State
                            <TableRow>
                                <TableCell colSpan={6} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <div className="bg-slate-50 p-4 rounded-full">
                                            <Inbox className="size-10 text-slate-300" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-[#001e40]">No venues found</p>
                                            <p className="text-xs text-slate-500">There are no venues registered in the ADUN system yet.</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            venues?.map((venue: Venue, index: number) => (
                                <VenueTableRow
                                    key={venue.id}
                                    venue={venue}
                                    index={index}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default VenueTable;