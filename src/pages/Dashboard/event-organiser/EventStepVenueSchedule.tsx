import { Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Calendar, Users, Building, ArrowLeft, ArrowRight } from 'lucide-react';

export default function EventStepVenueSchedule({ register, control, errors, getValues, onNext, onBack }: any) {
  return (
    <div>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-white p-6 lg:p-8 rounded-xl border shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-[#001e40] flex items-center gap-2"><MapPin className="text-[#7b5800]" /> Venue Parameters</h3>
            
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest font-semibold text-slate-500">Campus Venue</Label>
              <Controller
                name="selectedVenue"
                control={control}
                rules={{ required: 'Please specify a target campus location room asset' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="bg-slate-50 py-6 border-b-2 border-transparent border-t-0 border-x-0 focus:ring-0 focus:border-[#001e40]">
                      <SelectValue placeholder="Browse available main halls..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auditorium-alpha">Main Convocation Auditorium (Alpha)</SelectItem>
                      <SelectItem value="hall-sciences">Faculty of Sciences Lecture Theatre</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.selectedVenue && <p className="text-xs text-red-500 font-medium">{errors.selectedVenue.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest font-semibold text-slate-500">Expected Attendance</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    {...register('expectedAttendees', {
                      required: 'Attendance head count estimation is mandatory',
                      min: { value: 5, message: 'Events require at least 5 expected attendees' }
                    })}
                    className={`bg-slate-50 py-6 border-b-2 focus-visible:ring-0 ${errors.expectedAttendees ? 'border-red-500' : ''}`} 
                    placeholder="e.g. 250" 
                  />
                  <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
                {errors.expectedAttendees && <p className="text-xs text-red-500 font-medium">{errors.expectedAttendees.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest font-semibold text-slate-500">Seating Arrangement</Label>
                <Controller
                  name="seatingStyle"
                  control={control}
                  rules={{ required: 'Arrangement configuration selection required' }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-slate-50 py-6 border-b-2 border-transparent border-t-0 border-x-0 focus:ring-0 focus:border-[#001e40]">
                        <SelectValue placeholder="Select arrangement style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="theater">Theater/Auditorium Style</SelectItem>
                        <SelectItem value="classroom">Classroom Configuration</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Temporal Windows Section */}
          <div className="bg-white p-6 lg:p-8 rounded-xl border shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-[#001e40] flex items-center gap-2"><Calendar className="text-[#7b5800]" /> Temporal Windows</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-slate-500 font-semibold">Start Date</Label>
                  <Input 
                    type="date" 
                    {...register('startDate', { required: 'Start Date is required' })} 
                    className="bg-slate-50 py-6 border-b-2 focus-visible:ring-0" 
                  />
                  {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate.message}</p>}
                </div>
                <div>
                  <Label className="text-xs text-slate-500 font-semibold">End Date</Label>
                  <Input 
                    type="date" 
                    {...register('endDate', { 
                      required: 'End Date is required',
                      validate: (value: any) => {
                        const start = getValues('startDate');
                        if (!start) return true;
                        return new Date(value) >= new Date(start) || 'End Date cannot precede the selected launch date';
                      }
                    })} 
                    className="bg-slate-50 py-6 border-b-2 focus-visible:ring-0" 
                  />
                  {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate.message}</p>}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-slate-500 font-semibold">Start Time</Label>
                  <Input type="time" {...register('startTime', { required: 'Target start configuration hour required' })} className="bg-slate-50 py-6 border-b-2 focus-visible:ring-0" />
                  {errors.startTime && <p className="text-xs text-red-500 mt-1">{errors.startTime.message}</p>}
                </div>
                <div>
                  <Label className="text-xs text-slate-500 font-semibold">End Time</Label>
                  <Input type="time" {...register('endTime', { required: 'Wrap-up time required' })} className="bg-slate-50 py-6 border-b-2 focus-visible:ring-0" />
                  {errors.endTime && <p className="text-xs text-red-500 mt-1">{errors.endTime.message}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-lg font-bold text-[#001e40] mb-4 flex items-center gap-2"><Building className="text-[#7b5800]" /> Live Allocation Info</h3>
            <p className="text-xs text-slate-400">Conflict prevention registers sync automatically on valid entries.</p>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-8">
        <Button type="button" variant="outline" onClick={onBack} className="h-11 px-6 font-semibold flex items-center gap-2 w-full sm:w-auto justify-center">
          <ArrowLeft className="w-4 h-4" /> Back to Basic Details
        </Button>
        <Button type="button" onClick={onNext} className="bg-[#7b5800] text-white font-bold h-11 px-10 rounded-lg flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto">
          Proceed to Resources <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}