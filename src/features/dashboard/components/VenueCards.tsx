import { Users, Theater, Edit, Settings, Hammer } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// 1. Featured Large Card (e.g., Convocation Hall)
export const FeaturedVenueCard = ({ name, location, image, capacity, type, status }: any) => (
  <div className="col-span-12 lg:col-span-8 group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
    <div className="grid grid-cols-5 h-full">
      <div className="col-span-2 relative overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-[#001e40] shadow-sm">
          Iconic Landmark
        </div>
      </div>
      <div className="col-span-3 p-8 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-black text-[#001e40] tracking-tight">{name}</h3>
              <p className="text-sm text-slate-500">{location}</p>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-700 border-none uppercase text-[10px] font-bold">
              {status}
            </Badge>
          </div>
          <div className="flex gap-6 mb-8">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400">Capacity</span>
              <span className="text-sm font-bold text-[#001e40] flex items-center gap-1">
                <Users size={14} /> {capacity} Seats
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400">Venue Type</span>
              <span className="text-sm font-bold text-[#001e40] flex items-center gap-1">
                <Theater size={14} /> {type}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Button className="flex-1 bg-[#001e40] text-white font-bold text-xs uppercase tracking-widest">View Schedule</Button>
          <Button variant="outline" size="icon"><Edit size={18} /></Button>
        </div>
      </div>
    </div>
  </div>
);

// 2. Standard Small Card
export const VenueCard = ({ name, location, capacity, type, status, isMaintenance }: any) => (
  <div className={`col-span-12 md:col-span-6 lg:col-span-4 bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all border-l-4 ${isMaintenance ? 'border-red-500' : 'border-[#001e40]'}`}>
    <div className="flex justify-between items-start mb-4">
      <h3 className={`font-black text-[#001e40] tracking-tight ${isMaintenance && 'opacity-50'}`}>{name}</h3>
      <Badge className={`text-[8px] font-black uppercase border-none ${isMaintenance ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
        {status}
      </Badge>
    </div>
    <p className={`text-xs text-slate-500 mb-4 ${isMaintenance && 'italic'}`}>{location}</p>
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className={`bg-slate-50 p-3 rounded-lg text-center ${isMaintenance && 'opacity-50'}`}>
        <span className="block text-[8px] uppercase font-bold text-slate-400">Capacity</span>
        <span className="text-sm font-bold text-[#001e40]">{capacity}</span>
      </div>
      <div className={`bg-slate-50 p-3 rounded-lg text-center ${isMaintenance && 'opacity-50'}`}>
        <span className="block text-[8px] uppercase font-bold text-slate-400">Type</span>
        <span className="text-sm font-bold text-[#001e40]">{type}</span>
      </div>
    </div>
    <div className="flex gap-2">
      <Button disabled={isMaintenance} className="flex-1 bg-slate-100 text-[#001e40] hover:bg-slate-200 text-xs font-bold uppercase tracking-wider">
        {isMaintenance ? 'Schedule Lock' : 'Schedule'}
      </Button>
      <Button variant="outline" size="icon" className="rounded border-slate-200 text-slate-500">
        {isMaintenance ? <Hammer size={16} /> : <Settings size={16} />}
      </Button>
    </div>
  </div>
);