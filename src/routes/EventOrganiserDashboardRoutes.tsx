import { Routes, Route } from 'react-router-dom';

// Middlewares
import CheckUserRole from '@/middlewares/CheckUserRole';

// Pages
import EventOrganiserDashboard from '@/pages/Dashboard/event-organiser/Dashboard';

// Layouts
import EventOrganiserDashboardLayout from '@/layouts/EventOrganiserDashboardLayout';

// Components
import PageNotFound from '@/components/PageNotFound';

function EventOrganiserDashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CheckUserRole role="event-organiser" />} >
        <Route element={<EventOrganiserDashboardLayout />} >
          <Route index element={<EventOrganiserDashboard />} />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default EventOrganiserDashboardRoutes