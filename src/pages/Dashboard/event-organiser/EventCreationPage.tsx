import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import EventStepBasicDetails from './EventStepBasicDetails';
import EventStepAudience from './EventStepAudience';
import EventStepVenueSchedule from './EventStepVenueSchedule';
import EventStepReviewPublish from './EventStepReviewPublish';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/apis/axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { FileClock, X } from 'lucide-react';
import {
  readDraft,
  writeDraft,
  clearDraft,
  fileToDataUrl,
  dataUrlToFile,
  fileToFileList,
  formatRelativeTime,
  type EventDraftPayload,
} from '@/lib/eventDraft';

// Declare type interface aligned directly with your backend keys
export interface EventFormValues {
  title: string;
  category: string;
  description: string;
  thumbnail: FileList | null;
  session_id: string;
  audience_scope: "all" | "custom";
  audience_roles: Array<"staff" | "student">;
  audience_staff_types: Array<"academic-staff" | "non-academic-staff">;
  audience_student_level_ids: number[];
  audience_gender: "all" | "male" | "female" | "other";
  venue_id: string;
  capacity: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

type AudienceRule = {
  role: "staff" | "student";
  staff_type?: "academic-staff" | "non-academic-staff" | null;
  level_id?: number | null;
  gender?: "male" | "female" | "other" | null;
};

const buildAudienceRules = (data: EventFormValues): AudienceRule[] => {
  if (data.audience_scope !== "custom") return [];

  const gender = data.audience_gender === "all" ? null : data.audience_gender;
  const rules: AudienceRule[] = [];

  if (data.audience_roles.includes("staff")) {
    const staffTypes = data.audience_staff_types.length
      ? data.audience_staff_types
      : [null];

    staffTypes.forEach((staffType) => {
      rules.push({
        role: "staff",
        staff_type: staffType,
        level_id: null,
        gender,
      });
    });
  }

  if (data.audience_roles.includes("student")) {
    const levelIds = data.audience_student_level_ids.length
      ? data.audience_student_level_ids
      : [null];

    levelIds.forEach((levelId) => {
      rules.push({
        role: "student",
        staff_type: null,
        level_id: levelId,
        gender,
      });
    });
  }

  return rules;
};

export default function EventCreationPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [pendingDraft, setPendingDraft] = useState<EventDraftPayload | null>(null);
  const navigate = useNavigate()
  const { user } = useAuth();

  // Initialize unified react-hook-form hub
  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    watch,
    setValue,
    formState: { errors }
  } = useForm<EventFormValues>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      category: 'Academic Conference',
      description: '',
      session_id: '',
      audience_scope: 'all',
      audience_roles: [],
      audience_staff_types: [],
      audience_student_level_ids: [],
      audience_gender: 'all',
      venue_id: '',
      capacity: '',
      thumbnail: null,
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
    }
  });

  // On mount, check whether this user already has a locally saved draft
  // waiting to be resumed (e.g. they closed the tab mid-way last time).
  useEffect(() => {
    const existing = readDraft(user?.id);
    if (existing) {
      setPendingDraft(existing);
    }
    // Only run once per mount / once user id becomes available.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleResumeDraft = async () => {
    if (!pendingDraft) return;

    Object.entries(pendingDraft.values).forEach(([key, value]) => {
      setValue(key as keyof EventFormValues, value as never, { shouldValidate: false });
    });

    if (pendingDraft.thumbnailMeta) {
      try {
        const file = dataUrlToFile(
          pendingDraft.thumbnailMeta.dataUrl,
          pendingDraft.thumbnailMeta.name,
          pendingDraft.thumbnailMeta.type
        );
        setValue('thumbnail', fileToFileList(file), { shouldValidate: false });
      } catch (error) {
        console.error('DRAFT_THUMBNAIL_RESTORE_ERROR:', error);
      }
    }

    setCurrentStep(pendingDraft.currentStep || 1);
    setLastSavedAt(pendingDraft.savedAt);
    setPendingDraft(null);
    toast.success('Draft resumed. Pick up right where you left off.');
  };

  const handleDiscardDraft = () => {
    clearDraft(user?.id);
    setPendingDraft(null);
    toast('Draft discarded.');
  };

  // Step validation gatekeeper
  const handleNextStep = async () => {
    let fieldsToValidate: Array<keyof EventFormValues> = [];

    if (currentStep === 1) {
      fieldsToValidate = ['title', 'category', 'description', 'session_id', 'thumbnail'];
    } else if (currentStep === 2) {
      const values = getValues();
      if (values.audience_scope === "custom" && values.audience_roles.length === 0) {
        toast.error("Select staff, students, or both for this custom audience.");
        return;
      }
    } else if (currentStep === 3) {
      fieldsToValidate = ['venue_id', 'capacity', 'startDate', 'endDate', 'startTime', 'endTime'];
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBackStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const onFinalSubmit = async (data: EventFormValues) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // Append fields
      formData.append('title', data.title);
      formData.append('category', data.category);
      formData.append('description', data.description);
      formData.append('session_id', data.session_id);
      formData.append('audience_scope', data.audience_scope);
      formData.append('audience_rules', JSON.stringify(buildAudienceRules(data)));
      formData.append('venue_id', data.venue_id);
      formData.append('capacity', data.capacity);
      formData.append('startDate', data.startDate);
      formData.append('startTime', data.startTime);
      formData.append('endDate', data.endDate);
      formData.append('endTime', data.endTime);

      // Append binary file securely
      if (data?.thumbnail && data?.thumbnail[0]) {
        formData.append('thumbnail', data.thumbnail[0]);
      }

      await apiClient.post('/v1/events', formData);

      clearDraft(user?.id);
      toast.success("Event created successfully");

      const eventsPath = user?.role === "super-admin"
        ? "/dashboard/admin/events"
        : "/dashboard/event-organiser/events";
      navigate(eventsPath)
    } catch (error: any) {
      console.error('SUBMIT_EVENT_FORM_ERROR:', error);
      const serverMessage = error.response?.data?.message || 'Failed to publish event application.';
      toast.error(serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setIsSavingDraft(true);
      const { thumbnail, ...rest } = getValues();

      let thumbnailMeta = null;
      const file = thumbnail && thumbnail[0] ? thumbnail[0] : null;
      if (file) {
        // File objects can't be JSON-serialized, so stash a base64 copy instead.
        const dataUrl = await fileToDataUrl(file);
        thumbnailMeta = { name: file.name, type: file.type, dataUrl };
      }

      const saved = writeDraft(user?.id, {
        values: rest,
        thumbnailMeta,
        currentStep,
        savedAt: Date.now(),
      });

      if (!saved) {
        toast.error('Could not save draft locally (storage may be full).');
        return;
      }

      setLastSavedAt(Date.now());
      toast.success('Draft saved to this browser.');
    } catch (error) {
      console.error('SAVE_DRAFT_ERROR:', error);
      toast.error('Failed to save draft.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <p className="text-[#7b5800] text-xs uppercase tracking-widest font-bold mb-2">
            Event Architecture
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#001e40] dark:text-slate-50">
            Create New Event
          </h2>
        </div>
        <div className="flex flex-col items-end gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSavingDraft}
              className="flex-1 sm:flex-none px-6 h-10 font-semibold text-[#001e40] hover:bg-slate-100 transition-all rounded-lg border"
            >
              {isSavingDraft ? 'Saving...' : 'Save Draft'}
            </Button>
            {currentStep < 4 && (
              <Button
                type="button"
                onClick={handleNextStep}
                className="flex-1 sm:flex-none px-8 h-10 bg-[#001e40] text-white font-bold shadow-lg shadow-blue-900/20 rounded-lg active:scale-95 transition-all"
              >
                Next Step
              </Button>
            )}
          </div>
          {lastSavedAt && (
            <p className="text-[10px] text-slate-400 font-medium">
              Draft saved {formatRelativeTime(lastSavedAt)}
            </p>
          )}
        </div>
      </div>

      {/* Resume Draft Banner */}
      {pendingDraft && (
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-[#7b5800]/30 bg-[#7b5800]/5 px-5 py-4">
          <div className="flex items-start gap-3">
            <FileClock className="w-5 h-5 text-[#7b5800] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-[#001e40]">
                You have a saved draft ({formatRelativeTime(pendingDraft.savedAt)})
              </p>
              <p className="text-xs text-slate-500">
                Resume where you left off, or discard it to start fresh.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleDiscardDraft}
              className="h-9 px-4 text-xs font-semibold"
            >
              <X className="w-3.5 h-3.5 mr-1" /> Discard
            </Button>
            <Button
              type="button"
              onClick={handleResumeDraft}
              className="h-9 px-4 text-xs font-bold bg-[#7b5800] text-white hover:bg-[#7b5800]/90"
            >
              Resume Draft
            </Button>
          </div>
        </div>
      )}

      {/* Dynamic Progress Indicator */}
      <div className="mb-12 relative flex justify-between px-2 isolate overflow-hidden">
        <div className="absolute top-11.25 left-20 right-20 h-0.5 bg-slate-200 dark:bg-slate-800 -z-10 -translate-y-1/2"></div>
        {[
          { step: 1, label: 'Basic Details' },
          { step: 2, label: 'Audience' },
          { step: 3, label: 'Venue & Schedule' },
          { step: 4, label: 'Review & Publish' }
        ].map((item) => (
          <div key={item.step} className="flex flex-col items-center gap-3 dark:bg-slate-950 px-2 mt-6">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ring-4 ring-[#f6faff] dark:ring-slate-950 ${currentStep > item.step
                ? 'bg-[#001e40] text-white'
                : currentStep === item.step
                  ? 'bg-[#7b5800] text-white shadow-lg shadow-[#7b5800]/30 scale-105'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}>
              {currentStep > item.step ? '✓' : item.step}
            </div>
            <span className={`text-[10px] md:text-xs uppercase tracking-widest text-center transition-colors ${currentStep === item.step ? 'text-[#001e40] dark:text-slate-50 font-bold' : 'text-slate-400'
              }`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Global Form Wrapper */}
      <form onSubmit={handleSubmit(onFinalSubmit)}>
        {currentStep === 1 && (
          <EventStepBasicDetails
            register={register}
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            onNext={handleNextStep}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {currentStep === 2 && (
          <EventStepAudience
            watch={watch}
            setValue={setValue}
            onNext={handleNextStep}
          />
        )}

        {currentStep === 3 && (
          <EventStepVenueSchedule
            register={register}
            control={control}
            errors={errors}
            getValues={getValues}
            watch={watch}
            onNext={handleNextStep}
            onBack={handleBackStep}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <EventStepReviewPublish
              getValues={getValues}
              onBack={handleBackStep}
              onSaveDraft={handleSaveDraft}
              onStepJump={(stepNum) => setCurrentStep(stepNum)}
            />

            {/* Unified Submit Panel */}
            <div className="text-center py-10 bg-white max-w-4xl mx-auto rounded-xl border px-4 shadow-sm">
              <p className="text-sm text-slate-500 mb-4">
                Review pipeline processing verified. Click below to fire final valid deployment or return.
              </p>
              <div className="flex gap-4 justify-center">
                <Button type="button" onClick={handleBackStep} variant="outline" disabled={isSubmitting}>
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 shadow-md"
                >
                  {isSubmitting ? 'Publishing...' : 'Final Publish Submission'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}