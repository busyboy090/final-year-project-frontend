import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Save } from "lucide-react";
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
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const timeInput = (value?: string | Date) => {
  if (!value) return "";
  const date = new Date(value);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
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
  }, [currentSession?.id, event, reset]);

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
                    <SelectValue />
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
                    <SelectValue placeholder="Select session" />
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
                    <SelectValue placeholder="Select venue" />
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