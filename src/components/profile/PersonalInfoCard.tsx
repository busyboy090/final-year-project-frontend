import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { User, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { apiClient as api } from "@/apis/axios";
import useUser from "@/hooks/useUser";

interface PersonalInfoForm {
  first_name: string;
  last_name: string;
}

function PersonalInfoCard() {
  const { profile, updateLocalProfile } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoForm>({
    defaultValues: { first_name: "", last_name: "" },
  });

  useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (values: PersonalInfoForm) => {
    // 1. Create a "dirty fields" object to avoid modifying the original values
    const payload: Partial<PersonalInfoForm> = {};

    if (values.first_name !== profile.first_name) {
      payload.first_name = values.first_name;
    }
    if (values.last_name !== profile.last_name) {
      payload.last_name = values.last_name;
    }

    // 2. Optimization: If nothing changed, don't even call the API
    if (Object.keys(payload).length === 0) {
      return;
    }

    try {
      const res = await api.patch("/v1/user/profile/personal", payload);

        toast.success("Personal info updated!");
        const updatedData = res.data.user || { ...profile, ...payload };
        updateLocalProfile(updatedData);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update info");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                Update your name and public profile.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Avatar */}
            <div className="flex flex-col items-center space-y-4 shrink-0">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-[#e0e9f2]">
                  <AvatarImage src={profile?.profile_picture_url || ""} />
                  <AvatarFallback className="font-bold text-xl">
                    {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Name + Email */}
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
                  className="bg-[#f6faff] opacity-60 cursor-not-allowed border-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#001e40] hover:bg-[#003366] px-8 gap-2"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
              ) : (
                <><Save className="w-4 h-4" />Save Changes</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

export default PersonalInfoCard;