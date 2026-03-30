import React from 'react'
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

function GuestRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
    </Routes>
  )
}

export default GuestRoutes