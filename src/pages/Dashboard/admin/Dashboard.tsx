import WelcomeBack from '@/components/ui/welcome-back';
import StatCard from '@/features/dashboard/components/StatCard';
import { Calendar, CalendarDays, Mail, Users, MoreVertical, Clock, ChevronRight } from 'lucide-react';

function AdminDashboard() {
    return (
        <div className="px-2 pb-12">
            <div className='mb-4'>
                <WelcomeBack />
                <p className="text-slate-500 text-sm mt-1 font-medium">Monitoring the pulse of Admiralty University Events.</p>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard icon={Calendar} label="Upcoming Events" value="24" trend="+12%" />
                <StatCard icon={CalendarDays} label="Events This Month" value="08" trend="THIS MONTH" />
                <StatCard icon={Mail} label="Unread Notifications" value="15" isUpdate={true} />
                <StatCard icon={Users} label="Total Attendance" value="1.2k" trend="TOTAL" />
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Table Section */}
                <section className="xl:col-span-2 bg-white rounded-2xl p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="text-xl font-extrabold text-[#001e40] flex items-center gap-2">
                            <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
                            Recent Events
                        </h4>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-slate-50 rounded-lg text-xs font-bold text-slate-700 border hover:bg-[#001e40] hover:text-white transition-all">Filter</button>
                            <button className="px-4 py-2 bg-slate-50 rounded-lg text-xs font-bold text-slate-700 border hover:bg-[#001e40] hover:text-white transition-all">Export CSV</button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-[10px] uppercase tracking-widest text-slate-500 font-bold border-b">
                                <tr>
                                    <th className="pb-4">Event Title</th>
                                    <th className="pb-4">Date</th>
                                    <th className="pb-4">Venue</th>
                                    <th className="pb-4">Status</th>
                                    <th className="pb-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {[
                                    { title: "Convocation Gala 2024", date: "Oct 24, 2023", venue: "Main Auditorium", status: "Completed", color: "green" },
                                    { title: "Cybersecurity Symposium", date: "Nov 02, 2023", venue: "Tech Hub C4", status: "Scheduled", color: "blue" },
                                    { title: "Alumni Networking Mixer", date: "Nov 15, 2023", venue: "Officers' Mess", status: "Pending", color: "amber" },
                                ].map((event, i) => (
                                    <tr key={i} className="group hover:bg-slate-50 transition-colors">
                                        <td className="py-5 font-bold text-[#001e40]">{event.title}</td>
                                        <td className="py-5 text-slate-500">{event.date}</td>
                                        <td className="py-5 text-slate-500">{event.venue}</td>
                                        <td className="py-5">
                                            <span className={`px-3 py-1 bg-${event.color}-100 text-${event.color}-700 rounded-full text-[10px] font-black uppercase`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="py-5 text-right"><MoreVertical size={16} className="inline cursor-pointer" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Sidebar Cards */}
                <aside className="space-y-8">
                    <div className="bg-[#001e40] text-white rounded-2xl p-8 relative overflow-hidden shadow-xl">
                        <h4 className="text-xl font-black mb-6 relative z-10">Quick Actions</h4>
                        <div className="space-y-3 relative z-10">
                            {['Create New Event', 'View Calendar', 'Download Reports'].map((item) => (
                                <button key={item} className="w-full flex items-center justify-between p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all border border-white/10 group">
                                    <span className="font-bold text-sm">{item}</span>
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-lg font-extrabold text-[#001e40]">Agenda</h4>
                            <a href="#" className="text-xs font-bold text-amber-600 uppercase hover:underline">See All</a>
                        </div>
                        <div className="space-y-4">
                            {[12, 14, 20].map((day) => (
                                <div key={day} className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                    <div className="flex flex-col items-center justify-center w-12 h-14 bg-white rounded-lg border shadow-sm">
                                        <span className="text-[10px] font-black text-slate-400">NOV</span>
                                        <span className="text-xl font-black text-[#001e40]">{day}</span>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-bold text-[#001e40] group-hover:text-amber-600">Event Title</h5>
                                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                            <Clock size={12} /> 10:00 AM
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default AdminDashboard