import React from 'react';
import { 
  Bell, 
  CalendarDays, 
  Users, 
  Wallet, 
  TrendingUp, 
  FileEdit, 
  BarChart3, 
  Pin, 
  ArrowRight, 
  Plus 
} from 'lucide-react';

export default function CuratorDashboardMain() {
  // Mock data matching your template state
  const recentEvents = [
    { id: 1, name: "Inter-University Symposium 2024", date: "Oct 24, 2024", status: "Published", color: "bg-secondary" },
    { id: 2, name: "Navy Leadership Seminar", date: "Nov 02, 2024", status: "Draft", color: "bg-outline-variant" },
    { id: 3, name: "Graduation Gala Night", date: "Sep 18, 2024", status: "Completed", color: "bg-primary-container" },
    { id: 4, name: "Engineering Tech Expo", date: "Oct 30, 2024", status: "Published", color: "bg-secondary" },
  ];

  const deadlines = [
    { id: 1, day: "Today", title: "Submit catering for Symposium", detail: "Vendor: Royal Palate Ltd.", active: true },
    { id: 2, day: "Oct 16", title: "Finalize AV for Lecture", detail: "Venue: Grand Hall A", active: false },
    { id: 3, day: "Oct 18", title: "Guest Speaker RSVP Follow-up", detail: "Dept of Maritime Studies", active: false },
  ];

  const chartData = [
    { day: "Mon", value: "h-[40%]", hoverVal: 120 },
    { day: "Tue", value: "h-[55%]", hoverVal: 145 },
    { day: "Wed", value: "h-[85%]", hoverVal: 210 },
    { day: "Thu", value: "h-[95%]", hoverVal: 245, highlight: true },
    { day: "Fri", value: "h-[70%]", hoverVal: 180 },
    { day: "Sat", value: "h-[60%]", hoverVal: 160 },
    { day: "Sun", value: "h-[45%]", hoverVal: 130 },
  ];

  return (
    <div className="min-h-screen p-8 bg-surface">
      {/* Header */}
      <header className="flex justify-between items-end mb-12">
        <div>
          <span className="font-headline text-label-md uppercase tracking-widest text-secondary font-bold mb-2 block">
            Curator Dashboard
          </span>
          <h2 className="text-display-lg text-4xl font-extrabold tracking-tighter text-primary">
            Welcome back, Prof. Alabi
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <button className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error border-2 border-surface rounded-full"></span>
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/30">
            <img 
              alt="Prof. Alabi" 
              className="w-12 h-12 rounded-full object-cover grayscale" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBj3s-s0bHhqMWieuWtZqII7cb01cx-b7WeNP1f2cbHexg_mZbWtLFYbLzq0iI4U3vuyTlqQo7GzQbe4WqOj_03y55S0TKqbNlzMh47-jCnn45LlzraTLu3zEq4R0LrXJ72N4hpTz5E6yLo6vOKl9F8SOQcKLU06WRAcfBSZok7pKRG438XHYT3qEbY4VDXuIFb8IEMuhk7WosravJUcW-BpqkU-ezCgjlMS4oZFIwWGWsiJTT4x_lb2ntXpYzdkIJC2BtgvjemA5I"
            />
          </div>
        </div>
      </header>

      {/* Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0px_20px_40px_rgba(0,30,64,0.06)] group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-surface-container-low rounded-lg text-primary-container">
              <CalendarDays className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-on-surface-variant">+12%</span>
          </div>
          <h3 className="font-headline text-xs uppercase tracking-widest text-on-surface-variant mb-1">Active Events</h3>
          <p className="text-3xl font-black text-primary tracking-tighter">24</p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0px_20px_40px_rgba(0,30,64,0.06)] group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-surface-container-low rounded-lg text-primary-container">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-on-surface-variant">840/1k</span>
          </div>
          <h3 className="font-headline text-xs uppercase tracking-widest text-on-surface-variant mb-1">Upcoming Registrations</h3>
          <p className="text-3xl font-black text-primary tracking-tighter">1,204</p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0px_20px_40px_rgba(0,30,64,0.06)] group hover:-translate-y-1 transition-transform border-b-4 border-secondary/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-on-secondary-fixed-variant">On Track</span>
          </div>
          <h3 className="font-headline text-xs uppercase tracking-widest text-on-surface-variant mb-1">Budget Utilization</h3>
          <p className="text-3xl font-black text-primary tracking-tighter">₦4.2M</p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0px_20px_40px_rgba(0,30,64,0.06)] group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-surface-container-low rounded-lg text-primary-container">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-on-surface-variant">89% Avg</span>
          </div>
          <h3 className="font-headline text-xs uppercase tracking-widest text-on-surface-variant mb-1">Attendance Rate</h3>
          <p className="text-3xl font-black text-primary tracking-tighter">92.4%</p>
        </div>
      </section>

      {/* Bento Grid Main Content */}
      <div className="grid grid-cols-12 gap-8">
        {/* Event Management Table */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-xl p-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-display text-xl font-bold tracking-tight text-primary">My Recent Events</h3>
            <button className="text-primary font-bold text-sm hover:underline">View All Archive</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th className="pb-4 font-headline text-xs uppercase tracking-widest text-on-surface-variant">Event Name</th>
                  <th className="pb-4 font-headline text-xs uppercase tracking-widest text-on-surface-variant">Date</th>
                  <th className="pb-4 font-headline text-xs uppercase tracking-widest text-on-surface-variant">Status</th>
                  <th className="pb-4 font-headline text-xs uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {recentEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-surface-container-lowest transition-colors group">
                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${event.color}`}></div>
                        <span className="font-bold text-primary">{event.name}</span>
                      </div>
                    </td>
                    <td className="py-5 text-on-surface-variant">{event.date}</td>
                    <td className="py-5">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-tighter
                        ${event.status === 'Published' ? 'bg-green-100 text-green-800' : 
                          event.status === 'Draft' ? 'bg-surface-variant text-on-surface-variant' : 
                          'bg-primary/10 text-primary'}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-surface-container-high rounded-lg text-primary">
                          <FileEdit className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-surface-container-high rounded-lg text-primary">
                          <BarChart3 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Deadlines Calendar Sidebar */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Logistics Calendar */}
          <div className="bg-primary text-on-primary rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-lg font-bold">This Week's Deadlines</h3>
              <Pin className="w-5 h-5 text-secondary fill-secondary" />
            </div>
            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
              {deadlines.map((item) => (
                <div key={item.id} className="relative pl-8 group">
                  <div className={`absolute left-0 top-1.5 w-[24px] h-[24px] rounded-full border-4 border-primary z-10 transition-colors
                    ${item.active ? 'bg-secondary' : 'bg-white/20 group-hover:bg-secondary'}`}></div>
                  <p className={`text-xs uppercase tracking-widest font-black mb-1 
                    ${item.active ? 'text-secondary' : 'text-on-primary/40'}`}>
                    {item.day}
                  </p>
                  <h4 className="font-bold text-sm leading-tight">{item.title}</h4>
                  <p className="text-xs text-on-primary/60 mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Trends Widget */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-lg font-bold text-primary">Registration Trends</h3>
              <select className="bg-surface-container-low border-none text-xs font-bold rounded-lg px-2 py-1 focus:ring-secondary text-primary outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-48 flex items-end justify-between gap-2 px-2">
              {chartData.map((bar, index) => (
                <div 
                  key={index} 
                  className={`w-full rounded-t-lg transition-all group relative cursor-pointer
                    ${bar.highlight ? 'bg-secondary hover:brightness-110' : 'bg-surface-container-high hover:bg-primary-container'}`}
                  style={{ height: bar.value.match(/\d+/)?.[0] + '%' }}
                >
                  <span className={`absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold transition-opacity
                    ${bar.highlight ? 'text-secondary opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    {bar.hoverVal}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-headline text-on-surface-variant uppercase font-bold tracking-widest px-2">
              {chartData.map((bar, index) => (
                <span key={index} className={bar.highlight ? 'text-secondary' : ''}>{bar.day}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Venue Spotlight Asymmetric Section */}
      <section className="mt-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="font-display text-2xl font-black text-primary tracking-tighter">Campus Venues</h3>
            <p className="text-on-surface-variant font-medium">Quick reservation for your next academic session</p>
          </div>
          <button className="bg-primary text-white px-6 py-3 rounded-lg text-sm font-bold flex items-center gap-2 active:scale-95 transition-all hover:brightness-110">
            Browse All Locations
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Hero Card */}
          <div className="col-span-12 md:col-span-7 relative rounded-2xl overflow-hidden group cursor-pointer h-80">
            <img 
              alt="The Great Admiral Hall" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe1RIJDK_venMyycZuErjZHLK31dyRDw6S_8pUP0BHrmaxBxFB6o5Ymx1aC2LqnBkTADo_YXwKRqtsjDJisG0G60adGcDDDG3YVhEL9S7sOPzLu2CoHYFfzmQd9e0e7Y4kE38-QTtOkk7VOK5nhGslNf9H72y-qFtrcZAn4yO_OkoAJ8fC0A9aFAVzW4SldU8io9vEPm6mzHBrmYNASKwSeu6X8dQ0ku0IPreaNWZvBZLHR0lFszPJbVRx6GfPgz37-3xGgzLyFE0"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-primary/90 to-transparent">
              <div className="flex justify-between items-end">
                <div>
                  <span className="px-3 py-1 bg-secondary text-white text-[10px] font-black uppercase rounded-full mb-3 inline-block">
                    Premium Venue
                  </span>
                  <h4 className="text-white text-2xl font-bold">The Great Admiral Hall</h4>
                  <p className="text-white/70 text-sm">Capacity: 500 Guests • AV Ready • Catering Support</p>
                </div>
                <span className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-secondary transition-colors">
                  <Plus className="w-6 h-6" />
                </span>
              </div>
            </div>
          </div>

          {/* List Sidebar Cards */}
          <div className="col-span-12 md:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container-low p-6 rounded-2xl border-l-4 border-secondary flex items-center gap-6 group hover:bg-surface-container-highest transition-colors cursor-pointer">
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                <img 
                  alt="Executive Suite" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKRYnxjst9Z5FnLs7MIHQ8zXnPAj8DXRiDuSHHtkYhKHKdbppnrEnFW77_1Dd8vnZTsMrAxlbaqdtDqjZ6Np9WCMshs2aJl6Zvi_g8bT9Kstq6dvlF4Q99n9hwbcqQLPPGQqwjlze_SaWoBrEm3KMLkCBLwPuW13XmmUZ_eIDWMSAZUtIGrOCDJAi2jLOMivj7kBLtwZtK87EX0UQV7tnLZCMV2YOl1OGh1LQJNgl6BqhT_CSSQKRjxylneHauArzWWkj_Wf-yuXo"
                />
              </div>
              <div>
                <h4 className="font-bold text-primary">Maritime Executive Suite</h4>
                <p className="text-sm text-on-surface-variant mb-2">Capacity: 24 Guests • Boardroom Style</p>
                <span className="text-xs font-bold text-secondary uppercase tracking-widest">Available Today</span>
              </div>
            </div>

            <div className="bg-surface-container-low p-6 rounded-2xl border-l-4 border-primary-container flex items-center gap-6 group hover:bg-surface-container-highest transition-colors cursor-pointer">
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                <img 
                  alt="Library Annex" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkvZ0VLoQet55fE_4--os_KyxDqTito7Fxk39Ez7hQ68OVUsV2A9vVOXirSzPELgVMd5RW0pCCbwPV3g84ncV717qvFEgujGVX-aCSACTc2tba3VTjbU1z-LFpKPeEjwxTUN7RYshuyutdMEqnUsOVdFnZ7_LAyZDeIS55q8MjoijbwhGgSsRgSeZ1DX7fN-lPEhIBdUXKB4vFNIxOobpC9X8dtjAEt9kepAgo1oSHOs4zS5TqRl6g6I8ghnNaypB7DON-wV0SgrU"
                />
              </div>
              <div>
                <h4 className="font-bold text-primary">Library Research Annex</h4>
                <p className="text-sm text-on-surface-variant mb-2">Capacity: 100 Guests • Multi-purpose</p>
                <span className="text-xs font-bold text-primary-container uppercase tracking-widest">Booked until 2 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}