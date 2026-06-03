import { Routes, Route } from 'react-router-dom';

// Middlewares
import CheckUserRole from '@/middlewares/CheckUserRole';

// Pages
import Dashboard from '@/pages/Dashboard/event-organiser/Dashboard';
import Profile from '@/pages/Dashboard/event-organiser/Profile';

// Components
import PageNotFound from '@/components/PageNotFound';

function EventOrganiserDashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CheckUserRole role={["event-organiser"]} />} >
        <Route index element={<Dashboard />} />
        <Route path='profile' element={<Profile />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default EventOrganiserDashboardRoutes