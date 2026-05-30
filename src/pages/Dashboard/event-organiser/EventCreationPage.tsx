import { useState } from 'react';
import { useForm } from 'react-hook-form';
import EventStepBasicDetails from './EventStepBasicDetails';
import EventStepVenueSchedule from './EventStepVenueSchedule';
import EventStepReviewPublish from './EventStepReviewPublish';
import { Button } from '@/components/ui/button';

// 1. Declare type interface for internal compilation safety
export interface EventFormValues {
  eventTitle: string;
  category: string;
  department: string;
  description: string;
  selectedVenue: string;
  seatingStyle: string;
  expectedAttendees: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export default function EventCreationPage() {
  const [currentStep, setCurrentStep] = useState<number>(2);

  // 2. Initialize unified react-hook-form hub
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
      eventTitle: '',
      category: 'Academic Conference',
      department: 'Faculty of Sciences',
      description: '',
      selectedVenue: '',
      seatingStyle: 'theater',
      expectedAttendees: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
    }
  });

  // 3. Step validation gatekeeper
  const handleNextStep = async () => {
    let fieldsToValidate: Array<keyof EventFormValues> = [];

    if (currentStep === 1) {
      fieldsToValidate = ['eventTitle', 'category', 'department', 'description'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['selectedVenue', 'expectedAttendees', 'seatingStyle', 'startDate', 'endDate', 'startTime', 'endTime'];
    }

    // Trigger validation exclusively for current step fields before passing
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBackStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const onFinalSubmit = (data: EventFormValues) => {
    console.log('Final Event Data Payload Verified Ready for Server:', data);
    alert('Event successfully constructed and published!');
  };

  const handleSaveDraft = () => {
    const currentValues = getValues();
    console.log('Saving intermediate partial payload draft:', currentValues);
    alert('Draft auto-cached successfully.');
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
            variant="outline"
            onClick={handleSaveDraft}
            className="flex-1 sm:flex-none px-6 h-10 font-semibold text-[#001e40] hover:bg-slate-100 transition-all rounded-lg border"
          >
            Save Draft
          </Button>
          <Button
            onClick={handleNextStep}
            className="flex-1 sm:flex-none px-8 h-10 bg-[#001e40] text-white font-bold shadow-lg shadow-blue-900/20 rounded-lg active:scale-95 transition-all"
          >
            Next Step
          </Button>
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

        {currentStep > 2 && (
          <div className="text-center py-20 bg-white max-w-4xl mx-auto rounded-xl border mt-8 px-4">
            <p className="text-sm text-slate-500 mb-4">Review pipeline processing engine placeholder. Click below to fire final valid deployment or return.</p>
            <div className="flex gap-4 justify-center">
              <Button type="button" onClick={handleBackStep} variant="outline">Back</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">Final Publish Submission</Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <EventStepReviewPublish
            getValues={getValues}
            onBack={handleBackStep}
            onSaveDraft={handleSaveDraft}
            onStepJump={(stepNum) => setCurrentStep(stepNum)} // Enriches jump execution paths
          />
        )}
      </form>
    </div>
  );
}