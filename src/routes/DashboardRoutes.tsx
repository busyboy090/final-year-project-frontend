import { Routes, Route } from "react-router-dom";

// Middlewares
import Protected from "@/middlewares/Protected";
import CheckUserRole from "@/middlewares/CheckUserRole";

// Layouts & Providers
import UserLayout from "@/layouts/UserLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardProvider from "@/contexts/DashboardProvider";

// Shared Pages
import PageNotFound from "@/components/PageNotFound";
import CalendarPage from "@/pages/Dashboard/CalendarPage";

// Admin Pages
import AdminDashboard from "@/pages/Dashboard/admin/Dashboard";
import AdminEvents from "@/pages/Dashboard/admin/Events";
import AdminReports from "@/pages/Dashboard/admin/Reports";
import Faculties from "@/pages/Dashboard/admin/Faculties";
import Departments from "@/pages/Dashboard/admin/Departments";
import UserManagement from "@/pages/Dashboard/admin/UserManagementPage";
import Venues from "@/pages/Dashboard/admin/Venues";
import AddVenuePage from "@/pages/Dashboard/admin/AddVenuePage";
import EditVenuePage from "@/pages/Dashboard/admin/EditVenuePage";
import VenueDetailsPage from "@/pages/Dashboard/VenueDetailsPage";
import Facilities from "@/pages/Dashboard/admin/Facilities";
import Attendance from "@/pages/Dashboard/admin/Attendance";
import Levels from "@/pages/Dashboard/admin/Levels";
import Organisations from "@/pages/Dashboard/admin/Organisations";
import Sessions from "@/pages/Dashboard/admin/Sessions";
import ScanCheckIn from "@/pages/Dashboard/ScanCheckIn";

// Event Organiser Pages
import EventOrganiserDashboard from "@/pages/Dashboard/event-organiser/Dashboard";
import EventOrganiserProfile from "@/pages/Dashboard/event-organiser/Profile";
import EventCreationPage from "@/pages/Dashboard/event-organiser/EventCreationPage";
import EventDetailsPage from "@/pages/Dashboard/event-organiser/EventDetailsPage";
import EventEditPage from "@/pages/Dashboard/event-organiser/EventEditPage";

// Staff Pages
import StaffDashboard from "@/pages/Dashboard/user/Dashboard";
import StaffProfile from "@/pages/Dashboard/user/StaffProfileSettings";

// Student Pages
import StudentDashboard from "@/pages/Dashboard/user/Dashboard";
import StudentProfile from "@/pages/Dashboard/student/Profile";

// Shared User Pages
import UserEvents from "@/pages/Dashboard/user/Events";
import MyEvents from "@/pages/Dashboard/user/MyEvents";

function DashboardRoutes() {
  return (
    <Routes>
      <Route element={<Protected />}>
        <Route element={<UserLayout />}>
          <Route
            element={
              <DashboardProvider>
                <DashboardLayout />
              </DashboardProvider>
            }
          >
            <Route path="/calendar" element={<CalendarPage />} />


            {/* ── Admin ── */}
            <Route element={<CheckUserRole role={["admin"]} />}>
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/events" element={<AdminEvents />} />
              <Route path="admin/events/:id" element={<EventDetailsPage />} />
              <Route path="admin/events/:id/edit" element={<EventEditPage />} />
              <Route path="admin/venues" element={<Venues />} />
              <Route path="admin/venues/add" element={<AddVenuePage />} />
              <Route path="admin/venues/edit/:id" element={<EditVenuePage />} />
              <Route path="admin/venues/:id" element={<VenueDetailsPage />} />
              <Route path="admin/reports" element={<AdminReports />} />
              <Route path="admin/attendance" element={<Attendance />} />
              <Route path="admin/scan" element={<ScanCheckIn />} />
              <Route path="admin/faculties" element={<Faculties />} />
              <Route path="admin/facilities" element={<Facilities />} />
              <Route path="admin/departments" element={<Departments />} />
              <Route path="admin/organisations" element={<Organisations />} />
              <Route path="admin/sessions" element={<Sessions />} />
              <Route path="admin/levels" element={<Levels />} />
              <Route path="admin/users" element={<UserManagement />} />
            </Route>

            {/* ── Event Organiser ── */}
            <Route element={<CheckUserRole role={["event-organiser"]} />}>
              <Route
                path="event-organiser"
                element={<EventOrganiserDashboard />}
              />
              <Route
                path="event-organiser/profile"
                element={<EventOrganiserProfile />}
              />
              <Route
                path="event-organiser/my-events"
                element={<AdminEvents />}
              />
              <Route path="event-organiser/events" element={<AdminEvents />} />
              <Route
                path="event-organiser/events/:id"
                element={<EventDetailsPage />}
              />
              <Route
                path="event-organiser/events/:id/edit"
                element={<EventEditPage />}
              />

              <Route
                path="event-organiser/analytics"
                element={<AdminReports />}
              />
              <Route path="event-organiser/scan" element={<ScanCheckIn />} />
            </Route>

            {/* ── Staff ── */}
            <Route element={<CheckUserRole role={["staff"]} />}>
              <Route path="staff" element={<StaffDashboard />} />
              <Route path="staff/profile" element={<StaffProfile />} />
              <Route path="staff/events" element={<UserEvents />} />
              <Route path="staff/events/:id" element={<EventDetailsPage />} />
              <Route path="staff/my-events" element={<MyEvents />} />
              <Route path="staff/analytics" element={<StaffDashboard />} />
            </Route>

            {/* ── Student ── */}
            <Route element={<CheckUserRole role={["student"]} />}>
              <Route path="student" element={<StudentDashboard />} />
              <Route path="student/profile" element={<StudentProfile />} />
              <Route path="student/events" element={<UserEvents />} />
              <Route path="student/events/:id" element={<EventDetailsPage />} />
              <Route path="student/my-events" element={<MyEvents />} />
              <Route path="student/analytics" element={<StudentDashboard />} />
            </Route>

            {/* ── Student ── */}
            <Route
              element={<CheckUserRole role={["event-organiser", "admin"]} />}
            >
              <Route path="events/create" element={<EventCreationPage />} />
            </Route>
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default DashboardRoutes;