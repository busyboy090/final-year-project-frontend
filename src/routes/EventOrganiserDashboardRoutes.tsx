import { Routes, Route } from 'react-router-dom';

// Middlewares
import CheckUserRole from '@/middlewares/CheckUserRole';

// Pages
import Dashboard from '@/pages/Dashboard/event-organiser/Dashboard';
import Profile from '@/pages/Dashboard/event-organiser/Profile';
import EventCreationPage from '@/pages/Dashboard/event-organiser/EventCreationPage';
import Events from '@/pages/Dashboard/admin/Events';
import Reports from '@/pages/Dashboard/admin/Reports';

// Components
import PageNotFound from '@/components/PageNotFound';

function EventOrganiserDashboardRoutes() {
  return (
    <Routes>
      <Route element={<CheckUserRole role={["event-organiser"]} />} >
        <Route index element={<Dashboard />} />
        <Route path='profile' element={<Profile />} />
        <Route path='my-events' element={<Events />} />
        <Route path='events' element={<Events />} />
        <Route path='events/create' element={<EventCreationPage />} />
        <Route path='calendar' element={<Events />} />
        <Route path='analytics' element={<Reports />} />
        <Route path='settings' element={<Profile />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default EventOrganiserDashboardRoutes
