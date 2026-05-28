import { Controller, type Control, type FieldErrors, type FieldValues, type Path } from "react-hook-form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenderSelectProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  name?: Path<T>;
  className?: string;
}

const genderOptions = ["Male", "Female", "Other"];

export function GenderSelect<T extends FieldValues>({ 
  control, 
  errors, 
  name = "gender" as Path<T> ,
  className
}: GenderSelectProps<T>) {
  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
        Gender
      </Label>
      <div className={cn("flex", className)}>
        <div className="flex items-center justify-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
          <Users className="h-4 w-4" />
        </div>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select 
              onValueChange={field.onChange} 
              value={field.value || undefined}
            >
              <SelectTrigger className="rounded-l-none w-full h-11!">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                {genderOptions.map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {gender}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      {errors[name] && (
        <p className="text-xs font-medium text-destructive">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}

export default GenderSelect;