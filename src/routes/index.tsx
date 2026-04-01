import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Guest Routes
import GuestRoutes from './GuestRoutes';

// Pages
import HomePage from '@/pages/home/HomePage';

// Components
import ScrollTop from '@/components/ScrollTop';
import PageNotFound from '@/components/PageNotFound';

function index() {


  return (
    <Router>
      <ScrollTop />
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Guest Routes */}
        <Route path="/auth/*" element={<GuestRoutes />} />

        {/* 404 Route */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  )
}

export default index