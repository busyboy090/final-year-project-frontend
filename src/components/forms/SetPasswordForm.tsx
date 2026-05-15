import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff, CheckCircle2, Circle, Loader2 } from "lucide-react";

interface PasswordInputs {
  password: string;
  confirmPassword: string;
}

function SetPasswordForm({
  onSubmit,
  loading,
}: {
  onSubmit: (data: PasswordInputs) => void;
  loading: boolean;
}) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<PasswordInputs>({
    mode: "onChange",
  });

  const password = watch("password", "");

  const passwordRules = [
    { label: "Minimum 8 characters", met: password.length >= 8 },
    { label: "At least one uppercase letter", met: /[A-Z]/.test(password) },
    {
      label: "One number or special character",
      met: /[0-9!@#$%^&*]/.test(password),
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label className="block text-sm font-semibold text-[#001e40]">
          New Password
        </Label>
        <InputGroup className={errors.password ? "border-red-500" : ""}>
          <InputGroupInput
            type={showPass ? "text" : "password"}
            placeholder="••••••••"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters"
              },
              pattern: {
                // Combined regex to check for A-Z, a-z, and 0-9
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                message: "Password Must include uppercase, lowercase, and a number"
              }
            })}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="px-3 text-slate-400 hover:text-[#001e40]"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </InputGroup>
      </div>

      <div className="space-y-2">
        <Label className="block text-sm font-semibold text-[#001e40]">
          Confirm New Password
        </Label>
        <InputGroup className={errors.confirmPassword ? "border-red-500" : ""}>
          <InputGroupInput
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            {...register("confirmPassword", {
              required: "Confirm your password",
              validate: (val) => val === password || "Passwords do not match",
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="px-3 text-slate-400 hover:text-[#001e40]"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </InputGroup>
        {errors.confirmPassword && (
          <p className="text-[10px] text-red-500 font-bold uppercase ml-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Requirements Bento Box */}
      <div className="bg-slate-50 rounded-lg p-5 space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
          Security Requirements
        </span>
        <ul className="grid grid-cols-1 gap-2.5">
          {passwordRules.map((rule, i) => (
            <li
              key={i}
              className="flex items-center gap-3 text-xs font-medium text-slate-600"
            >
              {rule.met ? (
                <CheckCircle2 size={16} className="text-emerald-500" />
              ) : (
                <Circle size={16} className="text-slate-300" />
              )}
              <span className={rule.met ? "text-emerald-700" : ""}>
                {rule.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        type="submit"
        disabled={loading || !isValid}
        className="w-full h-12 bg-[#001e40] hover:bg-[#003366] text-white"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          "Update Password"
        )}
      </Button>
    </form>
  );
}

export default SetPasswordForm;
