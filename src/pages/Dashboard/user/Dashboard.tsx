import { Calendar, Clock, MapPin, GraduationCap, Beaker, Trophy, Info, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

import AttendanceItem from '@/features/dashboard/components/AttendanceItem';
import MilestoneItem from '@/features/dashboard/components/MilestoneItem';
import RegisteredEvents from '@/features/dashboard/RegisteredEvents';
import WelcomeBack from '@/components/ui/welcome-back';
import { useMyEnrollments } from '@/hooks/useEvent';
import useAuth from '@/hooks/useAuth';
import { formatDate } from '@/utils/format';

const formatTime = (date?: string) => {
  if (!date) return "Time pending";
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const categoryIcon = (category?: string) => {
  if (category === "Sports Match") return Trophy;
  if (category === "Workshop") return Beaker;
  return Calendar;
};

function Dashboard() {
  const { user } = useAuth();
  const { data: enrollments = [] } = useMyEnrollments();

  const roleSegment = user?.role === "staff" ? "staff" : "student";
  const activeEnrollments = enrollments.filter((item) => item.status !== "cancelled" && item.event);
  const upcomingEnrollments = activeEnrollments
    .filter((item) => item.event && new Date(item.event.start_date) >= new Date())
    .sort((a, b) => new Date(a.event!.start_date).getTime() - new Date(b.event!.start_date).getTime());
  const nextEnrollment = upcomingEnrollments[0];
  const nextEvent = nextEnrollment?.event;
  const secondaryEvents = upcomingEnrollments.slice(1, 3);
  const attendedCount = enrollments.filter((item) => item.status === "attended").length;
  const attendanceRate = enrollments.length
    ? Math.round((attendedCount / enrollments.length) * 100)
    : 0;
  const history = enrollments
    .filter((item) => item.event)
    .slice()
    .sort((a, b) => {
      const aDate = a.check_in_time || a.event?.start_date || "";
      const bDate = b.check_in_time || b.event?.start_date || "";
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    })
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto">
      <div className='mb-6 flex max-lg:flex-col justify-between gap-4 lg:items-center'>
        <div>
          <WelcomeBack />
          <p className="text-slate-500 text-sm mt-1 font-medium">Curating your academic experience.</p>
        </div>

        <div className="p-3 flex items-center gap-4 self-end">
          <div className="bg-[#7b5800]/10 p-3 rounded-full text-[#7b5800]">
            <QrCode size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Next Check-in</p>
            <p className="text-sm font-bold text-[#001e40]">
              {nextEvent ? formatDate(new Date(nextEvent.start_date)) : "No upcoming event"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-8 space-y-6">
          <Link
            to={nextEvent ? `/dashboard/${roleSegment}/events/${nextEvent.id}` : `/dashboard/${roleSegment}/events`}
            className="block relative overflow-hidden bg-[#001e40] rounded-xl p-8 text-white group cursor-pointer transition-all hover:-translate-y-1 shadow-xl"
          >
            <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/4 -translate-y-1/4">
              <GraduationCap size={120} />
            </div>
            <div className="relative z-10">
              <span className="inline-block bg-[#7b5800] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                {nextEvent ? "Next Registered Event" : "Event Discovery"}
              </span>
              <h3 className="text-3xl font-bold mb-2">
                {nextEvent?.title ?? "No upcoming registered event"}
              </h3>
              <p className="text-white/70 max-w-md mb-6 leading-relaxed">
                {nextEvent?.description ?? "Browse approved events and register for sessions that match your profile."}
              </p>
              <div className="flex flex-wrap gap-6 text-sm font-medium">
                <span className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#7b5800]" />
                  {nextEvent ? formatDate(new Date(nextEvent.start_date)) : "No date selected"}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={16} className="text-[#7b5800]" />
                  {formatTime(nextEvent?.start_date)}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#7b5800]" />
                  {nextEvent?.venue?.name ?? "Venue pending"}
                </span>
              </div>
            </div>
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {secondaryEvents.map((enrollment) => {
              const event = enrollment.event!;
              const Icon = categoryIcon(event.category);

              return (
                <Link key={enrollment.id} to={`/dashboard/${roleSegment}/events/${event.id}`}>
                  <MilestoneItem
                    icon={Icon}
                    category={event.category ?? "Event"}
                    title={event.title}
                    timeLabel={`${formatDate(new Date(event.start_date))} - ${event.venue?.name ?? "Venue pending"}`}
                    attendeeCount={typeof event.fillPercentage === "number" ? Math.round(event.fillPercentage) : null}
                  />
                </Link>
              );
            })}
            {secondaryEvents.length === 0 && (
              <Link
                to={`/dashboard/${roleSegment}/events`}
                className="sm:col-span-2 rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center hover:bg-slate-50 transition-colors"
              >
                <h4 className="font-bold text-[#001e40]">Find more events</h4>
                <p className="mt-2 text-sm text-slate-500">
                  Your next recommended events will appear here after registration.
                </p>
              </Link>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-3">
          <div>
            <h2 className="text-xl font-extrabold text-[#001e40] mb-6 flex items-center gap-2">
              <Clock size={20} className="text-[#7b5800]" /> Attendance History
            </h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
              <div className="p-6 border-b flex items-center justify-between">
                <span className="text-sm font-bold text-[#001e40]">Status Logs</span>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                  {attendanceRate}% Attendance
                </span>
              </div>
              <div className="divide-y">
                {history.map((enrollment) => (
                  <AttendanceItem
                    key={enrollment.id}
                    title={enrollment.event?.title ?? "Untitled event"}
                    date={formatDate(new Date(enrollment.check_in_time || enrollment.event?.start_date || new Date()))}
                    status={enrollment.status}
                  />
                ))}
                {history.length === 0 && (
                  <div className="p-6 text-sm text-slate-500">
                    Attendance logs will appear after you register or check in.
                  </div>
                )}
              </div>
              <Link
                to={`/dashboard/${roleSegment}/my-events`}
                className="block w-full py-4 text-center text-xs font-bold text-[#7b5800] uppercase tracking-widest hover:bg-slate-50 transition-colors"
              >
                View My Events
              </Link>
            </div>
          </div>

          <div className="bg-[#7b5800]/5 p-6 rounded-xl border border-[#7b5800]/10">
            <h3 className="font-bold text-[#7b5800] text-sm mb-2 flex items-center gap-2">
              <Info size={16} /> Profile Reminder
            </h3>
            <p className="text-xs text-[#7b5800] leading-relaxed">
              Keep your profile complete so audience-specific events can be matched correctly.
            </p>
          </div>
        </div>
      </div>

      <RegisteredEvents />
    </div>
  );
};

export default Dashboard;
