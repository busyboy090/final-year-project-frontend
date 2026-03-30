import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Guest Routes
import GuestRoutes from './GuestRoutes';

function index() {
  return (
    <Router>
      <Routes>

        {/* Guest Routes */}
        <Route path="/auth/*" element={<GuestRoutes />} />
      </Routes>
    </Router>
  )
}

export default index