import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
    Mail,
    ArrowLeft,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon
} from "@/components/ui/input-group";
import ADUNLOGO from "@/assets/logo.png";
import Copyright from "@/components/ui/copyright";
import { apiClient as api } from "@/apis/axios";
import { toast } from "sonner";
import ResendOTP from "@/components/ui/resend-otp";
import OtpInput from "@/components/ui/otp-input";

interface ForgotPasswordInputs {
    email: string;
}

function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [otp, setOtp] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [initialCooldown, setInitialCooldown] = useState(0);
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<ForgotPasswordInputs>({
        mode: "onChange",
    });

    const onSubmit = async (data: ForgotPasswordInputs) => {
        setLoading(true);
        try {
            const response = await api.post("/v1/auth/reset-password/request", { email: data.email });

            setUserEmail(data.email);
            setIsSubmitted(true);

            // Capture cooldown if the backend provides it on first request
            if (response.data.cooldownRemaining) {
                setInitialCooldown(response.data.cooldownRemaining);
            }

            toast.success("Reset code sent to your email.");
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Something went wrong.";

            // Handle 429 if they've already requested one recently
            if (error?.response?.status === 429) {
                setUserEmail(data.email);
                setIsSubmitted(true);
                setInitialCooldown(error.response.data.retryAfter || 60);
            }

            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const verifyCode = async (e: React.FormEvent) => {
        e.preventDefault()

        if (loading) true
        setLoading(true)
        try {
            await api.post("/v1/auth/reset-password/verify", { otp, email: userEmail })
            navigate("/auth/reset-password")
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    // Sub-view: OTP Entry
    if (isSubmitted) return (
        <main className="min-h-screen flex flex-col bg-[#F4F6F9] font-body py-12">
            <div className="grow flex items-center justify-center px-4 z-10">
                <div className="w-full max-w-md text-center">
                    <div className="bg-white rounded-xl p-8 md:p-10 shadow-2xl ring-1 ring-[#001e40]/5 space-y-6">
                        <form onSubmit={verifyCode}>
                            <div className="flex justify-center mb-2">
                                <img src={ADUNLOGO} alt="Logo" className="w-20 h-20 object-contain" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-extrabold text-[#001e40]">Check your Email</h2>
                                <p className="text-slate-500 text-sm">
                                    We sent a 6-digit code to <br />
                                    <strong className="text-slate-700">{userEmail}</strong>
                                </p>
                            </div>

                            <div className="space-y-6">
                                <OtpInput otp={otp} setOtp={setOtp} />

                                <div className="flex flex-col gap-4">
                                    <Button
                                        type="submit"
                                        className="w-full h-11"
                                        disabled={otp.length < 6 || loading}
                                    >
                                        Verify Code
                                    </Button>

                                    <ResendOTP
                                        url="/v1/auth/reset-password/resend-otp"
                                        initialCountdown={initialCooldown}
                                    />

                                    <button
                                        onClick={() => setIsSubmitted(false)}
                                        className="inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-colors"
                                    >
                                        <ArrowLeft size={16} />
                                        Try a different email
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Copyright />
        </main>
    );

    // Initial View: Email Entry
    return (
        <main className="min-h-screen flex flex-col bg-[#F4F6F9] font-body py-12">
            <div className="grow flex items-center justify-center px-4 z-10">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-xl p-8 md:p-10 shadow-2xl ring-1 ring-[#001e40]/5 space-y-8">
                        <div className="text-center">
                            <img src={ADUNLOGO} alt="Logo" className="w-20 h-20 mx-auto mb-4 object-contain" />
                            <h2 className="text-2xl font-extrabold text-[#001e40] tracking-tight">Forgot Password?</h2>
                            <p className="text-slate-500 text-sm mt-2">
                                Enter your email and we'll send you a 6-digit code to reset your password.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Email</Label>
                                <InputGroup className={errors.email ? "border-red-500 ring-red-500" : ""}>
                                    <InputGroupAddon className="border-r-0">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        id="email"
                                        placeholder="curator@adun.edu.ng"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                                        })}
                                    />
                                </InputGroup>
                                {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.email.message}</p>}
                            </div>

                            <Button
                                type="submit"
                                disabled={loading || !isValid}
                                className="w-full h-11"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Reset Code"}
                            </Button>
                        </form>

                        <div className="text-center border-t pt-6">
                            <Link to="/auth/login" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-muted-foreground transition-colors">
                                <ArrowLeft size={16} />
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Copyright />
        </main>
    );
}

export default ForgotPasswordPage;