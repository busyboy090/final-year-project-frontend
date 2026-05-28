import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { User, Save, Loader2, Phone } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { apiClient as api } from "@/apis/axios";
import useUser from "@/hooks/useUser";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import GenderSelect from "../ui/gender-select";
import { capitalizeInitial } from "@/utils/format";

type Gender = "Male" | "Female" | "Other";

interface PersonalInfoForm {
  first_name: string;
  last_name: string;
  phone: string;
  gender: Gender;
}

// Only the fields we send to the API (gender goes out lowercased)
interface PersonalInfoPayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
  gender?: string;
}

function PersonalInfoCard() {
  const { profile, updateLocalProfile } = useUser();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoForm>({
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      gender: undefined,
    },
  });

  // Without this, defaultValues only run on mount and miss late-arriving profile data.
  useEffect(() => {
    if (!profile) return;
    reset({
      first_name: profile.first_name ?? "",
      last_name: profile.last_name ?? "",
      phone: profile.phone ?? "",
      gender: profile.gender
        ? (capitalizeInitial(profile.gender) as Gender)
        : undefined,
    });
  }, [profile, reset]);

  const onSubmit = async (values: PersonalInfoForm) => {
    const payload: PersonalInfoPayload = {};

    if (values.first_name !== profile.first_name) {
      payload.first_name = values.first_name;
    }
    if (values.last_name !== profile.last_name) {
      payload.last_name = values.last_name;
    }

    if (values.gender && values.gender.toLowerCase() !== profile.gender) {
      payload.gender = values.gender.toLowerCase();
    }
    if (values.phone !== profile.phone) {
      payload.phone = values.phone;
    }

    if (Object.keys(payload).length === 0) {
      toast.info("No changes to save.");
      return;
    }

    try {
      const res = await api.patch("/v1/user/profile/personal", payload);

      toast.success("Personal info updated!");
      // FIX 4: Prefer the server response; fall back to local merge only if missing
      updateLocalProfile(res.data?.user ?? { ...profile, ...payload });
    } catch (error) {
      // FIX 5: Avoid `any` — narrow the error type properly
      const message =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })
              ?.response?.data?.message ?? "Failed to update info";
      toast.error(message);
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
              <Avatar className="w-32 h-32 border-4 border-[#e0e9f2]">
                <AvatarImage src={profile?.profile_picture_url ?? ""} />
                <AvatarFallback className="font-bold text-xl">
                  {profile?.first_name?.[0]}
                  {profile?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Fields */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="first_name"
                  className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]"
                >
                  First Name
                </Label>
                <Input
                  id="first_name"
                  aria-invalid={!!errors.first_name}
                  {...register("first_name", { required: "Required" })}
                />
                {errors.first_name && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="last_name"
                  className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]"
                >
                  Last Name
                </Label>
                <Input
                  id="last_name"
                  aria-invalid={!!errors.last_name}
                  {...register("last_name", { required: "Required" })}
                />
                {errors.last_name && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.last_name.message}
                  </p>
                )}
              </div>

              {/* Email — read-only */}
              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="email"
                  className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  value={profile?.email ?? ""}
                  disabled
                  readOnly
                  className="opacity-60 cursor-not-allowed"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]"
                >
                  Phone Number
                </Label>
                <InputGroup>
                  <InputGroupAddon>
                    <Phone className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="phone"
                    placeholder="08123456789"
                    className="border-none"
                    aria-invalid={!!errors.phone}
                    {...register("phone", { required: "Required" })}
                  />
                </InputGroup>
                {errors.phone && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <GenderSelect className="h-11" control={control} errors={errors} />
            </div>
          </div>

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
  );
}

export default PersonalInfoCard;