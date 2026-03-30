import { useState } from "react";
import { useForm } from "react-hook-form";


// 1. Define the shape of your form fields
interface LoginFormInputs {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormInputs) => Promise<void> | void;
}

function LoginForm({ onSubmit }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 2. Initialize useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // 3. Wrapper for the parent onSubmit to handle local loading state
  const onInternalSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onInternalSubmit)} className="px-8 pb-10 space-y-6">
      {/* Email */}
      <div className="space-y-1">
        <UnderlineField
          id="email"
          label="Email Address"
          type="email"
          placeholder="name@adun.edu.ng"
          iconName="mail"
          // 4. Spread the register function instead of manual value/onChange
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <span className="text-xs text-red-500 ml-1">{errors.email.message}</span>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <UnderlineField
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          iconName="lock"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className={`flex items-center transition-colors ${
                showPassword ? "text-primary" : "text-outline-variant hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          }
        />
        {errors.password && (
          <span className="text-xs text-red-500 ml-1">{errors.password.message}</span>
        )}
      </div>

      {/* Remember me + Forgot password */}
      <div className="flex items-center justify-between pt-2">
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="peer h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary/20 transition-all cursor-pointer"
            />
            <span className="material-symbols-outlined absolute opacity-0 peer-checked:opacity-100 text-white text-[16px] pointer-events-none left-0.5">
              check
            </span>
          </div>
          <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">
            Remember Me
          </span>
        </label>

        <a
          href="#"
          className="text-sm font-semibold text-secondary hover:text-on-secondary-container transition-colors"
        >
          Forgot Password?
        </a>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-4 px-6 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all duration-150
          ${
            loading
              ? "bg-outline cursor-not-allowed"
              : "bg-primary-container shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer"
          }`}
      >
        {loading ? "Signing in…" : "Login"}
        {!loading && (
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        )}
      </button>
    </form>
  );
}

export default LoginForm;