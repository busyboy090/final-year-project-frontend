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

// 2. Default Global Mapping aligned with standard UI conventions
const GLOBAL_STATUS_MAP: Record<string, StatusConfig> = {
  // Event Statuses
  upcoming: { className: "bg-blue-50 text-blue-700 border-blue-200/60" },      // Info / Scheduled state
  ongoing: { className: "bg-sky-50 text-sky-700 border-sky-200/60" },        // Active progress state
  completed: { className: "bg-emerald-50 text-emerald-700 border-emerald-200/60" }, // Success state
  cancelled: { className: "bg-rose-50 text-rose-600 border-rose-200/60" },    // Destructive state

  // Venue Statuses
  available: { className: "bg-emerald-50 text-emerald-700 border-emerald-200/60" }, // Success state
  occupied: { className: "bg-orange-50 text-orange-700 border-orange-200/60" },   // Attention state
  maintenance: { className: "bg-rose-50 text-rose-700 border-rose-200/60" },      // Alert/Error state

  // User/General Statuses
  active: { className: "bg-green-50 text-green-700 border-green-200/60" },    // Success state
  inactive: { className: "bg-red-100 text-red-700 border-red-200/60" },       // Neutral/Disabled state
  pending: { className: "bg-amber-50 text-amber-800 border-amber-200/60" },   // Warning/Pending state

  approved: { className: "bg-green-50 text-green-700 border-green-200/60" },
  rejected: { className: "bg-red-100 text-red-700 border-red-200/60" }
};

export function StatusBadge({ status, configOverride }: StatusBadgeProps) {
  // Normalize main key to lowercase to avoid "Upcoming" vs "upcoming" bugs
  const key = status.toLowerCase();

  // Lowercase the keys of the overrides to ensure accurate merging
  const normalizedOverrides: Record<string, StatusConfig> = {};
  if (configOverride) {
    Object.entries(configOverride).forEach(([k, v]) => {
      normalizedOverrides[k.toLowerCase()] = typeof v === "string" ? { className: v } : v;
    });
  }

  // Merge global map with specific normalized overrides
  const finalMap = { ...GLOBAL_STATUS_MAP, ...normalizedOverrides };

  // Fallback styling if status isn't found
  const config = finalMap[key] || { className: "bg-zinc-50 text-zinc-600 border-zinc-200" };
  const displayLabel = config.label || status;

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full text-[10px] font-semibold uppercase px-2.5 py-0.5 tracking-wider transition-colors",
        config.className
      )}
    >
      {displayLabel}
    </Badge>
  );
}

export default StatusBadge;