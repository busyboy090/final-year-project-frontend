import { Routes, Route } from 'react-router-dom';

// Middlewares
import CheckUserRole from '@/middlewares/CheckUserRole';

// Pages
import Dashboard from '@/pages/Dashboard/user/Dashboard';
import Profile from '@/pages/Dashboard/student/Profile';
import Events from '@/pages/Dashboard/user/Events';


// Components
import PageNotFound from '@/components/PageNotFound';

function UserDashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CheckUserRole role={["student"]} />} >
        <Route index element={<Dashboard />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/events' element={<Events />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default UserDashboardRoutes