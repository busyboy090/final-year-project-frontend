import { PlusCircle, DoorOpen, CheckCircle, Construction, Users } from 'lucide-react';
import StatCard from "@/features/dashboard/components/StatCard";
import VenueTable from '@/features/dashboard/admin/VenueTable';
import { useState } from 'react';


export default function VenueManagement() {
  const [venues] = useState([
    {
      id: "1",
      name: "Main Convocation Hall",
      location: "Central Administration",
      capacity: "1,200",
      type: "Auditorium",
      status: "Available",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwO9CtycES4gc0EtgdLiqqpSA05TpbqlsQKfLAJeNFubH_i7qMlhKov9NxeWX9GTqOU_hQyWoIHvi5TQI1iyed44mwfsACVZi1PyOJbPqgRh0-GJIctCZVgBzefsxpvPYJeplsLno_yb_7YCY_QhrjssOnq1OVjEX8Kjc2d-ioSAH2VHMtDDDQ6ZX3J3DE0KJnNP2FU0M2_SlumMf_EB_ZDYVCjTHFBRzFStNVIqqj0qX-3dulCdumHHvo5SBwlz8mhhXqaD1idpI", // Grand hall image
    },
    {
      id: "2",
      name: "Maritime Lab",
      location: "Engineering Block, L3",
      capacity: "45",
      type: "Research Lab",
      status: "Occupied",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200&h=200", // Lab setting
    },
    {
      id: "3",
      name: "Auditorium A",
      location: "West Wing",
      capacity: "250",
      type: "Lecture Hall",
      status: "Maintenance",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=200&h=200", // Modern lecture hall
    },
  ]);

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
        <button className="bg-amber-500 self-end text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:scale-95 transition-all shadow-sm active:scale-95">
          <PlusCircle size={20} />
          Add New Venue
        </button>
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
      <VenueTable venues={venues} />
    </div>
  );
}