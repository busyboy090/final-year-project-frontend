import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { CloudUpload, ImageIcon, Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import EventStepAudience from "./EventStepAudience";
import { useGetEvent, useUpdateEvent } from "@/hooks/useEvent";
import { useVenues } from "@/hooks/useVenue";
import { useAcademicSessions, useCurrentAcademicSession } from "@/hooks/useAcademicData";
import type { Event, EventAudienceRule } from "@/types/event";
import type { Venue } from "@/types/venue";
import type { AcademicSession } from "@/types/academic-session";

type EditEventForm = {
  title: string;
  category: Event["category"];
  description: string;
  session_id: string;
  venue_id: string;
  capacity: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  audience_scope: "all" | "custom";
  audience_roles: Array<"staff" | "student">;
  audience_staff_types: Array<"academic-staff" | "non-academic-staff">;
  audience_student_level_ids: number[];
  audience_gender: "all" | "male" | "female" | "other";
};

const categoryOptions: Event["category"][] = [
  "Academic Conference",
  "Workshop",
  "Cultural Event",
  "Sports Match",
  "Exhibition/Expo",
  "Social Gathering/Party",
];

const dateInput = (value?: string | Date) => {
  if (!value) return "";
  const date = new Date(value);
  // Use UTC getters, not local ones: the backend combines startDate+startTime
  // as a naive string and treats it as UTC when reconstructing the Date. If
  // we read it back with local getters, a browser in a non-UTC timezone
  // (e.g. WAT, UTC+1) gets a shifted value, which then gets re-saved as if
  // it were the true UTC time — adding an hour on every edit.
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const timeInput = (value?: string | Date) => {
  if (!value) return "";
  const date = new Date(value);
  return `${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}`;
};

const formFromRules = (
  rules: EventAudienceRule[] = [],
): Pick<
  EditEventForm,
  | "audience_roles"
  | "audience_staff_types"
  | "audience_student_level_ids"
  | "audience_gender"
> => {
  const roles = Array.from(new Set(rules.map((rule) => rule.role)));
  const staffSpecific = rules
    .filter((rule) => rule.role === "staff" && rule.staff_type)
    .map((rule) => rule.staff_type!) as Array<"academic-staff" | "non-academic-staff">;
  const levelSpecific = rules
    .filter((rule) => rule.role === "student" && rule.level_id)
    .map((rule) => Number(rule.level_id));
  const genders = Array.from(new Set(rules.map((rule) => rule.gender).filter(Boolean)));

  return {
    audience_roles: roles as Array<"staff" | "student">,
    audience_staff_types: Array.from(new Set(staffSpecific)),
    audience_student_level_ids: Array.from(new Set(levelSpecific)),
    audience_gender: genders.length === 1 ? genders[0] as "male" | "female" | "other" : "all",
  };
};

const buildAudienceRules = (values: EditEventForm): EventAudienceRule[] => {
  if (values.audience_scope !== "custom") return [];

  const gender = values.audience_gender === "all" ? null : values.audience_gender;
  const rules: EventAudienceRule[] = [];

  if (values.audience_roles.includes("staff")) {
    const staffTypes = values.audience_staff_types.length
      ? values.audience_staff_types
      : [null];
    staffTypes.forEach((staffType) => {
      rules.push({ role: "staff", staff_type: staffType, level_id: null, gender });
    });
  }

  if (values.audience_roles.includes("student")) {
    const levelIds = values.audience_student_level_ids.length
      ? values.audience_student_level_ids
      : [null];
    levelIds.forEach((levelId) => {
      rules.push({ role: "student", staff_type: null, level_id: levelId, gender });
    });
  }

  return rules;
};

export default function EventEditPage() {
  const { id } = useParams();
  const eventId = Number(id);
  const navigate = useNavigate();
  const { data: event, isLoading } = useGetEvent(eventId);
  const updateEvent = useUpdateEvent();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const { data: sessions = [] } = useAcademicSessions();
  const { data: currentSession } = useCurrentAcademicSession();
  const { data: venuesData } = useVenues({ limit: 100, status: "available" });
  const fetchedVenues = Array.isArray(venuesData) ? venuesData : venuesData?.items || [];

  // The venue/session dropdowns are fed by filtered/paginated lists (e.g. only
  // "available" venues). If the event's currently-assigned venue or session
  // has since fallen outside that filter (venue put into maintenance, etc.),
  // it would silently disappear from the options — making the dropdown look
  // empty even though the correct id is still stored in the form. Make sure
  // the event's own venue/session is always present as an option.
  const venues = event?.venue && !fetchedVenues.some((v: Venue) => v.id === event.venue?.id)
    ? [...fetchedVenues, event.venue]
    : fetchedVenues;
  const sessionsList = event?.session && !sessions.some((s: AcademicSession) => s.id === event.session?.id)
    ? [...sessions, event.session]
    : sessions;

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditEventForm>({
    defaultValues: {
      title: "",
      category: "Academic Conference",
      description: "",
      session_id: "",
      venue_id: "",
      capacity: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      audience_scope: "all",
      audience_roles: [],
      audience_staff_types: [],
      audience_student_level_ids: [],
      audience_gender: "all",
    },
  });

  useEffect(() => {
    if (!event) return;
    const audienceValues = formFromRules(event.audienceRules);

    reset({
      title: event.title,
      category: event.category,
      description: event.description,
      session_id: String(event.session_id ?? currentSession?.id ?? ""),
      venue_id: String(event.venue_id),
      capacity: String(event.capacity),
      startDate: dateInput(event.start_date),
      startTime: timeInput(event.start_date),
      endDate: dateInput(event.end_date),
      endTime: timeInput(event.end_date),
      audience_scope: event.audience_scope ?? "all",
      ...audienceValues,
    });
    setThumbnailFile(null);
  }, [currentSession?.id, event, reset]);

  // Local file previews need their object URL released once we're done with
  // them, otherwise they leak for the lifetime of the tab.
  useEffect(() => {
    if (!thumbnailFile) {
      setThumbnailPreview(null);
      return;
    }
    const url = URL.createObjectURL(thumbnailFile);
    setThumbnailPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [thumbnailFile]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setThumbnailFile(file);
    e.target.value = "";
  };

  const handleClearThumbnail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setThumbnailFile(null);
  };

  const onSubmit = async (values: EditEventForm) => {
    if (values.audience_scope === "custom" && values.audience_roles.length === 0) {
      toast.error("Select at least one audience group.");
      return;
    }

    try {
      await updateEvent.mutateAsync({
        id: eventId,
        payload: {
          title: values.title,
          category: values.category,
          description: values.description,
          session_id: Number(values.session_id),
          venue_id: Number(values.venue_id),
          capacity: Number(values.capacity),
          startDate: values.startDate,
          startTime: values.startTime,
          endDate: values.endDate,
          endTime: values.endTime,
          audience_scope: values.audience_scope,
          audience_rules: buildAudienceRules(values),
          thumbnail: thumbnailFile,
        },
      });
      toast.success("Event updated");
      navigate(-1);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not update event");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-[#001e40]" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[#7b5800] text-xs uppercase tracking-widest font-bold mb-2">
            Event Registry
          </p>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#001e40]">
            Edit Event
          </h1>
        </div>
        <Button
          type="submit"
          disabled={updateEvent.isPending}
          className="bg-[#001e40] text-white hover:bg-[#003366] gap-2"
        >
          {updateEvent.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Core Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label>Event Title</Label>
            <Input {...register("title", { required: "Title is required" })} />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category">
                      {field.value}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label>Description</Label>
            <Textarea
              className="min-h-32"
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Academic Session</Label>
            <Controller
              name="session_id"
              control={control}
              rules={{ required: "Academic session is required" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select session">
                      {(() => {
                        const selected = sessionsList.find(
                          (s: AcademicSession) => String(s.id) === field.value,
                        );
                        return selected ? `${selected.code}${selected.is_active ? " (Current)" : ""}` : undefined;
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {sessionsList.map((session: any) => (
                      <SelectItem key={session.id} value={String(session.id)}>
                        {session.code} {session.is_active ? "(Current)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.session_id && <p className="text-xs text-red-500">{errors.session_id.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="size-5 text-[#7b5800]" /> Event Thumbnail
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Label className="block cursor-pointer group w-full max-w-sm">
            <div className="w-full aspect-video rounded-lg border-2 border-dashed bg-slate-50 relative flex flex-col items-center justify-center gap-2 overflow-hidden border-slate-200 group-hover:border-slate-400 transition-colors">
              {thumbnailPreview || event?.thumbnail ? (
                <>
                  <img
                    src={thumbnailPreview ?? event?.thumbnail}
                    alt="Event thumbnail"
                    className="w-full h-full object-cover"
                  />
                  {thumbnailPreview && (
                    <button
                      type="button"
                      onClick={handleClearThumbnail}
                      className="absolute top-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white p-1.5 rounded-full transition-colors backdrop-blur-sm z-10"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </>
              ) : (
                <>
                  <CloudUpload className="w-10 h-10 text-[#001e40]/70 group-hover:scale-105 transition-transform" />
                  <div className="text-center px-4">
                    <p className="text-xs font-bold text-[#001e40]">Upload Featured Image</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, or WEBP up to 5MB</p>
                  </div>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleThumbnailChange}
            />
          </Label>
          <p className="text-xs text-slate-400 mt-2">
            {thumbnailPreview
              ? "New thumbnail selected — it will replace the current one when you save."
              : "Click the image to replace the current thumbnail."}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Venue & Schedule</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label>Venue</Label>
            <Controller
              name="venue_id"
              control={control}
              rules={{ required: "Venue is required" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select venue">
                      {venues.find((v: Venue) => String(v.id) === field.value)?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {venues.map((venue: any) => (
                      <SelectItem key={venue.id} value={String(venue.id)}>
                        {venue.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.venue_id && <p className="text-xs text-red-500">{errors.venue_id.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Capacity</Label>
            <Input
              type="number"
              {...register("capacity", { required: "Capacity is required", min: 5 })}
            />
          </div>

          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input type="date" {...register("startDate", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label>Start Time</Label>
            <Input type="time" {...register("startTime", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input type="date" {...register("endDate", { required: true })} />
          </div>
          <div className="space-y-2">
            <Label>End Time</Label>
            <Input type="time" {...register("endTime", { required: true })} />
          </div>
        </CardContent>
      </Card>

      <EventStepAudience
        watch={watch}
        setValue={setValue}
        showFooter={false}
      />
    </form>
  );
}