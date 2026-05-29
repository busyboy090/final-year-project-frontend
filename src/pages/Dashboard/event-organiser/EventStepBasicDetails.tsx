import { Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info, Bold, Italic, List, ImageIcon, CloudUpload, ArrowRight } from 'lucide-react';
import { DepartmentSelect } from '@/components/ui/department-select';

export default function EventStepBasicDetails({ register, control, errors, onNext }: any) {
  return (
    <div>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-6 lg:p-8 rounded-xl border shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-[#001e40] flex items-center gap-2"><Info className="text-[#7b5800]" /> Core Identity</h3>
            
            {/* Event Title with validation rules */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Event Title</Label>
              <Input 
                {...register('eventTitle', { 
                  required: 'Event title is required',
                  minLength: { value: 10, message: 'Title must encompass at least 10 alphabetical characters' }
                })}
                placeholder="e.g. Annual Symposium on Quantum Humanities"
              />
              {errors.eventTitle && <p className="text-xs text-red-500 font-medium">{errors.eventTitle.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Category Dropdown tracking */}
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: 'Please select a category' }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full h-10!">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Academic Conference">Academic Conference</SelectItem>
                        <SelectItem value="Social Gathering">Social Gathering</SelectItem>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                        <SelectItem value="Formal Ceremony">Formal Ceremony</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && <p className="text-xs text-red-500 font-medium">{errors.category.message}</p>}
              </div>

              {/* Department Dropdown tracking */}
              <DepartmentSelect className='h-11' control={control} errors={errors} />
            </div>

            {/* Event Description Text Area */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Description</Label>
              <div className={`bg-slate-50 rounded-lg p-1 border ${errors.description ? 'border-red-500' : ''}`}>
                <div className="flex gap-1 p-2 border-b">
                  <button type="button" className="p-2 hover:bg-slate-200 rounded text-slate-600"><Bold className="w-4 h-4" /></button>
                  <button type="button" className="p-2 hover:bg-slate-200 rounded text-slate-600"><Italic className="w-4 h-4" /></button>
                  <button type="button" className="p-2 hover:bg-slate-200 rounded text-slate-600"><List className="w-4 h-4" /></button>
                </div>
                <textarea 
                  {...register('description', { 
                    required: 'An explicit functional outline description is required',
                    minLength: { value: 30, message: 'Provide clear documentation (minimum 30 characters)' }
                  })}
                  className="w-full bg-transparent p-4 outline-none resize-none text-sm min-h-[150px]"
                  placeholder="Articulate purpose and scope..."
                />
              </div>
              {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-lg font-bold text-[#001e40] mb-6 flex items-center gap-2"><ImageIcon className="text-[#7b5800]" /> Event Imagery</h3>
            <div className="w-full aspect-video rounded-lg border-2 border-dashed bg-slate-50 flex flex-col items-center justify-center gap-2">
              <CloudUpload className="w-10 h-10 text-[#001e40]" />
              <p className="text-xs font-bold text-[#001e40]">Featured Image</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row justify-end items-center gap-4 border-t pt-8">
        <Button type="button" onClick={onNext} className="w-full sm:w-auto bg-[#7b5800] text-white font-bold h-11 px-10 rounded-lg hover:bg-[#7b5800]/90 flex items-center justify-center gap-2 shadow-lg shadow-[#7b5800]/20">
          Proceed to Venue Selection <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}