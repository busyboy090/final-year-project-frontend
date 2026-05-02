import { Routes, Route } from 'react-router-dom';

// Middlewares
import CheckUserRole from '@/middlewares/CheckUserRole';

// Pages
import UserDashboard from '@/pages/Dashboard/user/Dashboard';

// Layouts
import DashboardLayout from '@/layouts/DashboardLayout';

// Components
import PageNotFound from '@/components/PageNotFound';

function UserDashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CheckUserRole role="user" />} >
        <Route element={<DashboardLayout />} >
          <Route index element={<UserDashboard />} />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default UserDashboardRoutes