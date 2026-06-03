import { Routes, Route } from 'react-router-dom';

// Middlewares
import CheckUserRole from '@/middlewares/CheckUserRole';

// Pages
import Dashboard from '@/pages/Dashboard/user/Dashboard';
import Events from '@/pages/Dashboard/user/Events';
import Profile from '@/pages/Dashboard/user/StaffProfileSettings';

// Components
import PageNotFound from '@/components/PageNotFound';

function StaffDashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CheckUserRole role={["staff"]} />} >
          <Route index element={<Dashboard />} />
          <Route path='profile' element={<Profile />} />
          <Route path='events' element={<Events />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default StaffDashboardRoutes