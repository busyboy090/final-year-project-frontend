import { Calendar, Clock, MapPin, GraduationCap, Beaker, Trophy, Info, QrCode } from 'lucide-react';
import AttendanceItem from '@/features/dashboard/components/AttendanceItem';
import MilestoneItem from '@/features/dashboard/components/MilestoneItem';
import RegisteredEvents from '@/features/dashboard/RegisteredEvents';
import WelcomeBack from '@/components/ui/welcome-back';

function Dashboard() {

  return (
    <div className="max-w-7xl mx-auto">
      <div className='mb-6 flex max-lg:flex-col justify-between gap-4 lg:items-center'>
        <div>
          <WelcomeBack />
          <p className="text-slate-500 text-sm mt-1 font-medium">Curating Your Academic Experience.</p>
        </div>

        <div className="p-3 flex items-center gap-4 self-end">
          <div className="bg-[#7b5800]/10 p-3 rounded-full text-[#7b5800]">
            <QrCode size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Next Check-in</p>
            <p className="text-sm font-bold text-[#001e40]">In 2 Hours</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Priority Milestone */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative overflow-hidden bg-[#001e40] rounded-xl p-8 text-white group cursor-pointer transition-all hover:-translate-y-1 shadow-xl">
            <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/4 -translate-y-1/4">
              <GraduationCap size={120} />
            </div>
            <div className="relative z-10">
              <span className="inline-block bg-[#7b5800] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">Priority Event</span>
              <h3 className="text-3xl font-bold mb-2">Chancellor's Annual Symposium</h3>
              <p className="text-white/70 max-w-md mb-6 leading-relaxed">Neural Ethics in Modern Research: Join distinguished speakers in the Grand Hall.</p>
              <div className="flex flex-wrap gap-6 text-sm font-medium">
                <span className="flex items-center gap-2"><Calendar size={16} className="text-[#7b5800]" /> Oct 12, 2023</span>
                <span className="flex items-center gap-2"><Clock size={16} className="text-[#7b5800]" /> 10:00 AM</span>
                <span className="flex items-center gap-2"><MapPin size={16} className="text-[#7b5800]" /> Auditorium A</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <MilestoneItem
              icon={Beaker} category="Workshop" title="Advanced Lab Methods" timeLabel="Tomorrow • 2:00 PM"
              attendees={["https://lh3.googleusercontent.com/aida-public/AB6AXuBfM1u7jv09oDfFaGYSn9C-4mvTDJRcvpBv5cKMyBXMtXfMfwvLHpLtZRzonx_JRPZFJt_-NjVAr1E1PMqMn4vjwumG490MnPBtWkb_zAOq0QC-iop5NbLlZJ7aeC8ZDq7ZgoDW_GHtc21D-_0LUYOlzTwU3Qxf6P0_mz1xE8EnIwcZfA71UtEJK7pu0ayPJGqSfTh5iTl9FTl9bhSWiJWhmqfvSMKlXK3G3sT2wnSL1nEkIDpZQ23Fx_4jw1R6Ymh-GoeLoO5DuTM", "https://lh3.googleusercontent.com/aida-public/AB6AXuC2qQdLGUz_zZcstUOg0UsmOhdq2YS86qGsQIC4_8m79LGRaAGLN9qEhcbp3T5Tf3e7IeBqgrducqjwVBW-XBFiEa0nl7Acp_Z7z3ttmSjwQnoygFFIFHfNxAyGUxR7JIS8EqApMtEK6Z1bv5SCY06vBhaBTftEotRb54Kao1EN--LgAjqKqZQ5QqJoiGZy5NoRkw6Y34orXrZGFlNlb6PS3ha_IoLcCBXXOzlfXuZEkopR2Hq1MfeeRnpLTIjZ2S4PnEgCTT4OB6g"]}
            />
            <MilestoneItem
              icon={Trophy} category="Sports" title="Inter-Varsity Finals" timeLabel="Friday • 5:00 PM"
              attendees={["https://lh3.googleusercontent.com/aida-public/AB6AXuD1qJFr8gmGDkGbecqbgbdP0F0nxx8K7WrSJlr5E3eMN-ECFoEL9jd47qLJKUk-pexZYSjrtn7epbAKVuYFD8rV50fiVixbPy0I5sHU9_KLO0HA0FYtDDQmdRxbb214616KghRnf8QwZr9Txns7e0UNIsU5a43iXqmnE6gvi1N6ZxSSfwWta0CgWWlckB_qgp3ndEGbkg427L6HQH0DumNfWMsNjIvv2ULgEYtZ2IxxRKcOLw2sgSLKFMUNslGnbWYjlS1e4ydCYl4"]}
            />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-3">
          {/* Attendance History */}
          <div>
            <h2 className="text-xl font-extrabold text-[#001e40] mb-6 flex items-center gap-2">
              <Clock size={20} className="text-[#7b5800]" /> Attendance History
            </h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
              <div className="p-6 border-b flex items-center justify-between">
                <span className="text-sm font-bold text-[#001e40]">Status Logs</span>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">94% Attendance</span>
              </div>
              <div className="divide-y">
                <AttendanceItem title="Faculty Townhall" date="Oct 08" status="verified" />
                <AttendanceItem title="Research Methods II" date="Oct 05" status="verified" />
                <AttendanceItem title="Peer Mentor Group" date="Oct 02" status="late" />
              </div>
              <button className="w-full py-4 text-xs font-bold text-[#7b5800] uppercase tracking-widest hover:bg-slate-50 transition-colors">Download Detailed Report</button>
            </div>
          </div>

          <div className="bg-[#7b5800]/5 p-6 rounded-xl border border-[#7b5800]/10">
            <h3 className="font-bold text-[#7b5800] text-sm mb-2 flex items-center gap-2">
              <Info size={16} /> Academic Reminder
            </h3>
            <p className="text-xs text-[#7b5800] leading-relaxed">
              Ensure your profile is updated to receive personalized notifications for department-specific events.
            </p>
          </div>
        </div>
      </div>

      <RegisteredEvents />
    </div>
  );
};

export default Dashboard;