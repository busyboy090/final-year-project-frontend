import { Controller, type Control, type FieldErrors, type FieldValues, type Path } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import { useDepartments } from "@/hooks/useAcademicData";

// Add <T extends FieldValues> to make the interface generic
interface DepartmentSelectProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  name?: Path<T>; // Path<T> ensures the name exists in your specific form schema
  facultyId?: number;
}

// Pass the generic T through to the function
export function DepartmentSelect<T extends FieldValues>({ 
  control, 
  errors, 
  name = "department_id" as Path<T>, // Cast the default value to Path<T>
  facultyId 
}: DepartmentSelectProps<T>) {
  const { data: departments, isLoading } = useDepartments(facultyId);

  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
        Department
      </Label>
      <div className="flex">
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
              <SelectTrigger className="rounded-l-none w-full">
                <SelectValue placeholder={isLoading ? "Loading..." : "Choose Department"} />
              </SelectTrigger>
              <SelectContent>
                {departments?.map((dept: any) => (
                  <SelectItem key={dept.id} value={String(dept.id)}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      {/* Type-safe error message access */}
      {errors[name] && (
        <p className="text-xs font-medium text-destructive">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}