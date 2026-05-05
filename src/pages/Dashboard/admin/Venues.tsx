import { PlusCircle, DoorOpen, CheckCircle, Construction, Users } from 'lucide-react';
import StatCard from "@/features/dashboard/components/StatCard";
import VenueTable from '@/features/dashboard/admin/VenueTable';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function VenueManagement() {
  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between max-md:flex-col items-end mb-10">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#7b5800] mb-2 block">
            Campus Infrastructure
          </span>
          <h2 className="text-4xl font-extrabold text-[#001e40] tracking-tight">Venue Management</h2>
          <p className="text-slate-500 mt-2 max-w-lg">
            Oversee and coordinate all university spaces, from ceremonial halls to advanced maritime laboratories.
          </p>
        </div>
        <Button asChild variant="default" className="bg-amber-500 h-[40px] hover:bg-amber-600 self-end text-white text-md font-bold px-6 py-3 rounded-lg flex items-center gap-2 hover:scale-95 transition-all shadow-sm active:scale-95">
          <Link to="/dashboard/admin/venues/add">
            <PlusCircle size={20} />
            Add New Venue
          </Link>
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard icon={DoorOpen} label="Total Venues" value="42" />
        <StatCard icon={CheckCircle} label="Available Now" value="28" iconColor="bg-green-500" />
        <StatCard icon={Construction} label="In Maintenance" value="04" />
        <div className="bg-[#001e40] text-white p-6 rounded-xl shadow-xl overflow-hidden relative group">
          <div className="relative z-10">
            <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Current Occupancy</p>
            <p className="text-2xl font-black">74%</p>
          </div>
          <Users size={80} className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700" />
        </div>
      </div>

      {/* Venue Table */}
      <VenueTable />
    </div>
  );
}