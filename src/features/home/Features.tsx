import React from 'react';
import { Clock, AlertTriangle, QrCode, Bell, BarChart3, Lock } from 'lucide-react';

const features = [
  { icon: <Clock />, title: "Intelligent Scheduling", desc: "Dynamic calendar system with multi-view capabilities." },
  { icon: <AlertTriangle />, title: "Conflict Detection", desc: "Automated venue and resource conflict alerts." },
  { icon: <QrCode />, title: "QR Attendance", desc: "Instant check-ins using secure QR scanning." },
  { icon: <Bell />, title: "Smart Notifications", desc: "Automated reminders via email and in-app alerts." },
  { icon: <BarChart3 />, title: "Advanced Reports", desc: "Deep-dive analytics on attendance and resource utilization." },
  { icon: <Lock />, title: "Secure Login", desc: "Role-based access control integrated with university SSO." },
];

const Features = () => {
  return (
    <section className="py-24 px-8 bg-slate-50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-[#001e40] tracking-tight mb-4">Precision Tools for Modern Campus Logistics</h2>
            <div className="h-1 w-24 bg-[#7b5800]"></div>
          </div>
          <p className="text-slate-600 max-w-xs text-sm font-medium leading-relaxed">
            Moving beyond spreadsheets to a centralized, automated event ecosystem built for Admiralty University's standard.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-10 hover:bg-slate-50 transition-all duration-300">
              <div className="w-14 h-14 bg-amber-50 rounded-lg flex items-center justify-center mb-8 text-[#7b5800]">
                {React.cloneElement(f.icon, { size: 32 })}
              </div>
              <h4 className="text-xl font-bold mb-4 text-[#001e40]">{f.title}</h4>
              <p className="text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;