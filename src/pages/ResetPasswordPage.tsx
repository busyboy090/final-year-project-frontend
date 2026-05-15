import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiClient as api } from "@/apis/axios";
import { LockKeyhole } from "lucide-react";
import SetPasswordForm from "@/components/forms/SetPasswordForm";

interface ResetPasswordInputs {
  password: string;
  confirmPassword: string;
}

function ResetPasswordPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  // Data from the previous "Forgot Password" step
  const [sessionData, setSessionData] = useState<{ email: string } | null>(
    null,
  );

  // 1. Verify Session on Mount
  useEffect(() => {
    const verifySession = async () => {
      try {
        // This endpoint verifies the signed 'tempToken' cookie
        const res = await api.get("/v1/auth/reset-password/session");
        setSessionData({ email: res.data.email });
      } catch (err: any) {
        // toast.error("Session expired. Please start the reset process again.");
        navigate("/auth/forgot-password", { replace: true });
      } finally {
        setIsVerifying(false);
      }
    };
    verifySession();
  }, [navigate]);

  // 2. Handle Password Reset Execution
  const onSubmit = async (data: ResetPasswordInputs) => {
    setLoading(true);
    try {
      await api.patch("/v1/auth/reset-password", {
        password: data.password,
        confirm_password: data.confirmPassword,
      });

      toast.success("Password updated successfully! You can now log in.");

      // Clean redirect to login
      setTimeout(() => navigate("/auth/login", { replace: true }), 1500);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update password.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F4F6F9]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#f6faff] font-body text-[#141d23] relative">
      <div className="grow flex items-center justify-center px-4 py-12 z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#003366] mb-4 shadow-lg">
              <LockKeyhole className="text-white h-8 w-8" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#001e40] mb-2">
              New Password
            </h1>
            <p className="text-slate-500 text-sm">
              Resetting password for{" "}
              <span className="font-bold text-slate-700">
                {sessionData?.email}
              </span>
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-8 border border-slate-100">
            <SetPasswordForm onSubmit={onSubmit} loading={loading} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default ResetPasswordPage;
