import { useState } from 'react';
import {
  Download,
  Filter,
  X,
  Calendar,
  CalendarCheck,
  Bell,
  Users
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import FilterEvents from '@/features/dashboard/admin/FilterEvents';
import EventsTable from '@/features/dashboard/admin/EventsTable';
import StatCard from '@/features/dashboard/components/StatCard';

function Events() {
  const [showFilters, setShowFilters] = useState(false);

  const events: any[] = [];

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-500">

      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7b5800] mb-2 block">
            Centralized Oversight
          </span>
          <h1 className="text-4xl font-extrabold tracking-tighter text-[#001e40]">
            Global Event Management
          </h1>
        </div>
        <div className="flex items-center self-end gap-3">
          <Button variant="outline" className="font-semibold gap-2 border-slate-200">
            <Download className="size-4" /> Export CSV
          </Button>

          <Button 
            onClick={() => setShowFilters(!showFilters)}
            className={`gap-2 shadow-lg transition-all duration-300 ${
              showFilters 
                ? "bg-[#7b5800] hover:bg-[#7b5800]/90" 
                : "bg-[#001e40] hover:bg-[#001e40]/90"
            }`}
          >
            {showFilters ? <X className="size-4" /> : <Filter className="size-4" />}
            {showFilters ? "Close Filters" : "Advanced Filters"}
          </Button>
        </div>
      </div>

      {/* Statistics Quick Insight Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Calendar} 
          label="Upcoming Events" 
          value="24" 
          trend="+12%" 
        />
        <StatCard 
          icon={CalendarCheck} 
          label="Events This Month" 
          value="08" 
          trend="Active" 
        />
        <StatCard 
          icon={Bell} 
          label="Pending Approvals" 
          value="15" 
          isUpdate={true} 
        />
        <StatCard 
          icon={Users} 
          label="Total Registrations" 
          value="1.2k" 
          trend="Total" 
        />
      </section>

      {/* Conditional Filters */}
      {showFilters && (
        <div className="animate-in slide-in-from-top-4 fade-in duration-300">
          <FilterEvents />
        </div>
      )}

      {/* Events Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <EventsTable events={events} />
      </div>
    </div>
  );
}

export default Events;