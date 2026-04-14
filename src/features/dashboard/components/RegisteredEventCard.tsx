import { Ticket, QrCode } from "lucide-react";


interface EventCardProps {
  image: string;
  date: string;
  title: string;
  description: string;
}

const RegisteredEventCard = ({ image, date, title, description }: EventCardProps) => {
  return (
    <div className="bg-white p-1 rounded-2xl shadow-[0px_10px_20px_rgba(0,30,64,0.03)] border border-slate-200 group transition-all hover:shadow-md">
      {/* Image Container with Overlay */}
      <div className="h-48 rounded-xl overflow-hidden relative mb-4">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={image}
          alt={title}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#001e40]/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-[#7b5800]/90 px-2 py-1 rounded-md backdrop-blur-sm">
            {date}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="px-5 pb-6">
        <h4 className="font-bold text-[#001e40] mb-2 text-lg leading-tight group-hover:text-[#7b5800] transition-colors">
          {title}
        </h4>
        <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Footer Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#001e40]">
            <Ticket size={16} className="text-[#7b5800]" />
            Ticket Confirmed
          </div>
          <button 
            className="p-2 rounded-lg bg-slate-50 text-[#001e40] hover:bg-[#001e40] hover:text-white transition-all shadow-sm active:scale-95"
            title="View QR Code"
          >
            <QrCode size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisteredEventCard;