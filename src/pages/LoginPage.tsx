import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LoginForm from "../components/forms/LoginForm";
import ADUNLOGO from "../assets/logo.png";
import Copyright from "../components/ui/copyright";
import useAuth from "@/hooks/useAuth";
import { dashboardPathForRole } from "@/utils/route";
import { useState } from "react";
import { apiClient as api } from "@/apis/axios";

export default function LoginPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = (location.state as { from?: string } | null)?.from;

  const handleLogin = async (data: { email: string; password: string; rememberMe: boolean }) => {
    if (loading) return
    setLoading(true)
    try {
      const res = await api.post("/v1/auth/login", data);

      // check if mfa is required
      if (res.status === 200 && res.data.mfaRequired) {
        return navigate("/auth/verify-mfa", { state: { from: location.state?.from || "/" } });
      };

      // Set Auth States
      login({
        accessToken: res.data.accessToken,
        user: res.data.user
      });

      // Redirect to the intended page
      const dest = from?.startsWith("/dashboard") ? from : dashboardPathForRole(res.data.user.role);
      navigate(dest, { replace: true });
    } catch (error: any) {
      if (error?.response?.status === 403 && error?.response?.data?.requireEmailVerification) {
        return navigate("/auth/verify-email");
      }

      if(error?.response.status === 500) toast.error("Something went wrong.")
      else toast.error(error?.response.data.message)
    } finally {
      setLoading(false)
    }
  };

  return (
    <main className="grow flex items-center justify-center p-6 bg-[#F4F6F9] min-h-screen">
      <div className="relative w-full max-w-md">
        <div className="bg-white shadow-2xl border border-slate-200 rounded-2xl overflow-hidden">
          {/* Brand Header */}
          <div className="px-8 pt-10 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-lg">
              <Link to="/">
                <img
                  src={ADUNLOGO}
                  alt="Admiralty University of Nigeria Logo"
                  className="w-16 h-16 object-contain"
                />
              </Link>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-[#001e40] font-headline">
              Sign In to ADUN-EMS
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Admiralty University Event Management System
            </p>
          </div>

          <LoginForm onSubmit={handleLogin} loading={loading} />
          <div className="px-8 py-6 bg-slate-50 border-t text-center">
            <p className="text-sm">Don't have an account? <Link to="/auth/signup" className="font-bold text-primary hover:text-muted-foreground underline decoration-2 underline-offset-4 transition-colors">Register</Link></p>
          </div>
        </div>
        <Copyright />
      </div>
    </main>
  );
}