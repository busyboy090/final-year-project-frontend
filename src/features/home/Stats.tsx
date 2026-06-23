import { Calendar, Landmark, UserCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/apis/axios';
import { useEventStats } from '@/hooks/useEvent';
import useAuth from '@/hooks/useAuth';

const Stats = () => {
  const { isAuthenticated } = useAuth();
  const { data: eventStats, isLoading: isEventStatsLoading } = useEventStats();
  const { data: departmentCount, isLoading: isDepartmentCountLoading } = useQuery({
    queryKey: ['home-department-count'],
    queryFn: async () => {
      const response = await apiClient.get('/v1/departments', {
        params: { page: 1, limit: 1 },
      });
      return response.data?.pagination?.totalItems ?? response.data?.meta?.total ?? response.data?.data?.length ?? 0;
    },
    enabled: Boolean(isAuthenticated),
  });

  const displayMetric = (value?: number, isLoading = false) => {
    if (!isAuthenticated) return 'Live';
    if (isLoading) return '...';
    return String(value ?? 0);
  };

  return (
    <section className="py-24 px-8 bg-surface">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-50 p-10 rounded-xl flex flex-col justify-between group hover:bg-surface-container-high transition-colors">
              <Calendar className="text-5xl text-primary mb-6" />
            <div>
              <h3 className="text-6xl font-black text-primary tracking-tighter mb-2">
                {displayMetric(eventStats?.total_events, isEventStatsLoading)}
              </h3>
              <p className="text-on-surface-variant font-bold uppercase tracking-widest text-sm">Events Managed</p>
            </div>
          </div>
          <div className="bg-primary text-white p-10 rounded-xl flex flex-col justify-between transform -translate-y-8 shadow-2xl">
              <Landmark className="text-5xl text-secondary-container mb-6" />
              <div>
              <h3 className="text-6xl font-black text-secondary-container tracking-tighter mb-2">
                {displayMetric(departmentCount, isDepartmentCountLoading)}
              </h3>
              <p className="text-blue-200 font-bold uppercase tracking-widest text-sm">Departments Covered</p>
            </div>
          </div>
          <div className="bg-slate-50 p-10 rounded-xl flex flex-col justify-between group hover:bg-surface-container-high transition-colors">
            <UserCheck className="text-5xl text-primary mb-6" />
            <div>
              <h3 className="text-6xl font-black text-primary tracking-tighter mb-2">
                {displayMetric(eventStats?.total_registrations, isEventStatsLoading)}
              </h3>
              <p className="text-on-surface-variant font-bold uppercase tracking-widest text-sm">Attendance Tracked</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
