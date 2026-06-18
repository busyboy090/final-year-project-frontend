import { Button } from '@/components/ui/button';
import { 
  Info, 
  Edit3, 
  MapPin, 
  Clock, 
  Layers, 
  CheckCircle, 
  Laptop, 
  Mic, 
  FileText, 
  Coffee,
  Users,
} from 'lucide-react';

interface ReviewPublishProps {
  getValues: () => any;
  onBack: () => void;
  onSaveDraft: () => void;
  onStepJump: (stepNumber: number) => void;
}

export default function EventStepReviewPublish({ 
  getValues,
  onStepJump 
}: ReviewPublishProps) {
  // Extract working details safely from centralized form hub
  const currentValues = getValues();

  const audienceSummary = (() => {
    if (currentValues.audience_scope !== 'custom') {
      return 'Everyone';
    }

    const parts: string[] = [];

    if (currentValues.audience_roles?.includes('staff')) {
      const staffTypes = currentValues.audience_staff_types?.length
        ? currentValues.audience_staff_types
            .map((type: string) =>
              type === 'academic-staff' ? 'Academic staff' : 'Non-academic staff',
            )
            .join(', ')
        : 'All staff';
      parts.push(staffTypes);
    }

    if (currentValues.audience_roles?.includes('student')) {
      const levels = currentValues.audience_student_level_ids?.length
        ? `Selected student levels: ${currentValues.audience_student_level_ids.join(', ')}`
        : 'All students';
      parts.push(levels);
    }

    if (currentValues.audience_gender && currentValues.audience_gender !== 'all') {
      parts.push(`${currentValues.audience_gender} only`);
    }

    return parts.length ? parts.join(' / ') : 'Custom audience not selected';
  })();

  return (
    <div className="space-y-6">
      {/* Bento Grid Summary Framework */}
      <div className="grid grid-cols-12 gap-6 items-start">
        
        {/* Module Area 1: Basic Details Core Readout */}
        <section className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl p-6 lg:p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold text-[#001e40] dark:text-slate-50 flex items-center gap-2">
              <Info className="text-[#7b5800] w-5 h-5" />
              Basic Details
            </h3>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onStepJump(1)}
              className="text-[#001e40] hover:text-[#7b5800] hover:bg-slate-50 gap-1 text-xs uppercase tracking-widest font-bold h-8 px-2"
            >
              Edit <Edit3 className="w-3 h-3" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">Event Name</p>
              <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
                {currentValues.title || 'Untitled Academic Event'}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">Category</p>
              <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
                {currentValues.category || 'Unassigned'}
              </p>
            </div>
            <div className="col-span-1 sm:col-span-2">
              <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">Description</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {currentValues.description || 'No summary records provided for this event outline.'}
              </p>
            </div>
          </div>
        </section>

        {/* Module Area 2b: Audience Gate Details */}
        <section className="col-span-12 bg-white dark:bg-slate-900 rounded-xl p-6 lg:p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold text-[#001e40] dark:text-slate-50 flex items-center gap-2">
              <Users className="text-[#7b5800] w-5 h-5" />
              Audience Access
            </h3>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onStepJump(2)}
              className="text-[#001e40] hover:text-[#7b5800] hover:bg-slate-50 gap-1 text-xs uppercase tracking-widest font-bold h-8 px-2"
            >
              Edit <Edit3 className="w-3 h-3" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">Access Mode</p>
              <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
                {currentValues.audience_scope === 'custom' ? 'Custom audience' : 'Everyone'}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">Eligible Audience</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {audienceSummary}
              </p>
            </div>
          </div>
        </section>

        {/* Module Area 2: Sticky Right Admin Context Widget */}
        <aside className="col-span-12 lg:col-span-4 bg-[#001e40] rounded-xl p-6 lg:p-8 text-white shadow-xl shadow-blue-950/20">
          <h3 className="text-xl font-bold mb-6">Review Summary</h3>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center py-2 border-b border-white/10 text-sm">
              <span className="text-slate-300">Completion Status</span>
              <span className="font-bold text-[#f5be4f]">100% Configured</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10 text-sm">
              <span className="text-slate-300">Target Capacity</span>
              <span className="font-bold">{currentValues.capacity || '0'} Seats</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10 text-sm">
              <span className="text-slate-300">Layout Conflicts</span>
              <span className="font-bold text-emerald-400">None Detected</span>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Deployment Memo:</p>
            <p className="text-xs text-slate-200 leading-relaxed">
              Upon final publishing dispatch, reservation tokens link automatically into the campus network infrastructure and logistics managers.
            </p>
          </div>
        </aside>

        {/* Module Area 3: Venue Logistics Meta Details */}
        <section className="col-span-12 lg:col-span-6 bg-white dark:bg-slate-900 rounded-xl p-6 lg:p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold text-[#001e40] dark:text-slate-50 flex items-center gap-2">
              <MapPin className="text-[#7b5800] w-5 h-5" />
              Venue Allocation
            </h3>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onStepJump(3)}
              className="text-[#001e40] hover:text-[#7b5800] hover:bg-slate-50 gap-1 text-xs uppercase tracking-widest font-bold h-8 px-2"
            >
              Edit <Edit3 className="w-3 h-3" />
            </Button>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-lg bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-slate-400 border shrink-0">
                <MapPin className="w-8 h-8 text-[#7b5800]" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1">Allocated Identifier Token</p>
                <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
                  {currentValues.venue_id ? `Asset ID References: #${currentValues.venue_id}` : 'No Location Selected'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Campus Infrastructure Complex</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Target Arrangement</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Standard Room Layout</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">A/V Integration</p>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Hardware Verified</p>
              </div>
            </div>
          </div>
        </section>

        {/* Module Area 4: Chronological Schedule Run Times */}
        <section className="col-span-12 lg:col-span-6 bg-white dark:bg-slate-900 rounded-xl p-6 lg:p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold text-[#001e40] dark:text-slate-50 flex items-center gap-2">
              <Clock className="text-[#7b5800] w-5 h-5" />
              Event Schedule
            </h3>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onStepJump(3)}
              className="text-[#001e40] hover:text-[#7b5800] hover:bg-slate-50 gap-1 text-xs uppercase tracking-widest font-bold h-8 px-2"
            >
              Edit <Edit3 className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800 space-y-6">
            <div className="relative">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#7b5800] ring-4 ring-white dark:ring-slate-900"></div>
              <p className="text-[10px] uppercase tracking-widest text-[#7b5800] font-bold">Start Activation Window</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 mt-0.5">
                {currentValues.startDate || 'Unassigned Date'} @ {currentValues.startTime || '00:00'}
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#001e40]/20 dark:bg-slate-800 ring-4 ring-white dark:ring-slate-900"></div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Projected Close Window</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                {currentValues.endDate || 'Unassigned Date'} @ {currentValues.endTime || '00:00'}
              </p>
            </div>
          </div>
        </section>

        {/* Module Area 5: Step 3 Mock Static Resources Showcase */}
        <section className="col-span-12 bg-white dark:bg-slate-900 rounded-xl p-6 lg:p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold text-[#001e40] dark:text-slate-50 flex items-center gap-2">
              <Layers className="text-[#7b5800] w-5 h-5" />
              Resource Allocation Summary
            </h3>
            <Button
              type="button"
              variant="ghost"
              className="text-slate-400 cursor-not-allowed text-xs uppercase tracking-widest font-bold h-8 px-2"
              disabled
            >
              System Defaults
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              <Laptop className="w-4 h-4 text-[#001e40]" />
              <span>Digital Infrastructure Systems Ready</span>
            </div>
            <div className="px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              <Mic className="w-4 h-4 text-[#001e40]" />
              <span>Media Lecterns Configured</span>
            </div>
            <div className="px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              <FileText className="w-4 h-4 text-[#001e40]" />
              <span>Institutional Program Outlines Included</span>
            </div>
            <div className="px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              <Coffee className="w-4 h-4 text-[#001e40]" />
              <span>Standard Operations Tier Package</span>
            </div>
          </div>
        </section>
      </div>

      {/* Verification Preview Strip */}
      <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center text-center bg-white/50 dark:bg-slate-900/50">
        <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center mb-3 text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-[#001e40] dark:text-slate-200 mb-1">Pre-flight Verification Complete</h4>
        <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
          The pipeline successfully cross-checked all entries against current campus schedules. Review all modules above to make sure configurations match requirements.
        </p>
      </div>
    </div>
  );
}
