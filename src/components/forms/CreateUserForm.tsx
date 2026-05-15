// CreateUserForm.tsx
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // Keeping Checkbox for UI style, but acting like a Radio
import { useCreateUser, type CreateUserPayload } from "@/hooks/useCreateUser";
import type { UserRole } from "@/types/user";

const AVAILABLE_ROLES: { value: UserRole; label: string }[] = [
  { value: "event-organiser", label: "Event Organiser" },
  { value: "staff", label: "Staff" },
  { value: "student", label: "Student" },
];

interface CreateUserFormProps {
  onSuccess?: () => void;
}

export function CreateUserForm({ onSuccess }: CreateUserFormProps) {
  const createUser = useCreateUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateUserPayload>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      // @ts-ignore - leaving empty for validation
      role: "", 
    }
  });

  // Watch the current role to highlight the selected checkbox
  const selectedRole = watch("role");

  const onSubmit = (data: any) => {
    createUser.mutate(data, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name and Email fields remain the same... */}
      <div className="grid gap-2">
        <Label htmlFor="first_name" className="text-sm font-semibold text-[#001e40]">First Name *</Label>
        <Input id="first_name" {...register("first_name", { required: "Required" })} />
        {errors.first_name && <p className="text-xs text-red-500">{errors.first_name.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="last_name" className="text-sm font-semibold text-[#001e40]">Last Name *</Label>
        <Input id="last_name" {...register("last_name", { required: "Required" })} />
        {errors.last_name && <p className="text-xs text-red-500">{errors.last_name.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email" className="text-sm font-semibold text-[#001e40]">Email Address *</Label>
        <Input id="email" type="email" {...register("email", { required: "Required" })} />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      {/* Role Selection (Single) */}
      <div className="grid gap-3">
        <Label className="text-sm font-semibold text-[#001e40]">
          Assign Role *
        </Label>

        {/* Hidden input for RHF registration */}
        <input 
          type="hidden" 
          {...register("role", { required: "Please select a role" })} 
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
          {AVAILABLE_ROLES.map((role) => (
            <div key={role.value} className="flex items-center gap-3">
              <Checkbox
                id={role.value}
                // If this role is the selected one, mark it checked
                checked={selectedRole === role.value}
                onCheckedChange={() => {
                  // Sets the single value instead of toggling an array
                  setValue("role", role.value, { shouldValidate: true });
                }}
                className="border-slate-300"
              />
              <label
                htmlFor={role.value}
                className="text-sm font-medium text-slate-700 cursor-pointer"
              >
                {role.label}
              </label>
            </div>
          ))}
        </div>

        {errors.role && (
          <p className="text-xs text-red-500">{errors.role.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={createUser.isPending}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold h-10 text-lg"
      >
        {createUser.isPending ? "Creating..." : "Create User"}
      </Button>
    </form>
  );
}