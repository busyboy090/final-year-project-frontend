import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

function FilterField({ label, icon: Icon, placeholder, children }: any) {
    return (
        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
                {label}
            </label>
            <Select>
                <SelectTrigger className="bg-white py-5 pl-3 w-full border-slate-200 focus:ring-[#7b5800]/20 shadow-sm font-medium text-[#001e40]">
                    <div className="flex items-center gap-4">
                        <Icon className="size-4 text-slate-400" />
                        <SelectValue placeholder={placeholder} />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    {children}
                </SelectContent>
            </Select>
        </div>
    );
}

export default FilterField