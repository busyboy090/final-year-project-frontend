import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
    Mail,
    ArrowRight,
    ArrowLeft,
    Loader2,
    ShieldCheck
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

interface ForgotPasswordInputs {
    email: string;
}

function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

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
            console.log("Requesting reset for:", data.email);
            // Simulate API call
            await new Promise((r) => setTimeout(r, 2000));
            setIsSubmitted(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col bg-[#F4F6F9] font-body relative overflow-hidden py-12">
            <div className="grow flex items-center justify-center px-4 z-10">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-xl p-8 md:p-10 shadow-[0px_20px_40px_rgba(0,30,64,0.06)] ring-1 ring-[#001e40]/5">
                        {/* Logo & Brand */}
                        <div className="text-center">
                            <Link to="/" className="inline-flex items-center justify-center w-20 h-20 mb-2 bg-primary-container rounded-lg">
                                <img
                                    src={ADUNLOGO}
                                    alt="Admiralty University of Nigeria Logo"
                                    className="w-18 h-18 object-contain"
                                />
                            </Link>
                        </div>

                        {!isSubmitted ? (
                            <>
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-extrabold text-[#001e40] mb-3 tracking-tight">Forgot Password?</h2>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        Enter your email address below and we'll send you a 6-digit code to reset your secure credentials.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-[#001e40] ml-1">Email</Label>
                                        <InputGroup className={errors.email ? "border-red-500 ring-red-500" : ""}>
                                            <InputGroupAddon className="border-r-0">
                                                <Mail className="h-4 w-4 text-slate-400" />
                                            </InputGroupAddon>
                                            <InputGroupInput
                                                id="email"
                                                placeholder="e.g. curator@adun.edu.ng"
                                                {...register("email", {
                                                    required: "Email is required",
                                                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                                                })}
                                            />
                                        </InputGroup>
                                        {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.email.message}</p>}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading || !isValid}
                                        className="w-full h-12 bg-[#001e40] hover:bg-[#003366] text-white font-bold uppercase tracking-widest transition-all active:scale-[0.98]"
                                    >
                                        {loading ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                Send Reset Code
                                                <ArrowRight size={18} />
                                            </div>
                                        )}
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ShieldCheck className="text-green-600 h-8 w-8" />
                                </div>
                                <h2 className="text-2xl font-extrabold text-[#001e40] mb-3">Check your Email</h2>
                                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                                    We have sent a 6-digit code to your email. Please check your inbox and spam folder.
                                </p>
                                <Button variant="outline" className="w-full h-12 font-bold uppercase tracking-widest" onClick={() => setIsSubmitted(false)}>
                                    Try another email
                                </Button>
                            </div>
                        )}

                        {/* Back Action */}
                        <div className="mt-8 text-center border-t pt-6">
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