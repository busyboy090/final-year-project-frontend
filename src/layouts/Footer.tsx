import { Shield, Share2, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#002244] w-full py-12 px-8 border-t border-white/10 text-xs uppercase tracking-widest text-white/80">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          <div className="text-white font-bold flex items-center gap-2 text-base">
            <Shield className="text-amber-500 w-5 h-5" />
            ADUN-EMS
          </div>
          <p className="lowercase tracking-normal text-white/60">© { new Date().getFullYear() } Admiralty University of Nigeria. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <a className="hover:text-amber-400 hover:underline" href="#">Privacy Policy</a>
          <a className="hover:text-amber-400 hover:underline" href="#">Terms of Service</a>
          <a className="hover:text-amber-400 hover:underline lowercase tracking-normal" href="mailto:events@adun.edu.ng">events@adun.edu.ng</a>
        </div>
        <div className="flex gap-4">
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#7b5800] transition-colors">
            <Share2 size={14} />
          </button>
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#7b5800] transition-colors">
            <Globe size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;