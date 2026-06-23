import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  User,
  Camera,
  ShieldCheck,
  University,
  KeyRound,
  BellRing,
  Save,
  ShieldAlert,
  Eye,
  EyeOff,
  Hash,
  Phone,
  Loader2,
  Briefcase,
  BookOpen,
  Building2,
} from "lucide-react";

// Shadcn UI Imports
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import useUser from "@/hooks/useUser";
import { apiClient as api } from "@/apis/axios";
import { DepartmentSelect } from "@/components/ui/department-select";
import { FacultySelect } from "@/components/ui/faculty-select";
import { AccountActivityCard, ProfileIntegrityCard } from "@/components/profile/ProfileInsightCards";

/**
 * Staff Profile Form Interface — mirrors staff_profiles migration
 */
interface StaffProfileForm {
  first_name: string;
  last_name: string;
  title: string;
  staff_id: string;
  phone?: string;
  faculty_id?: number;
  department_id?: number;
  position: string;
  staff_type: "academic-staff" | "non-academic-staff";
}

const STAFF_TITLES = ["Mr", "Mrs", "Ms", "Dr", "Prof", "Engr"] as const;

const Settings = () => {
  const { profile, updateLocalProfile } = useUser();

  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Unified staff profile form
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StaffProfileForm>({
    defaultValues: {
      first_name: "",
      last_name: "",
      title: "",
      staff_id: "",
      phone: "",
      position: "",
      staff_type: undefined,
    },
  });

  const staffType = watch("staff_type");

  // Sync profile data to form on mount / profile change
  useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        title: profile.title || "",
        staff_id: profile.staff_id || "",
        phone: profile.phone || "",
        faculty_id: profile.faculty_id,
        department_id: profile.department_id,
        position: profile.position || "",
        staff_type: profile.staff_type,
      });
    }
  }, [profile, reset]);

  const onProfileSubmit = async (values: StaffProfileForm) => {
    try {
      const response = await api.patch("/v1/user/profile/staff/complete", values);

      if (response.data.success) {
        toast.success("Profile saved successfully!");
        updateLocalProfile({ ...profile, ...values });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save profile");
    }
  };

  const handleToggle2FA = async (checked: boolean) => {
    try {
      await api.patch("/v1/auth/2fa-toggle", { enabled: checked });
      updateLocalProfile({ ...profile, two_factor_enabled: checked });
      toast.success(`2FA ${checked ? "enabled" : "disabled"}`);
    } catch {
      toast.error("Failed to update 2FA settings");
    }
  };

  const staffTypeBadge =
    profile?.staff_type === "academic-staff"
      ? { label: "Academic Staff", color: "bg-[#ecf5fe] text-[#003366]" }
      : profile?.staff_type === "non-academic-staff"
      ? { label: "Non-Academic Staff", color: "bg-amber-50 text-[#7b5800]" }
      : null;

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
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          <form onSubmit={handleSubmit(onProfileSubmit)}>
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#ecf5fe] rounded-lg">
                    <User className="w-5 h-5 text-[#003366]" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-[#001e40]">
                      Personal Information
                    </CardTitle>
                    <CardDescription>
                      Update your public profile and contact details.
                    </CardDescription>
                  </div>
                  {staffTypeBadge && (
                    <span
                      className={`ml-auto text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${staffTypeBadge.color}`}
                    >
                      {staffTypeBadge.label}
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-8">
                {/* Avatar + Name Row */}
                <div className="flex flex-col md:flex-row gap-10">
                  {/* Avatar */}
                  <div className="flex flex-col items-center space-y-4 shrink-0">
                    <div className="relative group">
                      <Avatar className="w-32 h-32 border-4 border-[#e0e9f2]">
                        <AvatarImage src={profile?.profile_picture_url || ""} />
                        <AvatarFallback className="font-bold text-xl">
                          {profile?.first_name?.[0]}
                          {profile?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        type="button"
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full bg-[#7b5800] hover:bg-[#5d4200] shadow-lg"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-[#001e40]">
                      Max 2MB (JPG/PNG)
                    </span>
                  </div>

                  {/* Name fields */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                        First Name
                      </Label>
                      <Input
                        {...register("first_name", { required: "Required" })}
                        className="bg-[#f6faff] border-none"
                      />
                      {errors.first_name && (
                        <p className="text-xs font-medium text-destructive">
                          {errors.first_name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                        Last Name
                      </Label>
                      <Input
                        {...register("last_name", { required: "Required" })}
                        className="bg-[#f6faff] border-none"
                      />
                      {errors.last_name && (
                        <p className="text-xs font-medium text-destructive">
                          {errors.last_name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                        Email Address
                      </Label>
                      <Input
                        value={profile?.email || ""}
                        disabled
                        className="bg-[#f6faff] opacity-60 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Staff Information */}
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#001e40] uppercase tracking-widest">
                    Staff Information
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Your official university staff details.
                  </p>
                </div>

                {/* Row 1: Title, Staff ID, Phone */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                      Title
                    </Label>
                    <Controller
                      name="title"
                      control={control}
                      rules={{ required: "Title is required" }}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full bg-[#f6faff] border-none">
                            <SelectValue placeholder="Select title" />
                          </SelectTrigger>
                          <SelectContent>
                            {STAFF_TITLES.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}.
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.title && (
                      <p className="text-xs font-medium text-destructive">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Staff ID */}
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                      Staff ID
                    </Label>
                    <InputGroup>
                      <InputGroupAddon>
                        <Hash className="h-4 w-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder="ADUN/STF/001"
                        className="bg-[#f6faff] border-none"
                        {...register("staff_id", {
                          required: "Staff ID is required",
                        })}
                      />
                    </InputGroup>
                    {errors.staff_id && (
                      <p className="text-xs font-medium text-destructive">
                        {errors.staff_id.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                      Phone Number
                    </Label>
                    <InputGroup>
                      <InputGroupAddon>
                        <Phone className="h-4 w-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder="08123456789"
                        className="bg-[#f6faff] border-none"
                        {...register("phone")}
                      />
                    </InputGroup>
                  </div>
                </div>

                {/* Row 2: Position, Staff Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Position */}
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                      Position / Designation
                    </Label>
                    <InputGroup>
                      <InputGroupAddon>
                        <Briefcase className="h-4 w-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder="e.g. Senior Lecturer"
                        className="bg-[#f6faff] border-none"
                        {...register("position", {
                          required: "Position is required",
                        })}
                      />
                    </InputGroup>
                    {errors.position && (
                      <p className="text-xs font-medium text-destructive">
                        {errors.position.message}
                      </p>
                    )}
                  </div>

                  {/* Staff Type */}
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                      Staff Type
                    </Label>
                    <Controller
                      name="staff_type"
                      control={control}
                      rules={{ required: "Staff type is required" }}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full bg-[#f6faff] border-none">
                            <SelectValue placeholder="Select staff type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="academic-staff">
                              <span className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-[#003366]" />
                                Academic Staff
                              </span>
                            </SelectItem>
                            <SelectItem value="non-academic-staff">
                              <span className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-[#7b5800]" />
                                Non-Academic Staff
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.staff_type && (
                      <p className="text-xs font-medium text-destructive">
                        {errors.staff_type.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 3: Faculty & Department — only show for academic staff */}
                {staffType === "academic-staff" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FacultySelect control={control} errors={errors} />
                    <DepartmentSelect control={control} errors={errors} />
                  </div>
                )}

                {/* Non-academic: department only (no faculty required) */}
                {staffType === "non-academic-staff" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DepartmentSelect control={control} errors={errors} />
                  </div>
                )}

                {/* Submit */}
                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#001e40] hover:bg-[#003366] px-8 gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>

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
                    Role
                  </p>
                  <p className="font-bold text-[#001e40]">Staff</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-[#f6faff] p-4 rounded-xl border-l-4 border-[#001e40]">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <University className="w-5 h-5 text-[#001e40]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                    Department
                  </p>
                  <p className="font-bold text-[#001e40]">
                    {profile?.department?.name || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-[#f6faff] p-4 rounded-xl border-l-4 border-[#003366]">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Building2 className="w-5 h-5 text-[#003366]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                    Faculty
                  </p>
                  <p className="font-bold text-[#001e40]">
                    {profile?.faculty?.name || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-[#f6faff] p-4 rounded-xl border-l-4 border-amber-400">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Briefcase className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                    Position
                  </p>
                  <p className="font-bold text-[#001e40]">
                    {profile?.position || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security / Password */}
          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-[#001e40]">
                <KeyRound className="w-5 h-5 text-[#003366]" /> Security
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      className="bg-[#f6faff] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      className="bg-[#f6faff] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      className="bg-[#f6faff] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="border-[#7b5800] text-[#7b5800] hover:bg-[#7b5800] hover:text-white font-bold"
              >
                Update Password
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Widgets */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="bg-[#001e40] text-white border-none shadow-xl relative overflow-hidden">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BellRing className="w-5 h-5 text-[#fec657]" /> Security Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Two-Factor Auth</Label>
                  <p className="text-[11px] text-blue-200/70">
                    Secure login toggle
                  </p>
                </div>
                <Switch
                  className="data-[state=checked]:bg-amber-500"
                  checked={profile?.two_factor_enabled || false}
                  onCheckedChange={handleToggle2FA}
                />
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">In-App Alerts</Label>
                  <p className="text-[11px] text-blue-200/70">
                    Real-time system notices
                  </p>
                </div>
                <Switch
                  className="data-[state=checked]:bg-amber-500"
                  defaultChecked
                />
              </div>
            </CardContent>
          </Card>

          <ProfileIntegrityCard />
          <AccountActivityCard />
        </div>
      </div>
    </div>
  );
};

export default Settings;
