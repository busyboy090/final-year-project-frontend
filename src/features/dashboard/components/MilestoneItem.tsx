import { type LucideIcon } from 'lucide-react';

const MilestoneItem = ({
    icon: Icon, title, timeLabel, category, attendeeCount
}: {
    icon: LucideIcon; title: string; timeLabel: string; category: string; attendeeCount?: number | null
}) => (
    <div className="bg-slate-200 p-6 rounded-xl transition-all hover:bg-slate-300 cursor-pointer border border-slate-200">
        <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <Icon className="text-[#001e40]" size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter bg-white px-2 py-1 rounded">
                {category}
            </span>
        </div>
        <h4 className="font-bold text-[#001e40] mb-1">{title}</h4>
        <p className="text-xs text-slate-500 mb-4">{timeLabel}</p>
        <div className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-600">
            {typeof attendeeCount === "number" ? `${attendeeCount}% filled` : "Registered"}
        </div>
    </div>
);

export default MilestoneItem;
