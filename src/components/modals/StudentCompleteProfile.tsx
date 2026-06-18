import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Loader2,
  Hash,
  Phone,
  GraduationCap
} from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/apis/axios";
import { DepartmentSelect } from "../ui/department-select";
import { LevelSelect } from "../ui/level-select"; 
import GenderSelect from "../ui/gender-select";


/**
 * TypeScript Interface for the Student Profile Form
 */
interface StudentProfileForm {
  title: string;
  matric_no: string;
  department_id: number;
  level_id: number;
  gender: "Male" | "Female" | "Other";
  phone?: string;
}


function StudentProfileModal({ onClose }: { onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<StudentProfileForm>({
    defaultValues: {
      title: "",
      matric_no: "",
      phone: ""
    }
  });

  const onSubmit = async (values: StudentProfileForm) => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.patch("/v1/user/profile/student/complete", {
        ...values,
        gender: values?.gender?.toLowerCase()
      });

      if (response.data.success) {
        toast.success("Identity verified successfully!");

        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => { }}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="p-0 overflow-hidden border-none shadow-2xl transition-all duration-300
                   w-[95vw] 
                   sm:max-w-[550px] 
                   md:max-w-[750px]
                   lg:max-w-[850px]
                   max-h-[90vh] md:max-h-[500px]
                   [&>button]:hidden
                  "
      >
        {/* Fixed Header Section */}
        <div className="bg-[#001e40] p-6 md:p-10 text-white shrink-0">
          <div className="flex items-center gap-5">
            <div className="bg-blue-500/20 p-3 md:p-4 rounded-2xl border border-blue-500/30 shrink-0">
              <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-xl md:text-3xl font-bold tracking-tight">
                Complete Profile
              </DialogTitle>
              <DialogDescription className="text-slate-400 font-medium md:text-lg mt-1">
                Please verify your student identity at ADUN to proceed.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Scrollable Form Section */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 md:p-10 space-y-6 md:space-y-8 bg-white overflow-y-auto custom-scrollbar"
          style={{ maxHeight: 'calc(500px - 140px)' }}
        >

          {/* Identity Section (Title + Names) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                Title
              </Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Title" />
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
              {errors.title && <p className="text-xs font-medium text-destructive">{errors.title.message}</p>}
            </div>

            {/* Academic Identifiers Section */}
            <div className="space-y-2">
              <Label htmlFor="matric_no" className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                Matriculation Number
              </Label>
              <InputGroup>
                <InputGroupAddon><Hash className="h-4 w-4" /></InputGroupAddon>
                <InputGroupInput
                  id="matric_no"
                  placeholder="ADUN/FS/SEN/22/001"
                  {...register("matric_no", {
                    required: "Matric number is required",
                    pattern: {
                      value: /^[A-Z0-9/]+$/,
                      message: "Format error: use ADU/SWE/22/0001"
                    }
                  })}
                />
              </InputGroup>
              {errors.matric_no && <p className="text-xs font-medium text-destructive">{errors.matric_no.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                Phone Number
              </Label>
              <InputGroup>
                <InputGroupAddon><Phone className="h-4 w-4" /></InputGroupAddon>
                <InputGroupInput
                  id="phone"
                  placeholder="08123456789"
                  {...register("phone")}
                />
              </InputGroup>
            </div>


          </div>

          {/* Academic Context (Dropdowns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DepartmentSelect control={control} errors={errors} />
            <LevelSelect control={control} errors={errors} />
            <GenderSelect control={control} errors={errors} />
          </div>


          {/* Action Button */}
          <div className="pt-4 pb-2">
            <Button
              type="submit"
              className="w-full bg-[#001e40] hover:bg-[#002d61] text-white py-7 text-sm md:text-base font-bold uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Finalizing Profile...
                </>
              ) : (
                "Save & Finalize Profile"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default StudentProfileModal