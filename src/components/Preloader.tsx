import { useState, useEffect, useRef } from "react";
import { ShieldCheck, Database } from "lucide-react";
import gsap from "gsap";
import ADUNLOGO from "@/assets/logo.png";

function Preloader() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing...");
  
  // Refs for GSAP targeting
  const progressRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Entrance Animation
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power3.out"
      });

      gsap.from(logoRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        delay: 0.2,
        ease: "back.out(1.7)"
      });

      // 2. Progress Animation
      const tl = gsap.timeline({
        onUpdate: function () {
          // Sync React state with GSAP progress for the percentage text
          setProgress(Math.round(this.progress() * 100));
        }
      });

      tl.to(progressRef.current, {
        width: "100%",
        duration: 4, // Total loading time
        ease: "power2.inOut",
      });

      // 3. Dynamic Text Changes tied to timeline
      tl.call(() => setLoadingText("Securing academic protocols..."), [], 1.2);
      tl.call(() => setLoadingText("Establishing identity link..."), [], 2.8);
      tl.call(() => setLoadingText("Welcome Back."), [], 3.8);

    }, containerRef);

    return () => ctx.revert(); // Cleanup GSAP on unmount
  }, []);

  return (
    <main 
      ref={containerRef}
      className="relative w-screen flex flex-col items-center justify-center h-dvh box-border overflow-hidden bg-[#f6faff] font-body text-[#141d23]"
    >
      {/* Watermark Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
        <img 
          src={ADUNLOGO} 
          className="w-[60vw] max-w-[800px] grayscale" 
          alt="University Watermark" 
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-8">
        
        {/* Main Crest */}
        <div ref={logoRef} className="relative mb-12 flex flex-col items-center">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center bg-white p-6 shadow-xl shadow-[#001e40]/5">
            <img 
              src={ADUNLOGO} 
              className="w-full h-full object-contain" 
              alt="Admiralty University Crest" 
            />
          </div>
          
          {/* Decorative Rings */}
          <div className="absolute inset-0 border-2 border-[#7b5800]/20 rounded-full scale-110" />
          <div className="absolute inset-0 border-t-2 border-[#7b5800] rounded-full scale-110 animate-spin transition-all" 
               style={{ animationDuration: '3s' }} 
          />
        </div>

        {/* Typography Cluster */}
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-xs md:text-sm font-bold tracking-[0.3em] text-[#7b5800] uppercase">
            Secure Academic Systems
          </h1>
          <h2 className="text-2xl md:text-3xl font-black text-[#001e40] tracking-tight">
            Admiralty University of Nigeria
          </h2>
          <div className="flex items-center justify-center gap-2 pt-2">
            <ShieldCheck className="text-[#001e40]/40 w-4 h-4" />
            <span className="text-[10px] text-slate-500 tracking-widest uppercase opacity-60 font-bold">
              Identity Verified & Encryption Active
            </span>
          </div>
        </div>

        {/* Progress Indicator Section */}
        <div className="w-full max-w-xs space-y-4">
          {/* Linear Progress Bar */}
          <div className="h-[2px] w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              ref={progressRef}
              className="h-full bg-[#7b5800] relative overflow-hidden"
              style={{ width: `0%` }} // GSAP controls this
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Loading Metadata */}
          <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 px-1">
            <span className="flex items-center gap-1.5 uppercase tracking-tighter">
              <Database className="w-3.5 h-3.5 text-[#7b5800]" />
              {loadingText}
            </span>
            <span className="text-[#001e40] tabular-nums">{progress}%</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite ease-in-out;
        }
      `}</style>
    </main>
  );
}

export default Preloader;