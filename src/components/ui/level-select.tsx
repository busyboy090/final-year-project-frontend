import { Controller, type Control, type FieldErrors, type FieldValues, type Path } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Layers } from "lucide-react";
import { useLevels } from "@/hooks/useAcademicData";

// Add <T extends FieldValues> to make the interface generic
interface LevelSelectProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  name?: Path<T>; // Path<T> ensures the name exists in your form schema
}

// Pass the generic T through to the function
export function LevelSelect<T extends FieldValues>({ 
  control, 
  errors, 
  name = "level_id" as Path<T> // Cast default name as Path<T>
}: LevelSelectProps<T>) {
  // Check your useLevels parameter - earlier we used 'undergrade' without the hyphen
  const { data: levels = [], isLoading } = useLevels('under-grade');

  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
        Current Level
      </Label>
      <div className="flex">
        <div className="flex items-center justify-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
          <Layers className="h-4 w-4" />
        </div>
        <Controller
          name={name}
          control={control}
          rules={{ required: "Level is required" }}
          render={({ field }) => (
            <Select 
              onValueChange={(val) => field.onChange(Number(val))} 
              value={field.value ? String(field.value) : undefined}
              disabled={isLoading}
            >
              <SelectTrigger className="rounded-l-none w-full">
                <SelectValue placeholder={isLoading ? "Loading..." : "Choose Level"} />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(levels) && levels?.map((lvl: any) => (
                  <SelectItem key={lvl.id} value={String(lvl.id)}>
                    {lvl.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      {/* Type-safe error access */}
      {errors[name] && (
        <p className="text-xs font-medium text-destructive">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}