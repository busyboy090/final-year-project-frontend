import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Guest Routes
import GuestRoutes from './GuestRoutes';

// Pages
import HomePage from '@/pages/home/HomePage';

// Components
import ScrollTop from '@/components/ScrollTop';

function index() {


  return (
    <Router>
      <ScrollTop />
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Guest Routes */}
        <Route path="/auth/*" element={<GuestRoutes />} />
      </Routes>
    </Router>
  )
}

export default index