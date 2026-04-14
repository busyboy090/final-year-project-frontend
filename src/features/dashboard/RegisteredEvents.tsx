import { Plus } from "lucide-react";
import RegisteredEventCard from "./components/RegisteredEventCard";

function RegisteredEvents() {
  const events = [
    {
      id: 1,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDB1ixBDN1eoMk6dzb834oJuIXW4eSouKwjn65LwiQz_O5qH_1q2PQGxHoledw05EdFgiwe0PD-GiHYZzZ2q1J2HE76P5crw--S_BxWdyxtqCMh0rwGWDfh7-jjblj6hzq12_aFW8ipBRrIUx-ym5ywztgiUremQ8GJvOS6kEfoGSWMAgdvPVzDy3Jal6nuvRIkhbm7gpv3yh5gJ3SzG3_I_jDnryAMw1vvh7Uq_y5RBRRh-qpSHJ19qFb88USat5kVP9PQrfyYgY",
      date: "Oct 15",
      title: "Tech Innovation Expo",
      description: "Showcase of the latest engineering breakthroughs from graduating seniors and industry partners.",
    },
    {
      id: 2,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrfJx_aOZTo3_2YY6wfCBdLJexMKvLiLO5MoaO_TMtfju_Muj0WkTvrxKvnLqyWz9Eg5EDPKV5Y1yB-vzFn10Q-ube3VuyPLWoGzvV472xTyRazfJvdMRbPQOJ5LHIpxnErKZytKe47nbnS2u6GkD1EbaCcWLnGhGxWvm39TGrfvz1KuK2ovIqdl_SdyLqWlgxzyK_-JEgi-fUORXDwOzCD8VR60c6LsJ2Yg02A8t27E9zS4Ar5PICqYbL1z83cwsDEb6C7lQzvTc",
      date: "Oct 18",
      title: "Graduate Writing Intensive",
      description: "Master the art of thesis publication, literature review, and academic journal submissions.",
    },
  ];

  return (
    <section className="py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-[#001e40] tracking-tight">
            Registered Events
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Managed list of your confirmed registrations.
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <RegisteredEventCard 
            key={event.id}
            image={event.image}
            date={event.date}
            title={event.title}
            description={event.description}
          />
        ))}

        {/* Add More Events Placeholder */}
        <button className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center group hover:border-[#7b5800] hover:bg-slate-50 transition-all cursor-pointer min-h-[320px]">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-[#7b5800]/10 transition-colors">
            <Plus className="text-slate-400 group-hover:text-[#7b5800]" size={32} />
          </div>
          <h4 className="font-bold text-[#001e40] mb-1">Add More Events</h4>
          <p className="text-xs text-slate-500 max-w-[180px]">
            Explore thousands of university activities and sessions.
          </p>
        </button>
      </div>
    </section>
  );
}

export default RegisteredEvents;