
import { Routes, Route } from 'react-router-dom';

// Pages
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import ForgotPasswordPage from '../pages/ForgotPassword';
import EmailVerificationPage from '@/pages/EmailVerificationPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';

// Components
import PageNotFound from '@/components/PageNotFound';

function GuestRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/email-verification" element={<EmailVerificationPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* 404 Route for Guest Routes */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default GuestRoutes