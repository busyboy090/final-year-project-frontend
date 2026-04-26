import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { apiClient as api } from "@/apis/axios";
import { 
  LockKeyhole, Eye, EyeOff, CheckCircle2, 
  Circle, ArrowRight, Loader2 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

interface ResetPasswordInputs {
  password: string;
  confirmPassword: string;
}

function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Data from the previous "Forgot Password" step
  const [sessionData, setSessionData] = useState<{ email: string } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ResetPasswordInputs>({
    mode: "onChange",
  });

  const password = watch("password", "");

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

  const passwordRules = [
    { label: "Minimum 8 characters", met: password.length >= 8 },
    { label: "At least one uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number or special character", met: /[0-9!@#$%^&*]/.test(password) }
  ];

  // 2. Handle Password Reset Execution
  const onSubmit = async (data: ResetPasswordInputs) => {
    setLoading(true);
    try {
      await api.patch("/v1/auth/reset-password", {
        password: data.password,
        confirm_password: data.confirmPassword
      });

      toast.success("Password updated successfully! You can now log in.");
      
      // Clean redirect to login
      setTimeout(() => navigate("/auth/login", { replace: true }), 1500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update password.");
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
            <h1 className="text-3xl font-extrabold tracking-tight text-[#001e40] mb-2">New Password</h1>
            <p className="text-slate-500 text-sm">
              Resetting password for <span className="font-bold text-slate-700">{sessionData?.email}</span>
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-8 border border-slate-100">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="space-y-2">
                <Label className="block text-sm font-semibold text-[#001e40]">New Password</Label>
                <InputGroup className={errors.password ? "border-red-500" : ""}>
                  <InputGroupInput
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Required",
                      minLength: 8,
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/
                    })}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="px-3 text-slate-400 hover:text-[#001e40]">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </InputGroup>
              </div>

              <div className="space-y-2">
                <Label className="block text-sm font-semibold text-[#001e40]">Confirm New Password</Label>
                <InputGroup className={errors.confirmPassword ? "border-red-500" : ""}>
                  <InputGroupInput
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword", {
                      required: "Please confirm",
                      validate: val => val === password || "Passwords do not match"
                    })}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="px-3 text-slate-400 hover:text-[#001e40]">
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </InputGroup>
                {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.confirmPassword.message}</p>}
              </div>

              {/* Requirements Bento Box */}
              <div className="bg-slate-50 rounded-lg p-5 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Security Requirements</span>
                <ul className="grid grid-cols-1 gap-2.5">
                  {passwordRules.map((rule, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-medium text-slate-600">
                      {rule.met ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Circle size={16} className="text-slate-300" />}
                      <span className={rule.met ? "text-emerald-700" : ""}>{rule.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                type="submit"
                disabled={loading || !isValid}
                className="w-full h-12 bg-[#001e40] hover:bg-[#003366] text-white"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Password"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ResetPasswordPage;