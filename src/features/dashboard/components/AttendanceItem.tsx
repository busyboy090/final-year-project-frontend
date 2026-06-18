const statusStyles: Record<string, string> = {
    attended: "bg-green-500",
    confirmed: "bg-blue-500",
    cancelled: "bg-slate-400",
    late: "bg-orange-400",
    verified: "bg-green-500",
};

const statusLabels: Record<string, string> = {
    attended: "Verified via QR",
    confirmed: "Registered",
    cancelled: "Cancelled",
    late: "Late check-in",
    verified: "Verified via QR",
};

const AttendanceItem = ({ title, date, status }: any) => (
    <div className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
        <div className={`w-2 h-2 rounded-full ${statusStyles[status] ?? "bg-slate-400"}`}></div>
        <div className="grow">
            <p className="text-sm font-bold text-[#001e40]">{title}</p>
            <p className="text-[10px] text-slate-500">{statusLabels[status] ?? status} - {date}</p>
        </div>
    </div>
);

export default AttendanceItem;
