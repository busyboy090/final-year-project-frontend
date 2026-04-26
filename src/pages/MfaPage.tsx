import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiClient as api } from "@/apis/axios";
import MfaForm from "@/components/forms/MfaForm";
import useAuth from "@/hooks/useAuth";
import { dashboardPathForRole } from "@/types/auth";
import ADUNLOGO from "../assets/logo.png";
import { ArrowLeft } from "lucide-react";
import Copyright from "../components/ui/copyright";

export default function MfaPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [isVerifyingSession, setIsVerifyingSession] = useState(true);
    const from = (location.state as { from?: string } | null)?.from;

    // 1. Verify MFA Session on Load (Same as VerifyEmailPage)
    useEffect(() => {
        const checkMfaSession = async () => {
            try {
                // Ensure you have a 'mfa_verification' type check in this controller
                const res = await api.get("/v1/auth/mfa/session");
                setEmail(res.data.email);
            } catch (err: any) {
                toast.error("MFA session expired. Please log in again.");
                navigate("/auth/login", { replace: true });
            } finally {
                setIsVerifyingSession(false);
            }
        };

        checkMfaSession();
    }, [navigate]);

    // 2. Handle MFA Submission
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const { data } = await api.post("/v1/auth/verify-mfa", { otp });

            // Set Auth State
            login({
                accessToken: data.accessToken,
                user: data.user
            })

            // Redirect to the intended page
            const dest = from?.startsWith("/dashboard") ? from : dashboardPathForRole(data.user.role);
            navigate(dest, { replace: true });
        } catch (error: any) {
            if(error?.response) {
                if(error.response.data?.code === "INVALID_TOKEN") {
                    navigate("/auth/login")
                }

                toast.error(error.response?.data?.message || "Invalid code");
            }
        } finally {
            setLoading(false);
        }
    };

    // 3. Handle Resend Logic (Optional for MFA, but good for Email-based 2FA)
    const handleResendMfa = async () => {
        try {
            await api.post("/v1/auth/mfa/resend-otp");
            toast.success("A new authentication code has been sent.");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to resend code.");
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
            <div className="bg-white p-8 shadow-2xl border rounded-2xl w-full max-w-md space-y-6">
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

                <MfaForm onSubmit={handleSubmit} otp={otp} setOtp={setOtp} loading={loading} />

                <div className="flex flex-col gap-4 text-center">
                    <button
                        onClick={handleResendMfa}
                        className="text-sm text-primary font-semibold hover:underline"
                    >
                        Didn't get a code? Resend
                    </button>

                    <Link to="/auth/login" className="flex gap-2 items-center justify-center text-sm text-slate-400 hover:text-black transition-colors">
                        <ArrowLeft size={16} />
                        <span>Back to Login</span>
                    </Link>
                </div>
            </div>

            <Copyright />
        </main>
    );
}