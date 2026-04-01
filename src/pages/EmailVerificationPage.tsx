import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Verified, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Copyright from "@/components/ui/copyright";
import ADUNLOGO from "@/assets/logo.png";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

function EmailVerificationPage() {
    const [value, setValue] = useState("");
    const [counter, setCounter] = useState(114); // 01:54 in seconds
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Countdown timer logic
    useEffect(() => {
        const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [counter]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        console.log("Verifying Code:", value);

        // Simulate API Call
        await new Promise((r) => setTimeout(r, 2000));
        setLoading(false);
        navigate("/dashboard");
    };

    return (
        <div className="bg-[#f6faff] font-body text-[#141d23] min-h-screen flex flex-col py-12 relative overflow-hidden">
            <main className="grow flex items-center justify-center px-6 z-10">
                <div className="w-full max-w-md">
                    {/* Verification Card */}
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

                        <div className="mb-8 text-center">
                            <h2 className="text-2xl font-extrabold text-[#001e40] mb-3 tracking-tight">
                                Verify Your Email
                            </h2>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Enter the 6-digit code sent to your university email.
                            </p>
                        </div>

                        <form onSubmit={handleVerify} className="space-y-8 flex flex-col items-center">
                            {/* Shadcn OTP Input Group */}
                            <InputOTP
                                maxLength={6}
                                value={value}
                                onChange={(value) => setValue(value)}
                                autoFocus
                            >
                                <InputOTPGroup className="gap-2 md:gap-3">
                                    <InputOTPSlot index={0} className="w-12 h-14 md:w-14 md:h-16 text-2xl border-b-2 rounded-lg bg-slate-50" />
                                    <InputOTPSlot index={1} className="w-12 h-14 md:w-14 md:h-16 text-2xl border-b-2 rounded-lg bg-slate-50" />
                                    <InputOTPSlot index={2} className="w-12 h-14 md:w-14 md:h-16 text-2xl border-b-2 rounded-lg bg-slate-50" />
                                    <InputOTPSlot index={3} className="w-12 h-14 md:w-14 md:h-16 text-2xl border-b-2 rounded-lg bg-slate-50" />
                                    <InputOTPSlot index={4} className="w-12 h-14 md:w-14 md:h-16 text-2xl border-b-2 rounded-lg bg-slate-50" />
                                    <InputOTPSlot index={5} className="w-12 h-14 md:w-14 md:h-16 text-2xl border-b-2 rounded-lg bg-slate-50" />
                                </InputOTPGroup>
                            </InputOTP>

                            <div className="space-y-4 w-full">
                                <Button
                                    disabled={loading || value.length !== 6}
                                    className="w-full h-12 bg-[#001e40] hover:bg-[#003366] text-white font-semibold rounded-lg transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                                    type="submit"
                                >
                                    {loading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            <span>Verify</span>
                                            <Verified className="h-4 w-4" />
                                        </>
                                    )}
                                </Button>

                                <div className="text-center">
                                    <p className="text-slate-500 text-sm">
                                        Didn't receive the code?
                                        <span className="block mt-2">
                                            <button
                                                type="button"
                                                disabled={counter > 0}
                                                className="text-[#7b5800] font-bold hover:underline transition-all disabled:opacity-50 disabled:no-underline"
                                            >
                                                Resend Code
                                            </button>
                                            {counter > 0 && (
                                                <span className="text-slate-400 text-xs ml-2 font-medium">
                                                    in {formatTime(counter)}
                                                </span>
                                            )}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Accessibility/Help */}
                    <div className="mt-8 flex justify-center items-center gap-6">
                        <Link
                            to="/auth/login"
                            className="flex items-center gap-2 text-slate-500 hover:text-[#001e40] transition-colors text-sm font-medium"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Back to Login</span>
                        </Link>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <button className="text-slate-500 hover:text-[#001e40] transition-colors text-sm font-medium">
                            Contact Support
                        </button>
                    </div>
                </div>
            </main>

            <Copyright />
        </div>
    );
}

export default EmailVerificationPage;