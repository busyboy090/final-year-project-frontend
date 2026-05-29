import { Controller, type Control, type FieldErrors, type FieldValues, type Path } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import { useOrganisations } from "@/hooks/useOrganisation";
import { cn } from "@/lib/utils";

interface OrganisationSelectProps<T extends FieldValues> {
  control:       Control<T>;
  errors:        FieldErrors<T>;
  name?:         Path<T>;
  facultyId?:    number;
  departmentId?: number;
  className?:    string;
}

export function OrganisationSelect<T extends FieldValues>({
  control,
  errors,
  name = "organisation_id" as Path<T>,
  facultyId,
  departmentId,
  className,
}: OrganisationSelectProps<T>) {
  const { data, isLoading } = useOrganisations({
    faculty_id:    facultyId,
    department_id: departmentId,
  });

  const organisations = data?.data ?? [];

  const getNestedError = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const error = getNestedError(errors, name as string);

  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
        Organisation
      </Label>
      <div className={cn("flex", className)}>
        <div className="flex items-center justify-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
          <Building2 className="h-4 w-4" />
        </div>
        <Controller
          name={name}
          control={control}
          rules={{ required: "Organisation is required" }}
          render={({ field }) => (
            <Select
              onValueChange={(val) => field.onChange(Number(val))}
              value={field.value ? String(field.value) : undefined}
              disabled={isLoading}
            >
              <SelectTrigger className="rounded-l-none w-full h-full!">
                <SelectValue placeholder={isLoading ? "Loading..." : "Choose Organisation"} />
              </SelectTrigger>
              <SelectContent>
                {organisations.map((org) => (
                  <SelectItem key={org.id} value={String(org.id)}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {error && (
        <p className="text-xs font-medium text-destructive">
          {error.message as string}
        </p>
      )}
    </div>
  );
}