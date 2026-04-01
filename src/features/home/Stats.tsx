// import React from 'react';
import { Calendar, Landmark, UserCheck } from 'lucide-react';

const Stats = () => {
  // const stats = [
  //   { icon: <Calendar />, value: "500+", label: "Events Managed", color: "bg-slate-100 text-[#001e40]" },
  //   { icon: <Landmark />, value: "24", label: "Departments Covered", color: "bg-[#001e40] text-white translate-y-[-32px]" },
  //   { icon: <UserCheck />, value: "12k", label: "Attendance Tracked", color: "bg-slate-100 text-[#001e40]" },
  // ];

  return (
    <section className="py-24 px-8 bg-surface">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-50 p-10 rounded-xl flex flex-col justify-between group hover:bg-surface-container-high transition-colors">
            <Calendar className="text-5xl text-primary mb-6" />
            <div>
              <h3 className="text-6xl font-black text-primary tracking-tighter mb-2">500+</h3>
              <p className="text-on-surface-variant font-bold uppercase tracking-widest text-sm">Events Managed</p>
            </div>
          </div>
          <div className="bg-primary text-white p-10 rounded-xl flex flex-col justify-between transform -translate-y-8 shadow-2xl">
              <Landmark className="text-5xl text-secondary-container mb-6" />
              <div>
              <h3 className="text-6xl font-black text-secondary-container tracking-tighter mb-2">24</h3>
              <p className="text-blue-200 font-bold uppercase tracking-widest text-sm">Departments Covered</p>
            </div>
          </div>
          <div className="bg-slate-50 p-10 rounded-xl flex flex-col justify-between group hover:bg-surface-container-high transition-colors">
            <UserCheck className="text-5xl text-primary mb-6" />
            <div>
              <h3 className="text-6xl font-black text-primary tracking-tighter mb-2">12k</h3>
              <p className="text-on-surface-variant font-bold uppercase tracking-widest text-sm">Attendance Tracked</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;