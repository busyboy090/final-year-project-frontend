import {
    ShieldCheck,
    ShieldAlert
} from "lucide-react";

// Shadcn UI Imports
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import PersonalInfoCard from "@/components/profile/PersonalInfoCard";
import SecurityCard from "@/components/profile/SecurityCard";
import ChangePasswordCard from "@/components/profile/ChangePasswordCard";
import { AccountActivityCard, ProfileIntegrityCard } from "@/components/profile/ProfileInsightCards";


const Profile = () => {
    return (
        <div className="mx-auto space-y-10">
            {/* Page Header */}
            <header>
                <p className="text-sm font-bold text-[#7b5800] tracking-widest uppercase mb-1">
                    Account Management
                </p>
                <h1 className="text-4xl font-black text-[#001e40] tracking-tight">
                    Settings & Profile
                </h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Unified Form */}
                <div className="lg:col-span-8 space-y-8">
                    <PersonalInfoCard />

                    {/* Credentials */}
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-[#003366]" />
                                University Credentials
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-4 bg-[#f6faff] p-4 rounded-xl border-l-4 border-[#7b5800]">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <ShieldAlert className="w-5 h-5 text-[#7b5800]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                                        Super Admin
                                    </p>
                                    <p className="font-bold text-[#001e40]">Super Admin</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security / Password */}
                    <ChangePasswordCard />
                </div>

                {/* Right Column: Widgets */}
                <div className="lg:col-span-4 space-y-8">
                    <SecurityCard />

                    <ProfileIntegrityCard />
                    <AccountActivityCard />
                </div>
            </div>
        </div>
    );
};

export default Profile;
