import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-[850px] flex items-center overflow-hidden bg-gradient-to-br from-[#001e40] to-[#003366]">
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070')" }}
      />
      <div className="container mx-auto px-8 relative z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2">
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tighter">
            Admiralty University <br/>
            <span className="text-[#fec657]">Event Management System</span>
          </h1>
          <p className="text-xl text-blue-100/80 mb-10 max-w-lg leading-relaxed">
            Plan, schedule, and track university events — all in one place. Experience professional coordination designed for academic excellence.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-[#fec657] text-[#735200] px-8 py-4 rounded-lg font-bold text-lg hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-black/20">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-md">
              Sign In
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 relative">
          <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700 bg-white p-2">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071" 
              alt="Students collaborating" 
              className="rounded-lg w-full"
            />
          </div>
          <div className="absolute -bottom-10 -left-10 z-20 backdrop-blur-xl bg-white/10 p-6 rounded-xl border border-white/10 shadow-2xl hidden lg:block">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#fec657] rounded-full flex items-center justify-center">
                {/* <EventAvailable className="text-[#735200] w-6 h-6" /> */}
              </div>
              <div>
                <p className="text-white text-xs uppercase tracking-widest font-bold">Upcoming Event</p>
                <p className="text-white font-medium">Founder's Day Gala 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;