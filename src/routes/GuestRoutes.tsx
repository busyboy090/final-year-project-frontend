import { Routes, Route } from "react-router-dom";

// Pages
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ForgotPasswordPage from "../pages/ForgotPassword";
import EmailVerificationPage from "@/pages/EmailVerificationPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import MfaPage from "@/pages/MfaPage";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import SetPasswordPage from "@/pages/SetPasswordPage";

// Components
import PageNotFound from "@/components/PageNotFound";

// Middlewares
import Guest from "@/middlewares/Guest";

function GuestRoutes() {
  return (
    <Routes>
      <Route element={<Guest />}>
        <Route path="set-password" element={<SetPasswordPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="verify-mfa" element={<MfaPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="email-verification" element={<EmailVerificationPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default GuestRoutes;
