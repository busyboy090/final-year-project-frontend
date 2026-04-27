import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";
import { Mail, Eye, EyeOff, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface LoginFormInputs {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormInputs) => Promise<void> | void;
  loading: boolean;
}

function LoginForm({ onSubmit, loading }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control, // Needed for the Checkbox
    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onChange",
  });

  const onInternalSubmit = async (data: LoginFormInputs) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onInternalSubmit)} className="px-8 pb-10 space-y-6">
      {/* Email Field - Now using InputGroup */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
          Email Address
        </Label>
        <InputGroup>
          <InputGroupAddon>
            <Mail className="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput
            id="email"
            type="email"
            placeholder="name@adun.edu.ng"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
        </InputGroup>
        {errors.email && (
          <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field using InputGroup */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
          Password
        </Label>
        <InputGroup>
          <InputGroupAddon>
            <Lock className="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 1, message: "Password is required" },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="px-3 flex items-center text-muted-foreground hover:text-primary transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </InputGroup>
        {errors.password && (
          <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Remember Me (shadcn) & Forgot Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="rememberMe"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="border-gray-300"
              />
            )}
          />
          <Label htmlFor="rememberMe" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
            Remember Me
          </Label>
        </div>

        <Link to="/auth/forgot-password" className="text-sm font-medium text-primary hover:underline">
          Forgot Password?
        </Link>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 text-base font-bold shadow-lg"
        disabled={loading || !isValid || !isDirty || isSubmitting}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}

export default LoginForm;