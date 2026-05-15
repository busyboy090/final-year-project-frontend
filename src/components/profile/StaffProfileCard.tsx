import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Save, Loader2, Hash, Phone, Briefcase, BookOpen, Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  InputGroup, InputGroupAddon, InputGroupInput,
} from "@/components/ui/input-group";
import { DepartmentSelect } from "@/components/ui/department-select";
import { FacultySelect } from "@/components/ui/faculty-select";
import { toast } from "sonner";
import { apiClient as api } from "@/apis/axios";
import useUser from "@/hooks/useUser";

interface StaffProfileForm {
  title:        string;
  staff_id:     string;
  phone?:       string;
  faculty_id?:  number;
  department_id?: number;
  position:     string;
  staff_type:   "academic-staff" | "non-academic-staff";
}

const STAFF_TITLES = ["Mr", "Mrs", "Ms", "Dr", "Prof", "Engr"] as const;

function StaffProfileCard() {
  const { profile, updateLocalProfile } = useUser();

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StaffProfileForm>({
    defaultValues: {
      title:      "",
      staff_id:   "",
      phone:      "",
      position:   "",
      staff_type: undefined,
    },
  });

  const staffType = watch("staff_type");

  useEffect(() => {
    if (profile) {
      reset({
        title:         profile.title         || "",
        staff_id:      profile.staff_id      || "",
        phone:         profile.phone         || "",
        faculty_id:    profile.faculty_id,
        department_id: profile.department_id,
        position:      profile.position      || "",
        staff_type:    profile.staff_type,
      });
    }
  }, [profile, reset]);

  const onSubmit = async (values: StaffProfileForm) => {
    try {
      const res = await api.patch("/v1/user/profile/staff/complete", values);
      if (res.data.success) {
        toast.success("Staff profile updated!");
        updateLocalProfile({ ...profile, ...values });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const staffTypeBadge =
    profile?.staff_type === "academic-staff"
      ? { label: "Academic Staff",     color: "bg-[#ecf5fe] text-[#003366]" }
      : profile?.staff_type === "non-academic-staff"
      ? { label: "Non-Academic Staff", color: "bg-amber-50 text-[#7b5800]" }
      : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="border-none shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div>
              <CardTitle className="text-xl font-bold text-[#001e40]">
                Staff Information
              </CardTitle>
              <CardDescription>
                Your official university staff details.
              </CardDescription>
            </div>
            {staffTypeBadge && (
              <span className={`ml-auto text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${staffTypeBadge.color}`}>
                {staffTypeBadge.label}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Separator />

          {/* Row 1: Title, Staff ID, Phone */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                Title
              </Label>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full bg-[#f6faff] border-none">
                      <SelectValue placeholder="Select title" />
                    </SelectTrigger>
                    <SelectContent>
                      {STAFF_TITLES.map((t) => (
                        <SelectItem key={t} value={t}>{t}.</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                Staff ID
              </Label>
              <InputGroup>
                <InputGroupAddon><Hash className="h-4 w-4" /></InputGroupAddon>
                <InputGroupInput
                  placeholder="ADUN/STF/001"
                  className="bg-[#f6faff] border-none"
                  {...register("staff_id", { required: "Staff ID is required" })}
                />
              </InputGroup>
              {errors.staff_id && (
                <p className="text-xs text-destructive">{errors.staff_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                Phone Number
              </Label>
              <InputGroup>
                <InputGroupAddon><Phone className="h-4 w-4" /></InputGroupAddon>
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
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                Position / Designation
              </Label>
              <InputGroup>
                <InputGroupAddon><Briefcase className="h-4 w-4" /></InputGroupAddon>
                <InputGroupInput
                  placeholder="e.g. Senior Lecturer"
                  className="bg-[#f6faff] border-none"
                  {...register("position", { required: "Position is required" })}
                />
              </InputGroup>
              {errors.position && (
                <p className="text-xs text-destructive">{errors.position.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                Staff Type
              </Label>
              <Controller
                name="staff_type"
                control={control}
                rules={{ required: "Staff type is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
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
                <p className="text-xs text-destructive">{errors.staff_type.message}</p>
              )}
            </div>
          </div>

          {/* Faculty + Department — conditional on staff type */}
          {staffType === "academic-staff" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FacultySelect control={control} errors={errors} />
              <DepartmentSelect control={control} errors={errors} />
            </div>
          )}
          {staffType === "non-academic-staff" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DepartmentSelect control={control} errors={errors} />
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#001e40] hover:bg-[#003366] px-8 gap-2"
            >
              {isSubmitting
                ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
                : <><Save className="w-4 h-4" />Save Changes</>
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

export default StaffProfileCard