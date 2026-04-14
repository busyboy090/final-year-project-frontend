import { type LucideIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

const StatCard = ({ icon: Icon, label, value, trend, isUpdate, iconColor }: { icon: LucideIcon, label: string, value: string, trend?: string, isUpdate?: boolean, iconColor?: string; }) => (
  <div className="bg-white p-6 rounded-xl border-l-4 border-amber-500 shadow-sm hover:shadow-lg transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={cn(
        "p-2 text-[#001e40] rounded-lg",
        iconColor ? iconColor : "bg-slate-100"
      )}>
        <Icon size={20} />
      </div>
      {trend && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">{trend}</span>}
      {isUpdate && <span className="animate-pulse w-2 h-2 bg-red-600 rounded-full mt-3"></span>}
    </div>
    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{label}</p>
    <h3 className="text-3xl font-black text-[#001e40] mt-1">{value}</h3>
  </div>
);

export default StatCard;