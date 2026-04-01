import React from 'react';
import { Calendar, Landmark, UserCheck } from 'lucide-react';

const Stats = () => {
  const stats = [
    { icon: <Calendar />, value: "500+", label: "Events Managed", color: "bg-slate-100 text-[#001e40]" },
    { icon: <Landmark />, value: "24", label: "Departments Covered", color: "bg-[#001e40] text-white translate-y-[-32px]" },
    { icon: <UserCheck />, value: "12k", label: "Attendance Tracked", color: "bg-slate-100 text-[#001e40]" },
  ];

  return (
    <section className="py-24 px-8 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className={`${stat.color} p-10 rounded-xl flex flex-col justify-between shadow-xl transition-colors`}>
              <div className="text-5xl mb-6">{React.cloneElement(stat.icon as React.ReactElement, { size: 48 })}</div>
              <div>
                <h3 className="text-6xl font-black tracking-tighter mb-2">{stat.value}</h3>
                <p className="opacity-70 font-bold uppercase tracking-widest text-sm">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;