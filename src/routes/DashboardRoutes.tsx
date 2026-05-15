import { Routes, Route } from 'react-router-dom';

// Middlewares
import Protected from '@/middlewares/Protected';

// Components
import PageNotFound from '@/components/PageNotFound';

// Routes
import AdminDashboardRoutes from './AdminDashboardRoutes';
import StudentDashboardRoutes from './StudentDashboardRoutes';
import EventOrganiserDashboardRoutes from './EventOrganiserDashboardRoutes';
import StaffDashboardRoutes from './StaffDashboardRoutes';

// Provider
import DashboardProvider from '@/contexts/DashboardProvider';
import UserLayout from '@/layouts/UserLayout';

function DashboardRoutes() {
  return (
    <Routes>
      <Route element={<Protected />} >
        <Route element={<UserLayout />}>
          <Route element={<DashboardProvider />}>
            {/* Admin Dashboard Routes */}
            <Route path="/admin/*" element={<AdminDashboardRoutes />} />

            {/* Admin Dashboard Routes */}
            <Route path="/staff/*" element={<StaffDashboardRoutes />} />

            {/* Student Dashboard Routes */}
            <Route path="/student/*" element={<StudentDashboardRoutes />} />

            {/* Event Organiser Dashboard Routes */}
            <Route path="/event-organiser/*" element={<EventOrganiserDashboardRoutes />} />
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  )
}

export default DashboardRoutes