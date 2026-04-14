import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Building2, Calendar, Flag, RotateCcw } from 'lucide-react';
import FilterField from './components/FilterField';
import { SelectItem } from '@/components/ui/select';

function FilterEvents() {
    return (
        <div className="bg-slate-100/50 p-6 rounded-xl border border-slate-200/50 grid md:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Row */}
            <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
                    Search Events
                </label>
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-[#7b5800] transition-colors" />
                    <Input
                        placeholder="Search by event name, organizer, or venue..."
                        className="pl-10 py-5 bg-white border-slate-200 focus-visible:ring-[#7b5800]/20 shadow-sm font-medium text-[#001e40]"
                    />
                </div>
            </div>

            <FilterField label="Date Range" icon={Calendar} placeholder="Select range">
                <SelectItem value="30">Next 30 Days</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="past">Past Events</SelectItem>
            </FilterField>

            <FilterField label="Department" icon={Building2} placeholder="All Departments">
                <SelectItem value="cs">Computer Science</SelectItem>
                <SelectItem value="biz">Business School</SelectItem>
                <SelectItem value="arts">Arts & Design</SelectItem>
            </FilterField>

            <FilterField label="Status" icon={Flag} placeholder="Any Status">
                <SelectItem value="up">Upcoming</SelectItem>
                <SelectItem value="on">Ongoing</SelectItem>
                <SelectItem value="done">Completed</SelectItem>
            </FilterField>

            <Button
                variant="ghost"
                className="text-[#001e40] font-bold gap-2 bg-slate-200 hover:bg-slate-300 p-5 lg:mt-6"
            >
                <RotateCcw className="size-4" />
                Reset Filters
            </Button>
        </div>
    )
}

export default FilterEvents