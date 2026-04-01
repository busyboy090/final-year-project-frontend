import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Guest Routes
import GuestRoutes from './GuestRoutes';

// Pages
import HomePage from '@/pages/HomePage';

// Components
import PageNotFound from '@/components/PageNotFound';
import AppLayout from '@/layouts/AppLayout';

function index() {


  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Guest Routes */}
          <Route path="/auth/*" element={<GuestRoutes />} />

          {/* 404 Route */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </AppLayout>
    </Router>
  )
}

export default index