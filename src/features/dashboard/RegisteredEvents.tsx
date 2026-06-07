import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import RegisteredEventCard from "./components/RegisteredEventCard";
import { useMyEnrollments } from "@/hooks/useEvent";
import { formatDate } from "@/utils/format";

function RegisteredEvents() {
  const { data: enrollments = [] } = useMyEnrollments();
  const events = enrollments.filter((item) => item.event);

  return (
    <section className="py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-[#001e40] tracking-tight">
            Registered Events
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Managed list of your confirmed registrations.
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((enrollment) => (
          <RegisteredEventCard 
            key={enrollment.id}
            image={enrollment.event?.thumbnail || "/favicon.svg"}
            date={enrollment.event?.start_date ? formatDate(new Date(enrollment.event.start_date)) : "Pending"}
            title={enrollment.event?.title || "Untitled event"}
            description={enrollment.event?.description || enrollment.status}
          />
        ))}

        {/* Add More Events Placeholder */}
        <Link to="events" className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center group hover:border-[#7b5800] hover:bg-slate-50 transition-all cursor-pointer min-h-[320px]">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-[#7b5800]/10 transition-colors">
            <Plus className="text-slate-400 group-hover:text-[#7b5800]" size={32} />
          </div>
          <h4 className="font-bold text-[#001e40] mb-1">Add More Events</h4>
          <p className="text-xs text-slate-500 max-w-[180px]">
            Explore thousands of university activities and sessions.
          </p>
        </Link>
      </div>
    </section>
  );
}

export default RegisteredEvents;
