import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Routes
import GuestRoutes from "./GuestRoutes";
import PublicRoutes from "./PublicRoutes";
import DashboardRoutes from "./DashboardRoutes";

// Components
import AppLayout from "@/layouts/AppLayout";

function index() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/*" element={<PublicRoutes />} />

          {/* Guest Routes */}
          <Route path="/auth/*" element={<GuestRoutes />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard/*" element={<DashboardRoutes />} />
        </Routes>
      </AppLayout>
    </Router>
  )
}

export default index