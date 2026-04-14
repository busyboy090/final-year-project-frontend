import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Venue } from "@/types/venue";
import VenueTableRow from "./components/VenueTableRow";


function VenueTable({ venues }: { venues: Venue[] }) {
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
                        {venues.map((venue, index) => (
                            <VenueTableRow key={index} index={index} venue={venue} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default VenueTable