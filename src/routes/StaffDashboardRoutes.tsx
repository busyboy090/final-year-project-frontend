import { Routes, Route } from 'react-router-dom';

// Middlewares
import CheckUserRole from '@/middlewares/CheckUserRole';

// Pages
import Dashboard from '@/pages/Dashboard/user/Dashboard';
import Events from '@/pages/Dashboard/user/Events';
import Profile from '@/pages/Dashboard/user/StaffProfileSettings';
import Settings from '@/pages/Dashboard/staff/Settings';

// Components
import PageNotFound from '@/components/PageNotFound';

function StaffDashboardRoutes() {
  return (
    <Routes>
      <Route element={<CheckUserRole role={["staff"]} />} >
          <Route index element={<Dashboard />} />
          <Route path='profile' element={<Profile />} />
          <Route path='events' element={<Events />} />
          <Route path='my-events' element={<Events />} />
          <Route path='calendar' element={<Events />} />
          <Route path='analytics' element={<Dashboard />} />
          <Route path='settings' element={<Settings />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default StaffDashboardRoutes
