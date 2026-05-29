import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateUser, type CreateUserPayload } from "@/hooks/useCreateUser";
import type { UserRole } from "@/types/user";
import { OrganisationSelect } from "../ui/organisation-select";

const AVAILABLE_ROLES: { value: UserRole; label: string }[] = [
  { value: "event-organiser", label: "Event Organiser" },
  { value: "staff",           label: "Staff"           },
  { value: "student",         label: "Student"         },
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
    control,
    watch,
    setValue,
  } = useForm<CreateUserPayload>({
    defaultValues: {
      first_name:      "",
      last_name:       "",
      email:           "",
      role:            undefined,
      organisation_id: undefined,
    },
  });

  const selectedRole = watch("role");

  useEffect(() => {
    if (selectedRole !== "event-organiser") {
      setValue("organisation_id", undefined);
    }
  }, [selectedRole, setValue]);

  const onSubmit = (data: CreateUserPayload) => {
    createUser.mutate(data, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      <div className="grid gap-2">
        <Label htmlFor="first_name" className="text-sm font-semibold text-[#001e40]">
          First Name *
        </Label>
        <Input
          id="first_name"
          {...register("first_name", { required: "First name is required" })}
        />
        {errors.first_name && (
          <p className="text-xs text-red-500">{errors.first_name.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="last_name" className="text-sm font-semibold text-[#001e40]">
          Last Name *
        </Label>
        <Input
          id="last_name"
          {...register("last_name", { required: "Last name is required" })}
        />
        {errors.last_name && (
          <p className="text-xs text-red-500">{errors.last_name.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email" className="text-sm font-semibold text-[#001e40]">
          Email Address *
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email", { required: "Email address is required" })}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="grid gap-3">
        <Label className="text-sm font-semibold text-[#001e40]">
          Assign Role *
        </Label>

        <Controller
          name="role"
          control={control}
          rules={{ required: "Please select a role" }}
          render={({ field }) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
              {AVAILABLE_ROLES.map((role) => (
                <div key={role.value} className="flex items-center gap-3">
                  <Checkbox
                    id={role.value}
                    checked={field.value === role.value}
                    onCheckedChange={() => field.onChange(role.value)}
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
          )}
        />

        {errors.role && (
          <p className="text-xs text-red-500">{errors.role.message}</p>
        )}
      </div>

      {selectedRole === "event-organiser" && (
        <OrganisationSelect
          className="h-11"
          control={control}
          errors={errors}
        />
      )}

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