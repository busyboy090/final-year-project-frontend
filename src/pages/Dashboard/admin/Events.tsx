import { useState, useEffect } from 'react';
import {
  Download,
  Calendar,
  CalendarCheck,
  Bell,
  Users,
  Loader2,
  AlertCircle,
  Search
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EventsTable from '@/features/dashboard/admin/EventsTable';
import StatCard from '@/features/dashboard/components/StatCard';
import { useGetEvents } from '@/hooks/useEvent';
import { useOrganisations } from '@/hooks/useOrganisation';
import { useSearchParams } from 'react-router-dom';
import type { EventCategory, EventStatus } from '@/types/event';
import { Label } from '@/components/ui/label';

const parseSearchDate = (dateString: string | null): Date | undefined => {
  if (!dateString) return undefined;
  const parsedDate = new Date(dateString);
  return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
};

function Events() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: orgData } = useOrganisations();

  const organisations = orgData?.data ?? [];

  // Read URL Params to state
  const limit = Number(searchParams.get('limit')) || 20;
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') ?? '';
  const status = searchParams.get('status') ?? 'all';
  const organisation_id = searchParams.get('organisation_id') ?? 'all';
  const category = searchParams.get('category') ?? 'all';

  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateParam('search', localSearch);
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch]);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const venue_id = searchParams.get('venue_id') ? Number(searchParams.get('venue_id')) : undefined;
  const creator_by = searchParams.get('creator_by') ? Number(searchParams.get('creator_by')) : undefined;
  const start_date = parseSearchDate(searchParams.get('start_date'));
  const end_date = parseSearchDate(searchParams.get('end_date'));

  // Fetch data with live URL states
  const { data, isLoading, isError } = useGetEvents({
    limit,
    page,
    search: search || undefined,
    status: status !== 'all' ? (status as EventStatus) : undefined,
    organisation_id: organisation_id !== 'all' ? Number(organisation_id) : undefined,
    category: category !== 'all' ? (category as EventCategory) : undefined,
    venue_id,
    creator_by,
    start_date_from: start_date,
    start_date_to: end_date,
  });

  const events = data?.events ?? [];

  const pagination = {
    total: data?.total ?? 0,
    limit: data?.limit ?? limit,
    page: data?.page ?? page,
    pages: data?.pages ?? 0,
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(newPage));
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-500">

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7b5800] mb-2 block">
            Centralized Oversight
          </span>
          <h1 className="text-4xl font-extrabold tracking-tighter text-[#001e40]">
            Global Event Management
          </h1>
        </div>
        <div className="flex items-center self-end gap-3">
          <Button variant="outline" className="font-semibold gap-2 border-slate-200">
            <Download className="size-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Calendar} label="Upcoming Events" value="24" trend="+12%" />
        <StatCard icon={CalendarCheck} label="Events This Month" value="08" trend="Active" />
        <StatCard icon={Bell} label="Pending Approvals" value="15" isUpdate={true} />
        <StatCard icon={Users} label="Total Registrations" value="1.2k" trend="Total" />
      </section>

      {/* Inline Filters Form Section */}
      <div className="bg-slate-100/60 p-5 rounded-xl border border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top-4 duration-300 items-center">

        {/* Search Term Filter */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-[11px] font-extrabold uppercase tracking-wider px-0.5">
            Search Queries
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search name, organizer..."
              className="pl-9 bg-white border-slate-200 text-sm text-[#001e40]"
            />
          </div>
        </div>

        {/* Organization Filter */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-[11px] font-extrabold uppercase tracking-wider px-0.5">
            Organisation
          </Label>
          <Select value={String(organisation_id)} onValueChange={(val) => updateParam('organisation_id', val)}>
            <SelectTrigger className="bg-white w-full h-10!">
              <SelectValue placeholder="All Organisations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Organisations</SelectItem>
              {Array.isArray(organisations) && organisations.map((org: any) => (
                <SelectItem key={org.id} value={String(org.id)}>{org.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-[11px] font-extrabold uppercase tracking-wider px-0.5">
            Event Status
          </Label>
          <Select value={status} onValueChange={(val) => updateParam('status', val)}>
            <SelectTrigger className="bg-white w-full h-10!">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-[11px] font-extrabold uppercase tracking-wider px-0.5">
            Category
          </Label>
          <Select value={category} onValueChange={(val) => updateParam('category', val)}>
            <SelectTrigger className="bg-white w-full h-10!">
                <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Academic Conference">Academic Conference</SelectItem>
              <SelectItem value="Workshop">Workshop</SelectItem>
              <SelectItem value="Cultural Event">Cultural Event</SelectItem>
              <SelectItem value="Sports Match">Sports Match</SelectItem>
              <SelectItem value="Exhibition/Expo">Exhibition/Expo</SelectItem>
              <SelectItem value="Social Gathering/Party">Social Gathering/Party</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Data Layout section */}
      <div>
        {(isLoading || isError) && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden min-h-[300px] flex flex-col justify-center">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
                <Loader2 className="size-8 animate-spin text-[#001e40]" />
                <p className="text-sm font-medium">Loading events dashboard...</p>
              </div>
            )}

            {isError && !isLoading && (
              <div className="flex flex-col items-center justify-center py-20 text-red-600 space-y-3">
                <AlertCircle className="size-8 text-red-500" />
                <p className="text-sm font-semibold">Failed to load events data.</p>
                <p className="text-xs text-slate-400">Please try refreshing the page or checking your search parameters.</p>
              </div>
            )}
          </div>
        )}

        {!isLoading && !isError && (
          <EventsTable
            events={events}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}

export default Events;
