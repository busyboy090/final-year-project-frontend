import { Routes, Route } from 'react-router-dom';

// Middlewares
import Protected from '@/middlewares/Protected';

// Components
import PageNotFound from '@/components/PageNotFound';

// Routes
import AdminDashboardRoutes from './AdminDashboardRoutes';
import StudentDashboardRoutes from './UserDashboardRoutes';
import EventOrganiserDashboardRoutes from './EventOrganiserDashboardRoutes';
import DashboardProvider from '@/contexts/DashboardProvider';

function DashboardRoutes() {
  return (
    <Routes>
      <Route element={<Protected />} >
        <Route element={<DashboardProvider />}>
          {/* Admin Dashboard Routes */}
          <Route path="/admin/*" element={<AdminDashboardRoutes />} />

          {/* Student Dashboard Routes */}
          <Route path="/student/*" element={<StudentDashboardRoutes />} />

          {/* Event Organiser Dashboard Routes */}
          <Route path="/event-organiser/*" element={<EventOrganiserDashboardRoutes />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  )
}

export default DashboardRoutes