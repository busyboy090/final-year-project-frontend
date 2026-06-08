import { Routes, Route } from 'react-router-dom';

// Middlewares & Layouts
import Protected from '@/middlewares/Protected';
import CheckUserRole from '@/middlewares/CheckUserRole';
import UserLayout from '@/layouts/UserLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

// Providers
import DashboardProvider from '@/contexts/DashboardProvider';

// Components
import PageNotFound from '@/components/PageNotFound';

// Admin Pages
import AdminDashboardPage from '@/pages/Dashboard/admin/Dashboard';
import AdminVenuesPage from '@/pages/Dashboard/admin/Venues'; // Fixed name match
import Reports from '@/pages/Dashboard/admin/Reports';
import AdminProfile from '@/pages/Dashboard/admin/Profile';
import Attendance from '@/pages/Dashboard/admin/Attendance';
import AddVenuePage from '@/pages/Dashboard/admin/AddVenuePage';
import EditVenuePage from '@/pages/Dashboard/admin/EditVenuePage';
import VenueDetailsPage from '@/pages/Dashboard/VenueDetailsPage';
import Settings from '@/pages/Dashboard/admin/Settings';
import UserManagementPage from '@/pages/Dashboard/admin/UserManagementPage'; 

// Event Organiser Pages
import OrganiserDashboard from '@/pages/Dashboard/event-organiser/Dashboard';
import OrganiserProfile from '@/pages/Dashboard/event-organiser/Profile';
import EventCreationPage from '@/pages/Dashboard/event-organiser/EventCreationPage';
import MyEvents from '@/pages/Dashboard/event-organiser/MyEvents';

// User Pages
import UserDashboard from '@/pages/Dashboard/user/Dashboard';

// Staff Pages
import StaffProfile from '@/pages/Dashboard/user/StaffProfileSettings';

// Dashboard Pages
import EventsPage from '@/pages/Dashboard/Events';

function DashboardRoutes() {
  return (
    <Routes>
      {/* 1. Global Guarded Routes */}
      <Route element={<Protected />}>
        <Route element={<UserLayout />}>
          <Route element={<DashboardProvider><DashboardLayout /></DashboardProvider>}>
            
           {/* Admin Routes */}
            <Route path="admin" element={<CheckUserRole role={["admin"]} />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="venues" element={<AdminVenuesPage />} />
              <Route path="venues/add" element={<AddVenuePage />} />
              <Route path="venues/edit/:id" element={<EditVenuePage />} />
              <Route path="venues/:id" element={<VenueDetailsPage />} />
              <Route path="reports" element={<Reports />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="settings" element={<Settings />} />
              <Route path="users" element={<UserManagementPage />} />
            </Route>

            {/*Event Organiser Routes  */}
            <Route path="event-organiser" element={<CheckUserRole role={["event-organiser"]} />}>
              <Route index element={<OrganiserDashboard />} />
              <Route path="profile" element={<OrganiserProfile />} />
              <Route path="my-events" element={<MyEvents />} />
            </Route>

            {/* Staff Routes */}
            <Route path="staff" element={<CheckUserRole role={["staff"]} />}>
              <Route index element={<UserDashboard />} />
              <Route path="profile" element={<StaffProfile />} />
            </Route>

            {/* Student Routes */}
            <Route path="student" element={<CheckUserRole role={["student"]} />}>
              <Route index element={<UserDashboard />} />
              <Route path="profile" element={<StaffProfile />} />
            </Route>


            {/* Shared Routes - Super Admin and Event Organiser */}
            <Route element={<CheckUserRole role={["admin", "event-organiser"]} />}>
              <Route path="events/create" element={<EventCreationPage />} />
            </Route>

            <Route path="events" element={<EventsPage />} />
          </Route>
        </Route>
      </Route>

      {/* 2. Global Catch-All 404 Route */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default DashboardRoutes;