import { History, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";

const strokeDasharray = 251.2;

const hasValue = (value: unknown) => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return value !== null && value !== undefined;
};

const profileFieldsForRole = (profile: any, role?: string) => {
  const commonFields = [
    profile?.first_name,
    profile?.last_name,
    profile?.email,
    profile?.phone,
    profile?.gender,
  ];

  if (role === "student") {
    return [
      ...commonFields,
      profile?.matric_number,
      profile?.department_id ?? profile?.department?.id,
      profile?.level_id ?? profile?.level?.id,
    ];
  }

  if (role === "staff") {
    return [
      ...commonFields,
      profile?.staff_id,
      profile?.department_id ?? profile?.department?.id,
      profile?.staff_type,
      profile?.position,
    ];
  }

  if (role === "event-organiser") {
    return [
      ...commonFields,
      profile?.organisation_id ?? profile?.organisation?.id,
    ];
  }

  return commonFields;
};

export const useProfileStrength = () => {
  const { user } = useAuth();
  const { profile } = useUser();
  const mergedProfile = { ...user, ...profile };
  const fields = profileFieldsForRole(mergedProfile, user?.role);
  const completed = fields.filter(hasValue).length;

  return fields.length > 0 ? Math.round((completed / fields.length) * 100) : 0;
};

export function ProfileIntegrityCard() {
  const profileStrength = useProfileStrength();
  const strokeDashoffset = strokeDasharray - (strokeDasharray * profileStrength) / 100;

  return (
    <Card className="bg-[#e0e9f2]/50 border-none flex flex-col items-center text-center p-8">
      <div className="w-24 h-24 mb-4 relative">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="text-white"
            cx="48"
            cy="48"
            fill="transparent"
            r="40"
            stroke="currentColor"
            strokeWidth="6"
          />
          <circle
            className="text-[#7b5800]"
            cx="48"
            cy="48"
            fill="transparent"
            r="40"
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-black text-[#001e40] text-xl">
          {profileStrength}%
        </div>
      </div>
      <CardTitle className="text-sm font-black text-[#001e40] uppercase mb-2">
        Profile Integrity
      </CardTitle>
      <p className="text-xs text-[#43474f] leading-relaxed mb-4">
        {profileStrength === 100
          ? "Your profile is complete."
          : "Complete the remaining profile fields to reach 100%."}
      </p>
      {profileStrength < 100 && (
        <Button variant="link" className="text-[#001e40] font-bold p-0 h-auto gap-1">
          <Plus className="w-3 h-3" /> Add Missing Details
        </Button>
      )}
    </Card>
  );
}

export function AccountActivityCard() {
  const { user } = useAuth();
  const { profile } = useUser();
  const updatedAt = profile?.updated_at ?? user?.updated_at;
  const createdAt = profile?.created_at ?? user?.created_at;
  const activityDate = updatedAt ?? createdAt;

  return (
    <Card className="border-none shadow-sm bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-black flex items-center gap-2">
          <History className="w-4 h-4 text-[#7b5800]" /> Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <div className="w-1 bg-[#7b5800] rounded-full h-8" />
          <div>
            <p className="text-xs font-bold text-[#141d23]">
              {updatedAt ? "Profile Updated" : "Account Created"}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
              {activityDate
                ? new Date(activityDate).toLocaleString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "No activity recorded yet"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
