import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  User,
  Camera,
  ShieldCheck,
  University,
  KeyRound,
  BellRing,
  History,
  Plus,
  Save,
  ShieldAlert,
  Eye,
  EyeOff
} from 'lucide-react';

// Shadcn UI Imports
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import useUser from '@/hooks/useUser';
import { apiClient as api } from '@/apis/axios';

const ProfileSettings = () => {
  const { profile, updateLocalProfile } = useUser();

  // State for toggling password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      body: {
        first_name: "",
        last_name: "",
        title: "",
        matric_no: "",
        staff_id: "",
        phone: ""
      }
    }
  });

  // Sync profile data to form
  useEffect(() => {
    if (profile) {
      reset({
        body: {
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          title: profile.title || "",
          matric_no: profile.matric_no || "",
          staff_id: profile.staff_id || "",
          phone: profile.phone || ""
        }
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: any) => {
    try {
      console.log("Form Data:", data);
      // await axios.put('/api/profile/update', data);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  // 2FA Toggle Handler
  const handleToggle2FA = async (checked: boolean) => {
    try {
      await api.patch('/v1/auth/2fa-toggle', {
        enabled: checked
      });
      // Optionally toast success here
      updateLocalProfile({
        ...profile,
        two_factor_enabled: checked
      })
    } catch (error) {
      console.error("Failed to toggle 2FA", error);
    }
  };

  const isSuperAdmin = profile?.is_super_admin;
  const isStudent = !!profile?.matric_no;

  // Profile strength calculation
  const profileStrength = 80;
  const strokeDasharray = 251.2;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * profileStrength) / 100;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto space-y-10">
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

        {/* Left Column: Forms */}
        <div className="lg:col-span-8 space-y-8">

          {/* Personal Information */}
          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#ecf5fe] rounded-lg">
                  <User className="w-5 h-5 text-[#003366]" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-[#001e40]">Personal Information</CardTitle>
                  <CardDescription>Update your public profile and contact details.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-10">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group">
                    <Avatar className="w-32 h-32 border-4 border-[#e0e9f2]">
                      <AvatarImage src={profile?.profile_picture_url || ""} />
                      <AvatarFallback className="font-bold text-xl">
                        {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button type="button" size="icon" className="absolute bottom-0 right-0 rounded-full bg-[#7b5800] hover:bg-[#5d4200] shadow-lg">
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-[#001e40]">Max 2MB (JPG/PNG)</span>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">First Name</Label>
                    <Input
                      {...register("body.first_name", { required: "Required" })}
                      className="bg-[#f6faff] border-none focus-visible:ring-1 focus-visible:ring-[#7b5800]"
                    />
                    {errors.body?.first_name && <p className="text-red-500 text-[10px] font-bold">{errors.body.first_name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Last Name</Label>
                    <Input
                      {...register("body.last_name", { required: "Required" })}
                      className="bg-[#f6faff] border-none focus-visible:ring-1 focus-visible:ring-[#7b5800]"
                    />
                    {errors.body?.last_name && <p className="text-red-500 text-[10px] font-bold">{errors.body.last_name.message}</p>}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Email Address</Label>
                    <Input value={profile?.email || ""} disabled className="bg-[#f6faff] border-none focus-visible:ring-1 focus-visible:ring-[#7b5800] opacity-60 cursor-not-allowed" />
                  </div>

                  {/* Role Based Fields */}
                  {!isSuperAdmin && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">{isStudent ? 'Matric No' : 'Staff ID'}</Label>
                        <Input
                          {...register(isStudent ? "body.matric_no" : "body.staff_id", { required: "Required" })}
                          className="bg-[#f6faff] border-none focus-visible:ring-1 focus-visible:ring-[#7b5800]"
                        />
                        {errors.body?.[isStudent ? 'matric_no' : 'staff_id'] && <p className="text-red-500 text-[10px] font-bold">Required</p>}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Phone Number</Label>
                        <Input
                          {...register("body.phone")}
                          className="bg-[#f6faff] border-none focus-visible:ring-1 focus-visible:ring-[#7b5800]"
                        />
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2 flex justify-end pt-4">
                    <Button type="submit" disabled={isSubmitting} className="bg-[#001e40] hover:bg-[#003366] px-8 gap-2">
                      <Save className="w-4 h-4" /> {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Role</p>
                  <p className="font-bold text-[#001e40]">{isSuperAdmin ? 'Super Admin' : 'Academic Member'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-[#f6faff] p-4 rounded-xl border-l-4 border-[#001e40]">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <University className="w-5 h-5 text-[#001e40]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Department</p>
                  <p className="font-bold text-[#001e40]">{profile?.department?.name || "Software Engineering"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Section */}
          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-[#001e40]">
                <KeyRound className="w-5 h-5 text-[#003366]" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="md:col-span-2 space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Current Password</Label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      className="bg-[#f6faff] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#001e40]"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">New Password</Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      className="bg-[#f6faff] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#001e40]"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      className="bg-[#f6faff] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#001e40]"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

              </div>
              <Button type="button" variant="outline" className="border-[#7b5800] text-[#7b5800] hover:bg-[#7b5800] hover:text-white font-bold">
                Update Password
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Widgets */}
        <div className="lg:col-span-4 space-y-8">

          <Card className="bg-[#001e40] text-white border-none shadow-xl overflow-hidden relative">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#7b5800]/20 blur-3xl rounded-full" />
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BellRing className="w-5 h-5 text-[#fec657]" />
                Security Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Two-Factor Auth</Label>
                  <p className="text-[11px] text-blue-200/70">Secure login toggle</p>
                </div>
                <Switch
                  className='data-[state=checked]:bg-amber-500'
                  checked={profile?.two_factor_enabled || false}
                  onCheckedChange={handleToggle2FA}
                />
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">In-App Alerts</Label>
                  <p className="text-[11px] text-blue-200/70">Real-time system notices</p>
                </div>
                <Switch className='data-[state=checked]:bg-amber-500' defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#e0e9f2]/50 border-none flex flex-col items-center text-center p-8">
            <div className="w-24 h-24 mb-4 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-white" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="6" />
                <circle
                  className="text-[#7b5800]"
                  cx="48" cy="48"
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
            <CardTitle className="text-sm font-black text-[#001e40] uppercase mb-2">Profile Integrity</CardTitle>
            <p className="text-xs text-[#43474f] leading-relaxed mb-4">Complete your bio to reach 100% and improve record visibility.</p>
            <Button type="button" variant="link" className="text-[#001e40] font-bold p-0 h-auto gap-1">
              <Plus className="w-3 h-3" /> Add Bio
            </Button>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-black flex items-center gap-2">
                <History className="w-4 h-4 text-[#7b5800]" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="w-1 bg-[#7b5800] rounded-full h-8" />
                <div>
                  <p className="text-xs font-bold text-[#141d23]">Last Login</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Today, 10:45 AM</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </form>
  );
};

export default ProfileSettings;