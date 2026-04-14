import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// 1. Define a flexible interface for status configurations
interface StatusConfig {
  label?: string;
  className: string;
}

interface StatusBadgeProps {
  status: string;
  // Allows you to pass custom mappings for different parts of the app
  configOverride?: Record<string, StatusConfig | string>;
}

// 2. Default Global Mapping (Covers most common cases)
const GLOBAL_STATUS_MAP: Record<string, string> = {
  // Event Statuses
  upcoming: "bg-amber-100 text-amber-700",
  ongoing: "bg-emerald-100 text-emerald-700",
  completed: "bg-slate-100 text-slate-600",
  cancelled: "bg-red-100 text-red-700",
  
  // Venue Statuses
  available: "bg-emerald-100 text-emerald-700",
  occupied: "bg-amber-100 text-amber-700",
  maintenance: "bg-red-100 text-red-700",
  
  // User/General Statuses
  active: "bg-green-100 text-green-700",
  inactive: "bg-slate-100 text-slate-400",
  pending: "bg-blue-100 text-blue-700",
};

export function StatusBadge({ status, configOverride }: StatusBadgeProps) {
  // Normalize key to lowercase to avoid "Upcoming" vs "upcoming" bugs
  const key = status.toLowerCase();
  
  // Merge global map with any specific overrides passed as props
  const finalMap = { ...GLOBAL_STATUS_MAP, ...configOverride };
  
  // Fallback styling if status isn't found
  const style = finalMap[key] || "bg-slate-100 text-slate-500";

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "rounded-full text-[10px] font-bold uppercase px-3 py-0.5 border-none whitespace-nowrap shadow-none",
        style
      )}
    >
      {status}
    </Badge>
  );
}

export default StatusBadge;