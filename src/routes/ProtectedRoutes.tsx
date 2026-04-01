import { Route, Routes } from 'react-router-dom';

// Middlewares
import Protected from '@/middlewares/Protected';



function ProtectedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Protected />} >
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Route>
    </Routes>
  )
}

export default ProtectedRoutes