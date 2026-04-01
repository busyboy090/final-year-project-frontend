import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { 
  LockKeyhole, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Loader2 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  InputGroup, 
  InputGroupInput
} from "@/components/ui/input-group";

interface ResetPasswordInputs {
  password: string;
  confirmPassword: string;
}

function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ResetPasswordInputs>({
    mode: "onChange",
  });

  const password = watch("password", "");

  // Password Validation Logic for the Bento-style indicator
  const passwordRules = [
    { label: "Minimum 8 characters", met: password.length >= 8 },
    { label: "At least one uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number or special character", met: /[0-9!@#$%^&*]/.test(password) }
  ];

  const onSubmit = async (data: ResetPasswordInputs) => {
    setLoading(true);
    try {
      console.log("Updating password to:", data.password);
      // Simulate API call
      await new Promise((r) => setTimeout(r, 2000));
      // You'd typically redirect or show a success toast here
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#f6faff] font-body text-[#141d23] relative">
      <div className="grow flex items-center justify-center px-4 pt-24 pb-12 z-10">
        <div className="w-full max-w-md">
          {/* Center Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#003366] mb-4 shadow-lg shadow-[#001e40]/10">
              <LockKeyhole className="text-white h-8 w-8" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#001e40] mb-2">Reset Your Password</h1>
            <p className="text-slate-500 text-sm leading-relaxed">Ensure your new password is secure and unique.</p>
          </div>

          {/* Reset Card */}
          <div className="bg-white rounded-xl shadow-[0px_20px_40px_rgba(0,30,64,0.06)] p-8 border border-slate-100">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* New Password */}
              <div className="space-y-2">
                <Label className="block text-sm font-semibold text-[#001e40]">New Password</Label>
                <InputGroup className={errors.password ? "border-red-500 ring-red-500" : ""}>
                  <InputGroupInput 
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password", { 
                      required: "Password is required",
                      minLength: 8,
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#$%^&*])/
                    })} 
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="px-3 text-slate-400 hover:text-[#001e40] transition-colors">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </InputGroup>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <Label className="block text-sm font-semibold text-[#001e40]">Confirm New Password</Label>
                <InputGroup className={errors.confirmPassword ? "border-red-500 ring-red-500" : ""}>
                  <InputGroupInput 
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword", { 
                      required: "Confirm your password",
                      validate: val => val === password || "Passwords do not match"
                    })} 
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="px-3 text-slate-400 hover:text-[#001e40] transition-colors">
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </InputGroup>
                {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.confirmPassword.message}</p>}
              </div>

              {/* Strength Requirements (Bento indicator) */}
              <div className="bg-slate-50 rounded-lg p-5 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Security Requirements</span>
                <ul className="grid grid-cols-1 gap-2.5">
                  {passwordRules.map((rule, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-medium text-slate-600">
                      {rule.met ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <Circle size={16} className="text-slate-300" />
                      )}
                      <span className={rule.met ? "text-emerald-700" : ""}>{rule.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={loading || !isValid} 
                className="w-full h-12 bg-[#001e40] hover:bg-[#003366] text-white font-bold uppercase tracking-widest transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    Update Password
                    <ArrowRight size={18} />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <Link className="text-sm font-bold text-[#7b5800] hover:underline underline-offset-4" to="/auth/login">
                Back to Academic Portal
              </Link>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-slate-500 leading-relaxed px-6">
            Your security is our priority. Changing your password will sign you out of all other active sessions on Admiralty University devices.
          </p>
        </div>
      </div>
    </main>
  );
}

export default ResetPasswordPage;