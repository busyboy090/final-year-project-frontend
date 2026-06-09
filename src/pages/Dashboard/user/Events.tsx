import {
  Calendar,
  Clock,
  Loader2,
  MapPin,
  Search,
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useGetEvents, useJoinEvent, useMyEnrollments } from "@/hooks/useEvent";
import { formatDate, formatMinutes } from "@/utils/format";
import type { Event } from "@/types/event";

const FALLBACK_IMAGE = "/images/event-fallback.jpg";
const ITEMS_PER_PAGE = 6;

type CategoryFilter =
  | "All"
  | "Academic Conference"
  | "Workshop"
  | "Cultural Event"
  | "Sports Match"
  | "Exhibition/Expo"
  | "Social Gathering/Party";

function EventThumbnail({
  src,
  alt,
  enrolled,
}: {
  src?: string | null;
  alt: string;
  enrolled: boolean;
}) {
  const [errored, setErrored] = useState(false);
  const resolved = !src || errored ? FALLBACK_IMAGE : src;

  return (
    <div className="h-56 w-full overflow-hidden relative">
      <img
        src={resolved}
        alt={alt}
        onError={() => setErrored(true)}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {enrolled && (
        <div className="absolute top-4 left-4">
          <Badge className="bg-[#fec657] text-[#271900] hover:bg-[#fec657] border-none px-3 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg rounded-lg gap-1">
            <UserCheck className="size-3" />
            Registered
          </Badge>
        </div>
      )}
    </div>
  );
}

function EventCard({
  event,
  enrolled,
  onJoin,
  isJoining,
}: {
  event: Event;
  enrolled: boolean;
  onJoin: (id: number) => Promise<void>;
  isJoining: boolean;
}) {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full border border-slate-100">
      <EventThumbnail
        src={event.thumbnail}
        alt={event.title}
        enrolled={enrolled}
      />

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] font-black text-[#7b5800] uppercase tracking-[0.2em]">
            {event.category ?? "General"}
          </span>
          <div className="flex items-center gap-1 text-[#43474f] text-[10px] font-medium">
            <Clock className="size-3" />
            {formatMinutes(event.duration)}
          </div>
        </div>

        <h3 className="text-md font-bold text-[#001e40] mb-2 leading-tight group-hover:text-[#7b5800] transition-colors line-clamp-2">
          {event.title}
        </h3>

        <div className="flex items-center gap-4 mb-4 text-[#43474f]">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4 text-slate-400" />
            <span className="text-xs font-semibold">
              {formatDate(new Date(event.start_date))}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="size-4 text-slate-400" />
            <span className="text-xs font-semibold truncate max-w-37.5">
              {event.venue?.name ?? "Venue TBA"}
            </span>
          </div>
        </div>

        <p className="text-sm text-[#43474f]/80 font-body mb-6 line-clamp-2 leading-relaxed">
          {event.description ??
            "An intensive gathering curated for the leaders and scholars of Admiralty University."}
        </p>

        <div className="mt-auto">
          <Button
            disabled={enrolled || isJoining}
            onClick={() => onJoin(event.id)}
            className={`w-full py-6 font-bold rounded-lg transition-all active:scale-[0.98] border-none shadow-none ${
              enrolled
                ? "bg-slate-100 text-slate-400 hover:bg-slate-100 cursor-not-allowed border border-slate-200"
                : "bg-[#001e40] text-white hover:bg-[#003366]"
            }`}
          >
            {isJoining ? (
              <Loader2 className="size-4 animate-spin" />
            ) : enrolled ? (
              "Enrolled"
            ) : (
              "Register"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Events() {
  const { data, isLoading, isError } = useGetEvents({
    status: "approved",
    limit: 50,
  });
  const { data: enrollments = [] } = useMyEnrollments();
  const joinEvent = useJoinEvent();

  // Filter, Search, and Pagination States
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [joiningId, setJoiningId] = useState<number | null>(null);

  const enrolledEventIds = useMemo(() => {
    return new Set(enrollments.map((item) => item.event?.id).filter(Boolean));
  }, [enrollments]);

  const rawEvents: Event[] = data?.events ?? [];

  // 1. Core Filter Logic (Now completely pure without state-setting side effects)
  const filteredEvents = useMemo(() => {
    return rawEvents.filter((event) => {
      const matchesCategory =
        selectedCategory === "All" || event.category === selectedCategory;
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description &&
          event.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [rawEvents, selectedCategory, searchQuery]);

  // 2. Pagination Math Slicing
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEvents, currentPage]);

  const handleJoin = async (eventId: number) => {
    setJoiningId(eventId);
    try {
      await joinEvent.mutateAsync(eventId);
      toast.success("You're registered! See you at the event.");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Could not register for event.",
      );
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div>
      <main className="pb-12 space-y-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <p className="text-[#7b5800] font-bold tracking-widest text-[10px] uppercase mb-1">
              Event Registry
            </p>
            <h1 className="text-4xl font-black text-[#001e40] tracking-tighter leading-none">
              Available Events
            </h1>
          </div>
          <p className="text-sm text-[#43474f]">
            Browse and register for approved university events.
          </p>
        </header>

        {/* Search and Dropdown Filter Utility Bar using Shadcn Components */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-stretch md:items-end">
          {/* Shadcn UI Search Input Field */}
          <div className="flex-1 relative">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#43474f] mb-2">
              Search
            </label>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4 z-10" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Safely reset page index on text input change
                }}
                placeholder="Search events, context parameters, or keywords..."
                className="w-full rounded-lg h-10 pl-10 pr-4 text-xs font-medium text-[#141d23] focus-visible:ring-2 focus-visible:ring-[#001e40]/20 transition-all placeholder:text-slate-400 shadow-none"
              />
            </div>
          </div>

          {/* Shadcn UI Custom Controlled Select Dropdown */}
          <div className="w-full md:w-72 relative">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#43474f] mb-2">
              Category Filter
            </label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value as CategoryFilter);
                setCurrentPage(1); // Safely reset page index on filter updates
              }}
            >
              <SelectTrigger className="w-full h-10!">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All" className="text-xs font-medium">
                  All Categories
                </SelectItem>
                <SelectItem
                  value="Academic Conference"
                  className="text-xs font-medium"
                >
                  Academic Conference
                </SelectItem>
                <SelectItem value="Workshop" className="text-xs font-medium">
                  Workshop
                </SelectItem>
                <SelectItem
                  value="Cultural Event"
                  className="text-xs font-medium"
                >
                  Cultural Event
                </SelectItem>
                <SelectItem
                  value="Sports Match"
                  className="text-xs font-medium"
                >
                  Sports Match
                </SelectItem>
                <SelectItem
                  value="Exhibition/Expo"
                  className="text-xs font-medium"
                >
                  Exhibition/Expo
                </SelectItem>
                <SelectItem
                  value="Social Gathering/Party"
                  className="text-xs font-medium"
                >
                  Social Gathering/Party
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl h-105 animate-pulse border border-slate-100 shadow-sm"
              />
            ))}
          </div>
        )}

        {/* Server Async Error UI Context */}
        {isError && (
          <div className="rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center max-w-md mx-auto">
            <p className="text-sm font-semibold text-red-800 mb-1">
              Failed to synchronize events
            </p>
            <p className="text-xs text-red-600 mb-4">
              {" "}
              We encountered an issue linking with the database matrix.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="text-xs"
            >
              Retry Handshake
            </Button>
          </div>
        )}

        {/* Empty Search / Filter Results Vector */}
        {!isLoading && !isError && filteredEvents.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-20 text-center w-full mx-auto shadow-sm">
            <Calendar className="size-10 text-slate-300 mx-auto mb-4" />
            <h3 className="text-sm font-bold text-[#001e40] mb-1">
              No matches found
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              There are no approved events matching "{selectedCategory}" or your
              current search filters.
            </p>
          </div>
        )}

        {/* Primary Data Grid Matrix */}
        {!isLoading && !isError && filteredEvents.length > 0 && (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch">
              {paginatedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  enrolled={enrolledEventIds.has(event.id)}
                  onJoin={handleJoin}
                  isJoining={joiningId === event.id}
                />
              ))}
            </section>

            {/* Premium Style Pagination controls block */}
            {totalPages > 1 && (
              <section className="mt-16 flex justify-center items-center gap-4 pt-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-lg border border-slate-200 bg-white text-[#001e40] hover:bg-[#ecf5fe] transition-colors disabled:opacity-30 shadow-none"
                >
                  <ChevronLeft className="size-4" />
                </Button>

                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    const isSelected = currentPage === pageNumber;

                    return (
                      <Button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all shadow-none ${
                          isSelected
                            ? "bg-[#001e40] text-white hover:bg-[#001e40]"
                            : "bg-white border border-slate-200 text-[#43474f] hover:bg-[#ecf5fe] hover:text-[#001e40]"
                        }`}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-lg border border-slate-200 bg-white text-[#001e40] hover:bg-[#ecf5fe] transition-colors disabled:opacity-30 shadow-none"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
