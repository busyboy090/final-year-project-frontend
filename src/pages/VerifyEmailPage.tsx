import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiClient as api } from "@/apis/axios";
import { Button } from "@/components/ui/button";
import OtpInput from "@/components/ui/otp-input";
import ADUNLOGO from "../assets/logo.png";
import { Label } from "@/components/ui/label";
import Copyright from "@/components/ui/copyright";
import ResendOTP from "@/components/ui/resend-otp";

function VerifyEmailPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [isVerifyingSession, setIsVerifyingSession] = useState(true);
    
    // NEW: State to store the initial cooldown from the server
    const [initialCooldown, setInitialCooldown] = useState(0);

    // 1. Verify Session Token on Load
    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await api.get("/v1/auth/verify-email/session");
                setEmail(res.data.email);
                
                // If there's an active cooldown in Redis, sync it to our state
                if (res.data.cooldownRemaining) {
                    setInitialCooldown(res.data.cooldownRemaining);
                }
            } catch (err: any) {
                // toast.error("Session expired. Please log in again.");
                navigate("/auth/login", { replace: true });
            } finally {
                setIsVerifyingSession(false);
            }
        };

        checkSession();
    }, [navigate]);

    // 2. Handle OTP Verification
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 6) return;
        
        setLoading(true);
        try {
            await api.patch("/v1/auth/verify-email", { otp });
            toast.success("Email verified! You can now login.");
            navigate("/auth/login", { replace: true });
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Invalid code");
        } finally {
            setLoading(false);
        }
    };

    if (isVerifyingSession) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#F4F6F9]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <main className="grow flex flex-col items-center justify-center p-6 bg-[#F4F6F9] min-h-screen font-body">
            <div className="relative w-full max-w-md">
                <form 
                    onSubmit={handleVerify} 
                    className="bg-white p-8 shadow-2xl border border-slate-200 rounded-2xl w-full text-center space-y-6"
                >
                    <div className="flex items-center justify-center">
                        <Link to="/">
                            <img
                                src={ADUNLOGO}
                                alt="Logo"
                                className="w-20 h-20 object-contain"
                            />
                        </Link>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-[#001e40]">Verify your email</h2>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            We've sent a 6-digit verification code to <br />
                            <strong className="text-slate-700">{email}</strong>
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
                            Verification Code
                        </Label>
                        <OtpInput otp={otp} setOtp={setOtp} length={6} disabled={loading} />
                    </div>

                    <div className="space-y-3">
                        <Button 
                            className="w-full h-11 text-base font-semibold" 
                            disabled={loading || otp.length < 6}
                        >
                            {loading ? "Verifying..." : "Verify Account"}
                        </Button>
                        
                        <div className="flex flex-col space-y-4 pt-2">
                            {/* Updated ResendOTP with initialCountdown prop */}
                            <ResendOTP 
                                url="/v1/auth/verify-email/resend-otp" 
                                initialCountdown={initialCooldown}
                            />
                            
                            <Link 
                                to="/auth/login" 
                                className="text-xs text-slate-400 hover:text-primary transition-colors"
                            >
                                Use a different email address
                            </Link>
                        </div>
                    </div>
                </form>
            </div>

            <Copyright />
        </main>
    );
}

export default VerifyEmailPage;