import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiClient as api } from "@/apis/axios";
import MfaForm from "@/components/forms/MfaForm";
import useAuth from "@/hooks/useAuth";
import { dashboardPathForRole } from "@/utils/route";
import ADUNLOGO from "../assets/logo.png";
import { ArrowLeft } from "lucide-react";
import Copyright from "../components/ui/copyright";
import ResendOTP from "@/components/ui/resend-otp";

function MfaPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [isVerifyingSession, setIsVerifyingSession] = useState(true);

    // NEW: State to sync the backend cooldown timer
    const [initialCooldown, setInitialCooldown] = useState(0);

    const from = (location.state as { from?: string } | null)?.from;

    // 1. Verify MFA Session on Load
    useEffect(() => {
        const checkMfaSession = async () => {
            try {
                // Hits the controller that returns { email, cooldownRemaining }
                const res = await api.get("/v1/auth/mfa/session");
                setEmail(res.data.email);

                // Sync the timer with the backend Redis state
                if (res.data.cooldownRemaining) {
                    setInitialCooldown(res.data.cooldownRemaining);
                }
            } catch (err: any) {
                // toast.error("MFA session expired. Please log in again.");
                navigate("/auth/login", { replace: true });
            } finally {
                setIsVerifyingSession(false);
            }
        };

        checkMfaSession();
    }, [navigate]);

    // 2. Handle MFA Submission
    const handleSubmit = async () => {
        if (otp.length < 6) return;
        setLoading(true);

        try {
            const { data } = await api.post("/v1/auth/verify-mfa", { otp });

            // Set Global Auth State (Redux/Context)
            login({
                accessToken: data.accessToken,
                user: data.user
            });

            // Redirect: Prioritize the 'from' state, otherwise default to role-based dashboard
            const dest = from?.startsWith("/dashboard") ? from : dashboardPathForRole(data.user.role);
            navigate(dest, { replace: true });

        } catch (error: any) {
            if (error?.response) {
                // If the tempToken is dead, boot them to login
                if (error.response.data?.code === "INVALID_TOKEN") {
                    navigate("/auth/login", { replace: true });
                }
                toast.error(error.response?.data?.message || "Invalid code");
            } else {
                toast.error("Connection error. Please try again.");
            }
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
        <main className="grow flex flex-col items-center justify-center p-6 bg-[#F4F6F9] min-h-screen">
            <div className="bg-white p-8 shadow-2xl border border-slate-100 rounded-2xl w-full max-w-md space-y-6">
                <div className="flex items-center justify-center">
                    <Link to="/">
                        <img
                            src={ADUNLOGO}
                            alt="Logo"
                            className="w-20 h-20 object-contain"
                        />
                    </Link>
                </div>

                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-[#001e40]">Two-Factor Authentication</h2>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Enter the code sent to <br />
                        <strong className="text-slate-700">{email}</strong>
                    </p>
                </div>

                {/* MFA OTP Input Component */}
                <MfaForm
                    onSubmit={handleSubmit}
                    otp={otp}
                    setOtp={setOtp}
                    loading={loading}
                />

                <div className="flex flex-col gap-4 text-center">
                    {/* The specialized Resend component with backend timer sync */}
                    <ResendOTP
                        url="/v1/auth/mfa/resend-otp"
                        initialCountdown={initialCooldown}
                    />

                    <Link to="/auth/login" className="inline-flex mx-auto items-center gap-2 text-sm font-bold text-primary hover:text-muted-foreground transition-colors">
                        <ArrowLeft size={16} />
                        Back to Login
                    </Link>
                </div>
            </div>

            <Copyright />
        </main>
    );
}

export default MfaPage