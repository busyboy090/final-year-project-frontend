import { ShieldAlert, Plus, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PersonalInfoCard from "@/components/profile/PersonalInfoCard";
import SecurityCard from "@/components/profile/SecurityCard";
// import useUser from "@/hooks/useUser";
import ChangePasswordCard from "@/components/profile/ChangePasswordCard";

const strokeDasharray  = 251.2;
const profileStrength  = 80;
const strokeDashoffset = strokeDasharray - (strokeDasharray * profileStrength) / 100;

function Profile() {
//   const { profile } = useUser();

  return (
    <div className="mx-auto space-y-10">
      <header>
        <p className="text-sm font-bold text-[#7b5800] tracking-widest uppercase mb-1">
          Account Management
        </p>
        <h1 className="text-4xl font-black text-[#001e40] tracking-tight">
          Settings & Profile
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column */}
        <div className="lg:col-span-8 space-y-8">
          <PersonalInfoCard />

          {/* Credentials summary */}
          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                University Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  icon:   <ShieldAlert className="w-5 h-5 text-[#7b5800]" />,
                  border: "border-[#7b5800]",
                  label:  "Role",
                  value:  "Event Organiser",
                }
              ].map(({ icon, border, label, value }) => (
                <div key={label} className={`flex items-center gap-4 bg-[#f6faff] p-4 rounded-xl border-l-4 ${border}`}>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    {icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                      {label}
                    </p>
                    <p className="font-bold text-[#001e40]">{value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Security / Password */}
          <ChangePasswordCard />
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 space-y-8">
          <SecurityCard />

          {/* Profile strength */}
          <Card className="bg-[#e0e9f2]/50 border-none flex flex-col items-center text-center p-8">
            <div className="w-24 h-24 mb-4 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" fill="transparent"
                  stroke="white" strokeWidth="6"
                />
                <circle cx="48" cy="48" r="40" fill="transparent"
                  stroke="#7b5800" strokeWidth="6"
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
              Complete your bio to reach 100%.
            </p>
            <Button variant="link" className="text-[#001e40] font-bold p-0 h-auto gap-1">
              <Plus className="w-3 h-3" /> Add Bio
            </Button>
          </Card>

          {/* Recent activity */}
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
                  <p className="text-xs font-bold text-[#141d23]">Last Login</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                    Today, 10:45 AM
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Profile;