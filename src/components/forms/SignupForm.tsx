import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  InputGroup, 
  InputGroupInput, 
  InputGroupAddon 
} from "@/components/ui/input-group";
import { 
  Mail, 
  Lock, 
  User, 
  Building, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowRight 
} from "lucide-react";

interface RegisterFormInputs {
  fullName: string;
  email: string;
  role: string;
  department: string;
  password: string;
  confirmPassword: string;
}

interface SignupFormProps {
  onSubmit: (data: RegisterFormInputs) => Promise<void> | void;
}

function SignupForm({ onSubmit }: SignupFormProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm<RegisterFormInputs>({
    mode: "onChange",
  });

  const password = watch("password");

  const onInternalSubmit = async (data: RegisterFormInputs) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onInternalSubmit)} className="space-y-5">
      
      {/* Full Name - InputGroup */}
      <div className="space-y-1.5">
        <Label htmlFor="fullName" className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Full Name</Label>
        <InputGroup className={errors.fullName ? "border-destructive ring-destructive" : ""}>
          <InputGroupAddon className="border-r-0">
            <User className="h-4 w-4 text-slate-400" />
          </InputGroupAddon>
          <InputGroupInput 
            placeholder="Johnathan Doe" 
            id="fullName"
            {...register("fullName", { required: "Name is required" })} 
          />
        </InputGroup>
        {errors.fullName && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.fullName.message}</p>}
      </div>

      {/* Email Address - InputGroup */}
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Email Address</Label>
        <InputGroup className={errors.email ? "border-destructive ring-destructive" : ""}>
          <InputGroupAddon className="border-r-0">
            <Mail className="h-4 w-4 text-slate-400" />
          </InputGroupAddon>
          <InputGroupInput 
            type="email"
            placeholder="j.doe@adun.edu.ng" 
            id="email"
            {...register("email", { 
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
            })} 
          />
        </InputGroup>
        {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.email.message}</p>}
      </div>

      {/* Role & Department */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Role - Standard Shadcn Select */}
        <div className="space-y-1.5">
          <Label htmlFor="role" className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Role</Label>
          <Controller
            control={control}
            name="role"
            rules={{ required: "Select a role" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.role && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.role.message}</p>}
        </div>

        {/* Department - InputGroup */}
        <div className="space-y-1.5">
          <Label htmlFor="department" className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Department</Label>
          <InputGroup className={errors.department ? "border-destructive ring-destructive" : ""}>
            <InputGroupAddon className="border-r-0">
              <Building className="h-4 w-4 text-slate-400" />
            </InputGroupAddon>
            <InputGroupInput 
              placeholder="Computing" 
              id="department"
              {...register("department", { required: "Required" })} 
            />
          </InputGroup>
        </div>
      </div>

      {/* Passwords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Password - InputGroup */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Password</Label>
          <InputGroup className={errors.password ? "border-destructive ring-destructive" : ""}>
            <InputGroupAddon className="border-r-0">
              <Lock className="h-4 w-4 text-slate-400" />
            </InputGroupAddon>
            <InputGroupInput 
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              id="password"
              {...register("password", { required: "Required", minLength: 8 })}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="px-3 text-slate-400 hover:text-[#001e40] transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </InputGroup>
          {errors.password && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.password.message}</p>}
        </div>

        {/* Confirm Password - InputGroup */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Confirm Password</Label>
          <InputGroup className={errors.confirmPassword ? "border-destructive ring-destructive" : ""}>
            <InputGroupAddon className="border-r-0">
              <Lock className="h-4 w-4 text-slate-400" />
            </InputGroupAddon>
            <InputGroupInput 
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="••••••••"
              {...register("confirmPassword", { 
                required: "Confirm your password",
                validate: val => val === password || "Passwords do not match"
              })} 
            />
            <button 
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="px-3 text-slate-400 hover:text-[#001e40] transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </InputGroup>
          {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        disabled={loading || !isValid} 
        className="w-full h-12 font-bold uppercase tracking-widest mt-4 transition-all active:scale-[0.95]"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <div className="flex items-center gap-2">
            Register Account
            <ArrowRight size={18} />
          </div>
        )}
      </Button>
    </form>
  );
}

export default SignupForm;