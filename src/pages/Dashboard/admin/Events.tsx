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

  const [events] = useState([
    {
      id: "1",
      title: "AI in Modern Healthcare Summit",
      thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyMyHPXBPGJwZp9G7HKpxWscr9qj177VnycDaGv4JvU9JJCJD8oBQCO-HsK6m3D1CbLFyZ858pNsPqhoKHlPVlQcYFJ2GdToA6ydIyS5desWfd6saVX45uaf4_Cuu8eDJZ8CXABs6gAT4sHLPavFNTqwHY9_YrhgfEsH8MzZoz46Nv6mNko9-7oGmOKYu1ApdBNmxxvYYBm0oaJ8PI3EmwMRpdJ6QGuE0a7ePfRvBtruNcj4VGCQ0bviQZXM_4aro-ATYzuaPNs7Q",
      organizer: "Dr. Sarah Jenkins",
      department: "School of Computing",
      venue: "Great Hall, West Wing",
      date: "Oct 24, 2023",
      time: "09:00 AM - 05:00 PM",
      capacity: "425/500",
      fillPercentage: 85,
      status: "Upcoming",
    },
    {
      id: "2",
      title: "Annual Alumni Gala Dinner",
      thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCDMstufyfFvZv7C4i5ypR_JY0Fcdcx5otnffNJ7MC6dyxnziM1ak4vvV3J-OfoHVSG7Z2SU6DOueD7kgLPgjYSgrXvHOM01Ja9JjBSfjE7SQVuAgcQuHFPzReA1UMHJ9mRF-u2Tqh1UCu_Zb9cD0oZq2aufH0f084G7djm1RKgaz8Vt_-ujUy7ZmtEb76z_V3oQX4ue5EgHzaBKh1Of-7G7nBbXycG_MJ-LC0fcK6wEQwylCUwFnmF0NBIt69sCyG3Ri_CH4zHvo",
      organizer: "Office of Advancement",
      department: "Institutional Affairs",
      venue: "Maritime Ballroom",
      date: "Oct 21, 2023",
      time: "07:00 PM - 11:30 PM",
      capacity: "250/250",
      fillPercentage: 100,
      status: "Ongoing",
    },
  ]);

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