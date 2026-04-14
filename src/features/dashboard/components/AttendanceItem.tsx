const AttendanceItem = ({ title, date, status }: any) => (
    <div className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
        <div className={`w-2 h-2 rounded-full ${status === 'verified' ? 'bg-green-500' : 'bg-orange-400'}`}></div>
        <div className="grow">
            <p className="text-sm font-bold text-[#001e40]">{title}</p>
            <p className="text-[10px] text-slate-500">Verified via QR • {date}</p>
        </div>
    </div>
);

export default AttendanceItem;