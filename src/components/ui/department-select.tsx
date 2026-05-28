import { Controller, type Control, type FieldErrors, type FieldValues, type Path } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import { useDepartments } from "@/hooks/useDepartment";
import type { DepartmentType } from "@/types/department";
import { cn } from "@/lib/utils";

interface DepartmentSelectProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  name?: Path<T>;
  facultyId?: number;
  type?: DepartmentType,
  className?: string 
}

export function DepartmentSelect<T extends FieldValues>({ 
  control, 
  errors, 
  name = "department_id" as Path<T>, 
  facultyId,
  type,
  className
}: DepartmentSelectProps<T>) {
  const { data, isLoading } = useDepartments({facultyId, type});

  const departments = data?.departments ?? []

  // Helper to extract nested errors (e.g., body.department_id)
  const getNestedError = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const error = getNestedError(errors, name as string);

  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
        Department
      </Label>
      <div className={cn("flex", className)}>
        <div className="flex items-center justify-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
          <BookOpen className="h-4 w-4" />
        </div>
        <Controller
          name={name}
          control={control}
          rules={{ required: "Department is required" }}
          render={({ field }) => (
            <Select 
              onValueChange={(val) => field.onChange(Number(val))} 
              value={field.value ? String(field.value) : undefined}
              disabled={isLoading}
            >
              <SelectTrigger className="rounded-l-none w-full h-full!">
                <SelectValue placeholder={isLoading ? "Loading..." : "Choose Department"} />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(departments) && departments?.map((dept: any) => (
                  <SelectItem key={dept.id} value={String(dept.id)}>
                    {dept.name}
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