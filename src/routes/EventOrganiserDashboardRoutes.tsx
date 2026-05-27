import { Routes, Route } from 'react-router-dom';

// Middlewares
import CheckUserRole from '@/middlewares/CheckUserRole';

// Pages
import Dashboard from '@/pages/Dashboard/event-organiser/Dashboard';
import Profile from '@/pages/Dashboard/event-organiser/Profile';
import EventCreationPage from '@/pages/Dashboard/event-organiser/EventCreationPage';

// Layouts
import DashboardLayout from '@/layouts/DashboardLayout';

// Components
import PageNotFound from '@/components/PageNotFound';

function EventOrganiserDashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CheckUserRole role="event-organiser" />} >
        <Route element={<DashboardLayout />} >
          <Route index element={<Dashboard />} />
          <Route path='profile' element={<Profile />} />
          <Route path='events/create' element={<EventCreationPage />} />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default EventOrganiserDashboardRoutes