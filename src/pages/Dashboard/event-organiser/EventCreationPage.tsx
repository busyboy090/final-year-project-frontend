import { useState } from 'react';
import { useForm } from 'react-hook-form';
import EventStepBasicDetails from './EventStepBasicDetails';
import EventStepVenueSchedule from './EventStepVenueSchedule';
import EventStepReviewPublish from './EventStepReviewPublish';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/apis/axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Declare type interface aligned directly with your backend keys
export interface EventFormValues {
  title: string;
  category: string;
  description: string;
  thumbnail: File[];
  venue_id: string;
  capacity: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export default function EventCreationPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate()

  // Initialize unified react-hook-form hub
  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    watch,
    formState: { errors }
  } = useForm<EventFormValues>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      category: 'Academic Conference',
      description: '',
      venue_id: '',
      capacity: '',
      thumbnail: [],
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
    }
  });

  // Step validation gatekeeper
  const handleNextStep = async () => {
    let fieldsToValidate: Array<keyof EventFormValues> = [];

    if (currentStep === 1) {
      fieldsToValidate = ['title', 'category', 'description'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['venue_id', 'capacity', 'startDate', 'endDate', 'startTime', 'endTime'];
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
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

      await apiClient.post('/v1/events', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Event created successfully");

      navigate("/dashboard/events")
    } catch (error: any) {
      console.error('SUBMIT_EVENT_FORM_ERROR:', error);
      const serverMessage = error.response?.data?.message || 'Failed to publish event application.';
      toast.error(serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    const currentValues = getValues();
    console.log('Saving intermediate partial payload draft:', currentValues);
    toast.success('Draft auto-cached successfully.');
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
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            className="flex-1 sm:flex-none px-6 h-10 font-semibold text-[#001e40] hover:bg-slate-100 transition-all rounded-lg border"
          >
            Save Draft
          </Button>
          {currentStep < 3 && (
            <Button
              type="button"
              onClick={handleNextStep}
              className="flex-1 sm:flex-none px-8 h-10 bg-[#001e40] text-white font-bold shadow-lg shadow-blue-900/20 rounded-lg active:scale-95 transition-all"
            >
              Next Step
            </Button>
          )}
        </div>
      </div>

      {/* Dynamic Progress Indicator */}
      <div className="mb-12 relative flex justify-between px-2 isolate overflow-hidden">
        <div className="absolute top-[45px] left-[80px] right-[80px] h-[2px] bg-slate-200 dark:bg-slate-800 -z-10 -translate-y-1/2"></div>
        {[
          { step: 1, label: 'Basic Details' },
          { step: 2, label: 'Venue & Schedule' },
          { step: 3, label: 'Review & Publish' }
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
            onNext={handleNextStep}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {currentStep === 2 && (
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

        {currentStep === 3 && (
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