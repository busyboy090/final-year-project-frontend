import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, Calendar, Users, Building, ArrowRight, 
  Search, SlidersHorizontal, Check, ShieldCheck, Layers, Cpu,
} from 'lucide-react';
import { useVenues } from '@/hooks/useVenue';

interface FilterProps {
  search?: string;
  minCapacity?: number;
  type?: 'hall' | 'outdoor' | 'classroom' | 'auditorium' | 'lab' | 'all';
}

export default function EventStepVenueSchedule({ register, control, errors, getValues, onNext, watch }: any) {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterProps>({
    search: '',
    minCapacity: undefined,
    type: 'all'
  });

  const { data: responseData, isLoading } = useVenues({
    page,
    limit: 4,
    status: 'available',
    search: filters.search || undefined,
    minCapacity: filters.minCapacity || undefined,
    type: filters.type === 'all' ? undefined : filters.type
  });

  const venues = Array.isArray(responseData) ? responseData : responseData?.items || [];
  const totalPages = responseData?.totalPages || 1;

  // Synchronized state hook watches to align with matching backend tracking parameters
  const selectedVenueId = watch('venue_id');
  const startDate = watch('startDate');
  const startTime = watch('startTime');
  const endTime = watch('endTime');

  const selectedVenueDetails = venues.find((v: any) => {
    const id = v.id ?? v.value;
    return String(id) === String(selectedVenueId);
  });

  const handleFilterChange = (key: keyof FilterProps, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Search Filter Strip Sub-Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-5 space-y-1.5">
          <Label className="text-xs uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5" /> Search Asset Registry
          </Label>
          <Input 
            type="text"
            placeholder="Search venue string match details..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="bg-slate-50 focus-visible:ring-1 focus-visible:ring-[#001e40]"
          />
        </div>

        <div className="md:col-span-3 space-y-1.5">
          <Label className="text-xs uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Minimum Capacity
          </Label>
          <Input 
            type="number"
            placeholder="e.g. 100"
            value={filters.minCapacity || ''}
            onChange={(e) => handleFilterChange('minCapacity', e.target.value ? Number(e.target.value) : undefined)}
            className="bg-slate-50 focus-visible:ring-1 focus-visible:ring-[#001e40]"
          />
        </div>

        <div className="md:col-span-4 space-y-1.5">
          <Label className="text-xs uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Classification Space
          </Label>
          <Select 
            value={filters.type} 
            onValueChange={(val) => handleFilterChange('type', val)}
          >
            <SelectTrigger className="bg-slate-50 focus:ring-1 focus:ring-[#001e40] h-10 w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classifications</SelectItem>
              <SelectItem value="auditorium">Auditorium Space</SelectItem>
              <SelectItem value="lab">Research Laboratory</SelectItem>
              <SelectItem value="classroom">Classroom Setup</SelectItem>
              <SelectItem value="hall">Main Hall</SelectItem>
              <SelectItem value="outdoor">Outdoor Plaza</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Bento Catalog Visual Grid & Parameters */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <header className="flex flex-col gap-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-[#001e40]">Campus Venues</h1>
              </header>
              {errors.venue_id && (
                <span className="text-xs bg-red-50 text-red-600 font-medium px-3 py-1.5 rounded-lg border border-red-200 animate-pulse">
                  {errors.venue_id.message}
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-96 items-center justify-center text-center bg-white rounded-xl border border-dashed">
                <p className="text-slate-400 text-sm col-span-2">Syncing premium structural arrays...</p>
              </div>
            ) : venues.length === 0 ? (
              <div className="grid grid-cols-1 h-80 items-center justify-center text-center bg-white rounded-xl border border-dashed p-6">
                <div className="space-y-2">
                  <p className="text-slate-700 font-semibold">No assets found matching parameters</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">Try loosening your target head-count filters or shifting keyword characters.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="venue_id" // Standardized token hook reference matching backend mapping schema
                  control={control}
                  rules={{ required: 'Please specify a target campus location room asset' }}
                  render={({ field }) => (
                    <>
                      {venues.map((venue: any) => {
                        const id = venue.id ?? venue.value;
                        const venueId = String(id);
                        const isSelected = String(field.value) === venueId;

                        return (
                          <div 
                            key={id}
                            onClick={() => field.onChange(venueId)}
                            className={`group relative bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 border-2 cursor-pointer flex flex-col h-full ${
                              isSelected 
                                ? 'border-[#7b5800] ring-4 ring-[#7b5800]/5 shadow-md' 
                                : 'border-slate-100 hover:border-slate-300'
                            }`}
                          >
                            <div className="h-44 relative overflow-hidden bg-slate-50 flex items-center justify-center border-b border-slate-100">
                              {venue.thumbnail ? (
                                <img 
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                  src={venue.thumbnail} 
                                  alt={venue.name}
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center text-slate-300 select-none space-y-1">
                                  <Building className="w-10 h-10 stroke-[1.25] text-slate-300/80 group-hover:scale-110 transition-transform duration-300" />
                                  <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400/70">No Media Assets</span>
                                  </div>
                              )}
                              
                              {isSelected ? (
                                <div className="absolute top-3 right-3 bg-[#7b5800] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm z-10">
                                  <Check className="w-3 h-3 stroke-3" /> Active Selection
                                </div>
                              ) : (
                                <div className="absolute top-3 right-3 bg-slate-900/80 text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm z-10">
                                  {venue.type || 'Space'}
                                </div>
                              )}
                            </div>
                            
                            <div className="p-5 flex flex-col grow justify-between">
                              <div>
                                <div className="flex justify-between items-start mb-1.5">
                                  <h3 className="text-lg font-bold text-[#001e40] leading-snug">{venue.name || venue.label}</h3>
                                  <ShieldCheck className={`w-4 h-4 shrink-0 mt-1 ${isSelected ? 'text-[#7b5800]' : 'text-slate-400'}`} />
                                </div>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                                  <MapPin className="w-3 h-3 text-slate-400" /> {venue.location || 'Main Campus'}
                                </p>
                                <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                                  {venue.description || 'Premium academic deployment target with unified modern structural configuration.'}
                                </p>

                                {venue.venueFacilities && venue.venueFacilities.length > 0 && (
                                  <div className="mb-4 space-y-1.5">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                                      <Cpu className="w-3 h-3" /> Included Features
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {venue.venueFacilities.map((vf: any) => (
                                        <span 
                                          key={vf.id} 
                                          className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                                        >
                                          {vf.facility?.name}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-4">
                                <div className="flex gap-4 border-t pt-3 text-slate-500">
                                  <div className="flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-xs font-semibold">{venue.capacity || '250'} Cap.</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-xs capitalize">{venue.type || 'Standard'} Layout</span>
                                  </div>
                                </div>

                                <Button
                                  type="button"
                                  variant={isSelected ? "default" : "outline"}
                                  className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                                    isSelected 
                                      ? 'bg-[#7b5800] text-white hover:bg-[#5d4200]' 
                                      : 'border-slate-200 text-[#001e40] hover:bg-slate-50'
                                  }`}
                                >
                                  {isSelected ? 'Asset Confirmed' : 'Select Venue Asset'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                />
              </div>
            )}

            {/* Catalog Grid Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-end items-center gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  className="h-8 text-xs font-medium"
                >
                  Previous
                </Button>
                <span className="text-xs font-medium text-slate-500 px-2">
                  Page {page} of {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  className="h-8 text-xs font-medium"
                >
                  Next
                </Button>
              </div>
            )}
          </div>

          {/* Setup parameters & Event Requirements Strip */}
          <div className="bg-white p-6 lg:p-8 rounded-xl border shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-[#001e40] flex items-center gap-2"><MapPin className="text-[#7b5800]" /> Venue Requirements</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest font-semibold text-slate-500">Expected Attendance</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    {...register('capacity', { // Standardized key assignment registration update
                      required: 'Attendance head count estimation is mandatory',
                      min: { value: 5, message: 'Events require at least 5 expected attendees' },
                      validate: (value: string) => Number.isInteger(Number(value)) || 'Attendance must be a whole number'
                    })}
                    className={`bg-slate-50 py-6 border-b-2 focus-visible:ring-0 ${errors.capacity ? 'border-red-500' : ''}`} 
                    placeholder="e.g. 250" 
                  />
                  <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
                {errors.capacity && <p className="text-xs text-red-500 font-medium">{errors.capacity.message}</p>}
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

        {/* Right Column: Dynamic Live Execution Allocation Panel */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-[#001e40] p-6 rounded-xl text-white shadow-xl sticky top-24 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-white/10 pb-4">
              <Building className="text-[#fec657] w-5 h-5" /> Schedule Summary
            </h2>
            
            <div className="space-y-4 text-sm">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">Selected Space Target</span>
                <p className="font-semibold text-white text-base truncate">
                  {selectedVenueDetails ? (selectedVenueDetails.name || selectedVenueDetails.label) : 'None Selected'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-xs text-slate-400 block">Date Set</span>
                  <p className="font-medium text-slate-200">{startDate || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Window Range</span>
                  <p className="font-medium text-slate-200">
                    {startTime && endTime ? `${startTime} - ${endTime}` : 'Hours unassigned'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Conflict Registry Sync</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" /> Automated
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Setup Threshold Cost</span>
                  <span className="text-[#fec657] font-bold">Included</span>
                </div>
              </div>
            </div>

            <Button 
              type="button" 
              onClick={onNext}
              className="w-full py-6 bg-[#7b5800] text-white font-bold rounded-lg hover:bg-[#5d4200] transition-all shadow-md flex items-center justify-center gap-2 text-sm"
            >
              Confirm & Lock Allocation <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Primary Action Control Row */}
      <div className="mt-8 flex flex-col sm:flex-row justify-end items-center gap-4 border-t pt-6">
        <Button 
          type="button" 
          onClick={onNext} 
          className="bg-[#001e40] hover:bg-[#003366] text-white font-bold h-11 px-10 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm"
        >
          Proceed to Resources <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
