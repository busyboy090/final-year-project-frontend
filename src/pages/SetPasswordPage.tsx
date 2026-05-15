import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { apiClient as api } from "@/apis/axios";
import { LockKeyhole } from "lucide-react";
import SetPasswordForm from "@/components/forms/SetPasswordForm";

interface PasswordInputs {
  password: string;
  confirmPassword: string;
}

function SetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [sessionData, setSessionData] = useState<{ email: string } | null>(null);

  // useRef — persists after URL is cleared, no re-render side effects
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/auth/forgot-password", { replace: true });
      return;
    }

    tokenRef.current = token;

    const verifySession = async () => {
      try {
        const res = await api.get(`/v1/auth/set-password/session?token=${token}`);
        setSessionData({ email: res.data.email });
      } catch {
        navigate("/auth/forgot-password", { replace: true });
      } finally {
        setIsVerifying(false);
      }
    };

    verifySession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data: PasswordInputs) => {
    setLoading(true);
    try {
      await api.patch(`/v1/user/set-password?token=${tokenRef.current}`, {
        password: data.password,
        confirm_password: data.confirmPassword,
      });

      toast.success("Password updated successfully! You can now log in.");
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
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
              Set Password
            </h1>
            <p className="text-slate-500 text-sm">
              Set password for{" "}
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

export default SetPasswordPage;