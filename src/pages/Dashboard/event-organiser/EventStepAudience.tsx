import { GraduationCap, ShieldCheck, Users, VenusAndMars } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLevels } from "@/hooks/useAcademicData";

type AudienceRole = "staff" | "student";
type StaffType = "academic-staff" | "non-academic-staff";
type AudienceGender = "all" | "male" | "female" | "other";

const roleOptions: Array<{ value: AudienceRole; label: string; hint: string }> = [
  {
    value: "staff",
    label: "Staff",
    hint: "Academic and non-academic employees",
  },
  {
    value: "student",
    label: "Students",
    hint: "Students by level or all levels",
  },
];

const staffTypeOptions: Array<{ value: StaffType; label: string }> = [
  { value: "academic-staff", label: "Academic Staff" },
  { value: "non-academic-staff", label: "Non-academic Staff" },
];

const toggleValue = <T extends string | number>(items: T[], value: T) =>
  items.includes(value)
    ? items.filter((item) => item !== value)
    : [...items, value];

export default function EventStepAudience({
  watch,
  setValue,
  onNext,
  showFooter = true,
  footerLabel = "Continue to Venue",
}: any) {
  const { data: levels = [], isLoading } = useLevels("under-grade");

  const audienceScope = watch("audience_scope") ?? "all";
  const audienceRoles: AudienceRole[] = watch("audience_roles") ?? [];
  const staffTypes: StaffType[] = watch("audience_staff_types") ?? [];
  const studentLevelIds: number[] = watch("audience_student_level_ids") ?? [];
  const audienceGender: AudienceGender = watch("audience_gender") ?? "all";

  const updateField = (name: string, value: unknown) => {
    setValue(name, value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const setAudienceScope = (value: "all" | "custom") => {
    updateField("audience_scope", value);

    if (value === "all") {
      updateField("audience_roles", []);
      updateField("audience_staff_types", []);
      updateField("audience_student_level_ids", []);
      updateField("audience_gender", "all");
    }
  };

  const toggleRole = (role: AudienceRole) => {
    const nextRoles = toggleValue(audienceRoles, role);
    updateField("audience_roles", nextRoles);

    if (!nextRoles.includes("staff")) {
      updateField("audience_staff_types", []);
    }

    if (!nextRoles.includes("student")) {
      updateField("audience_student_level_ids", []);
    }
  };

  return (
    <div className="space-y-8">
      <section className="bg-white dark:bg-slate-900 p-6 lg:p-8 rounded-xl border shadow-sm space-y-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold text-[#001e40] dark:text-slate-50 flex items-center gap-2">
            <Users className="text-[#7b5800]" />
            Event Audience
          </h3>
          <p className="text-sm text-slate-500">
            Choose who can discover and register for this event.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setAudienceScope("all")}
            className={`rounded-xl border-2 p-5 text-left transition-all ${
              audienceScope === "all"
                ? "border-[#7b5800] bg-[#7b5800]/5"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 size-5 text-[#7b5800]" />
              <div>
                <p className="font-bold text-[#001e40] dark:text-slate-50">
                  Everyone
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  All authenticated staff and students can see and register.
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setAudienceScope("custom")}
            className={`rounded-xl border-2 p-5 text-left transition-all ${
              audienceScope === "custom"
                ? "border-[#7b5800] bg-[#7b5800]/5"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <Users className="mt-1 size-5 text-[#7b5800]" />
              <div>
                <p className="font-bold text-[#001e40] dark:text-slate-50">
                  Custom Audience
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Restrict discovery and registration by role, level, staff type,
                  or gender.
                </p>
              </div>
            </div>
          </button>
        </div>
      </section>

      {audienceScope === "custom" && (
        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7 bg-white dark:bg-slate-900 p-6 lg:p-8 rounded-xl border shadow-sm space-y-6">
            <div>
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                Audience Groups
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {roleOptions.map((role) => (
                  <label
                    key={role.value}
                    htmlFor={`audience-${role.value}`}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 p-4 cursor-pointer hover:bg-slate-50"
                  >
                    <Checkbox
                      id={`audience-${role.value}`}
                      checked={audienceRoles.includes(role.value)}
                      onCheckedChange={() => toggleRole(role.value)}
                    />
                    <span>
                      <span className="block text-sm font-bold text-[#001e40]">
                        {role.label}
                      </span>
                      <span className="block text-xs text-slate-500 mt-1">
                        {role.hint}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {audienceRoles.includes("staff") && (
              <div className="border-t pt-6">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40] flex items-center gap-2">
                  <ShieldCheck className="size-4 text-[#7b5800]" />
                  Staff Type
                </Label>
                <p className="text-xs text-slate-500 mt-1">
                  Leave both unchecked to allow all staff.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {staffTypeOptions.map((type) => (
                    <label
                      key={type.value}
                      htmlFor={type.value}
                      className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 cursor-pointer hover:bg-slate-50"
                    >
                      <Checkbox
                        id={type.value}
                        checked={staffTypes.includes(type.value)}
                        onCheckedChange={() =>
                          updateField(
                            "audience_staff_types",
                            toggleValue(staffTypes, type.value),
                          )
                        }
                      />
                      <span className="text-sm font-semibold text-slate-700">
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {audienceRoles.includes("student") && (
              <div className="border-t pt-6">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40] flex items-center gap-2">
                  <GraduationCap className="size-4 text-[#7b5800]" />
                  Student Level
                </Label>
                <p className="text-xs text-slate-500 mt-1">
                  Leave all unchecked to allow students from every level.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                  {isLoading ? (
                    <p className="text-xs text-slate-400 col-span-full">
                      Loading levels...
                    </p>
                  ) : (
                    levels.map((level: any) => (
                      <label
                        key={level.id}
                        htmlFor={`level-${level.id}`}
                        className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 cursor-pointer hover:bg-slate-50"
                      >
                        <Checkbox
                          id={`level-${level.id}`}
                          checked={studentLevelIds.includes(level.id)}
                          onCheckedChange={() =>
                            updateField(
                              "audience_student_level_ids",
                              toggleValue(studentLevelIds, level.id),
                            )
                          }
                        />
                        <span className="text-sm font-semibold text-slate-700">
                          {level.name}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <aside className="col-span-12 lg:col-span-5 bg-[#001e40] rounded-xl p-6 lg:p-8 text-white shadow-xl shadow-blue-950/20 space-y-6">
            <div>
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2 mb-3">
                <VenusAndMars className="size-4 text-[#fec657]" />
                Gender Filter
              </Label>
              <Select
                value={audienceGender}
                onValueChange={(value) =>
                  updateField("audience_gender", value as AudienceGender)
                }
              >
                <SelectTrigger className="bg-white text-[#001e40] h-11 w-full">
                  <SelectValue placeholder="All genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All genders</SelectItem>
                  <SelectItem value="male">Male only</SelectItem>
                  <SelectItem value="female">Female only</SelectItem>
                  <SelectItem value="other">Other only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-white/5 p-4 space-y-3">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                Current Audience
              </p>
              <p className="text-sm text-slate-200 leading-relaxed">
                {audienceRoles.length === 0
                  ? "No audience group selected yet."
                  : [
                      audienceRoles.includes("staff") ? "Staff" : null,
                      audienceRoles.includes("student") ? "Students" : null,
                      audienceGender !== "all" ? audienceGender : null,
                    ]
                      .filter(Boolean)
                      .join(" / ")}
              </p>
            </div>
          </aside>
        </section>
      )}

      {showFooter && (
        <div className="mt-8 flex flex-col sm:flex-row justify-end items-center gap-4 border-t pt-6">
          <Button
            type="button"
            onClick={onNext}
            className="bg-[#001e40] hover:bg-[#003366] text-white font-bold h-11 px-10 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm"
          >
            {footerLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
