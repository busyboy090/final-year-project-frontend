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
import { LevelSelect } from "@/components/ui/level-select";
import GenderSelect from "@/components/ui/gender-select";
import { AccountActivityCard, ProfileIntegrityCard } from "@/components/profile/ProfileInsightCards";

/**
 * Unified Student Profile Form Interface
 */
interface StudentProfileForm {
  first_name: string;
  last_name: string;
  title: string;
  matric_no: string;
  phone: string;
  department_id: number;
  level_id: number;
  gender: "Male" | "Female" | "Other";
}

const ProfileSettings = () => {
  const { profile, updateLocalProfile, setNeedsProfileCompletion } = useUser();

  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Unified student profile form
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentProfileForm>({
    defaultValues: {
      first_name: "",
      last_name: "",
      title: "",
      matric_no: "",
      phone: "",
    },
  });

  // Sync profile data to form whenever profile changes
  useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        title: profile.title || "",
        matric_no: profile.matric_no || "",
        phone: profile.phone || "",
        department_id: profile.department_id,
        level_id: profile.level_id,
        gender: profile.gender,
      });
    }
  }, [profile, reset]);

  const onProfileSubmit = async (values: StudentProfileForm) => {
    try {
      const response = await api.patch("/v1/user/profile/student/complete", {
        ...values,
        gender: values?.gender?.toLowerCase(),
      });

      if (response.data.success) {
        toast.success("Profile saved successfully!");
        setNeedsProfileCompletion(false);
        updateLocalProfile({ ...profile, ...values });
        toast.dismiss();
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

                {/* Student-specific fields */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-[#001e40] uppercase tracking-widest">
                    Student Information
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Your academic and contact details.
                  </p>
                </div>

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
                            <SelectItem value="Mr">Mr.</SelectItem>
                            <SelectItem value="Mrs">Mrs.</SelectItem>
                            <SelectItem value="Ms">Ms.</SelectItem>
                            <SelectItem value="Dr">Dr.</SelectItem>
                            <SelectItem value="Prof">Prof.</SelectItem>
                            <SelectItem value="Engr">Engr.</SelectItem>
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

                  {/* Matric No */}
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                      Matriculation Number
                    </Label>
                    <InputGroup>
                      <InputGroupAddon>
                        <Hash className="h-4 w-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder="ADUN/FS/SEN/22/001"
                        className="bg-[#f6faff] border-none"
                        {...register("matric_no", {
                          required: "Matric number is required",
                        })}
                      />
                    </InputGroup>
                    {errors.matric_no && (
                      <p className="text-xs font-medium text-destructive">
                        {errors.matric_no.message}
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
                        {...register("phone", {
                          required: "Phone is required",
                        })}
                      />
                    </InputGroup>
                    {errors.phone && (
                      <p className="text-xs font-medium text-destructive">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Department, Level, Gender */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <DepartmentSelect control={control} errors={errors} />
                  <LevelSelect control={control} errors={errors} />
                  <GenderSelect control={control} errors={errors} />
                </div>

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
                  <p className="font-bold text-[#001e40]">Student</p>
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

export default ProfileSettings;
