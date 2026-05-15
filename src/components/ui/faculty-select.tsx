import { Controller, type Control, type FieldErrors, type FieldValues, type Path } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import { useFaculties } from "@/hooks/useAcademicData";

interface FacultySelectProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  name?: Path<T>;
}

export function FacultySelect<T extends FieldValues>({ 
  control, 
  errors, 
  name = "faculty_id" as Path<T>, 
}: FacultySelectProps<T>) {
  const { data: faculties = [], isLoading } = useFaculties();

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
                <SelectValue placeholder={isLoading ? "Loading..." : "Choose Faculty"} />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(faculties) && faculties?.map((dept: any) => (
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