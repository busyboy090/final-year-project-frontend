import { Routes, Route } from 'react-router-dom';

// Middlewares
import CheckUserRole from '@/middlewares/CheckUserRole';

// Pages
import Dashboard from '@/pages/Dashboard/admin/Dashboard';
import Venues from '@/pages/Dashboard/admin/Venues';
import Events from '@/pages/Dashboard/admin/Events';
import Reports from '@/pages/Dashboard/admin/Reports';
import ProfileSettings from '@/pages/Dashboard/ProfileSettings';
import Attendance from '@/pages/Dashboard/admin/Attendance';
import AddVenuePage from '@/pages/Dashboard/admin/AddVenuePage';
import EditVenuePage from '@/pages/Dashboard/admin/EditVenuePage';
import VenueDetailsPage from '@/pages/Dashboard/VenueDetailsPage';


// Layouts
import DashboardLayout from '@/layouts/DashboardLayout';

// Components
import PageNotFound from '@/components/PageNotFound';
import UserManagement from '@/pages/Dashboard/admin/UserManagementPage';

function AdminDashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CheckUserRole role="admin" />} >
        <Route element={<DashboardLayout />} >
          {/* Dashboard page  */}
          <Route index element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/venues/add" element={<AddVenuePage />} />
          <Route path="/venues/edit/:id" element={<EditVenuePage />} />
          <Route path="/venues/:id" element={<VenueDetailsPage />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<ProfileSettings />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/users" element={<CheckUserRole role="superAdmin" />}>
            <Route index element={<UserManagement />} />
          </Route>
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default AdminDashboardRoutes