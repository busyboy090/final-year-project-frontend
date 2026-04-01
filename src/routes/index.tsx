import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Guest Routes
import GuestRoutes from './GuestRoutes';

// Pages
import HomePage from '@/pages/home/HomePage';

function index() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Guest Routes */}
        <Route path="/auth/*" element={<GuestRoutes />} />
      </Routes>
    </Router>
  )
}

export default index