import { Routes, Route } from 'react-router-dom';

// Middlewares
import CheckUserRole from '@/middlewares/CheckUserRole';

// Pages
import Dashboard from '@/pages/Dashboard/admin/Dashboard';
import Venues from '@/pages/Dashboard/admin/Venues';
import Events from '@/pages/Dashboard/admin/Events';
import Reports from '@/pages/Dashboard/admin/Reports';
import Profile from '@/pages/Dashboard/admin/Profile';
import Attendance from '@/pages/Dashboard/admin/Attendance';
import AddVenuePage from '@/pages/Dashboard/admin/AddVenuePage';
import EditVenuePage from '@/pages/Dashboard/admin/EditVenuePage';
import VenueDetailsPage from '@/pages/Dashboard/VenueDetailsPage';
import Settings from '@/pages/Dashboard/admin/Settings';
import Faculties from '@/pages/Dashboard/admin/Faculties';
import Departments from '@/pages/Dashboard/admin/Departments';
import Facilities from '@/pages/Dashboard/admin/Facilities';


// Components
import PageNotFound from '@/components/PageNotFound';
import UserManagement from '@/pages/Dashboard/admin/UserManagementPage';

function AdminDashboardRoutes() {
  return (
    <Routes>
      <Route element={<CheckUserRole role={["admin"]} />} >
        {/* Dashboard page  */}
        <Route index element={<Dashboard />} />
        <Route path="events" element={<Events />} />
        <Route path="venues" element={<Venues />} />
        <Route path="venues/add" element={<AddVenuePage />} />
        <Route path="venues/edit/:id" element={<EditVenuePage />} />
        <Route path="venues/:id" element={<VenueDetailsPage />} />
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<Profile />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="faculties" element={<Faculties />} />
        <Route path="departments" element={<Departments />} />
        <Route path="facilities" element={<Facilities />} />
        <Route path="settings" element={<Settings />} />
        <Route path='users' element={<UserManagement />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default AdminDashboardRoutes
