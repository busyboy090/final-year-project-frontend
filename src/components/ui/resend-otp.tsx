import { useState, useEffect } from "react";
import { toast } from "sonner";
import { apiClient as api } from "@/apis/axios";
import { formatTime } from "@/utils/time";

type Props = {
    url: string;
    method?: "post" | "patch";
    disabled?: boolean;
    cooldownSeconds?: number;
    initialCountdown?: number;
}

function ResendOTP({ 
    url, 
    method = "post",
    disabled: externalDisabled,
    initialCountdown = 0 
}: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<number>(0);

    useEffect(() => {
        if (initialCountdown > 0) {
            setCountdown(initialCountdown);
        }
    }, [initialCountdown]);

    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    const handleResend = async () => {
        if (loading || countdown > 0 || externalDisabled) return;

        setLoading(true);
        try {
            const response = await api[method](url);
            toast.success(response.data.message || "A new code has been sent.");
            setCountdown(response.data.cooldownSeconds); 
        } catch (err: any) {
            const errorData = err.response?.data;
            const msg = errorData?.message || "Failed to resend code.";
            toast.error(msg);

            if (err.response?.status === 429 && errorData?.retryAfter) {
                setCountdown(errorData.retryAfter);
            }
        } finally {
            setLoading(false);
        }
    };

    const isButtonDisabled = loading || countdown > 0 || externalDisabled;

    return (
        <button
            type="button"
            onClick={handleResend}
            disabled={isButtonDisabled}
            className={`text-sm font-semibold transition-all duration-200 ${
                isButtonDisabled 
                    ? "text-slate-400 cursor-not-allowed opacity-70" 
                    : "text-primary hover:text-primary/80 hover:underline active:scale-95"
            }`}
        >
            {loading ? (
                <span className="flex w-full justify-center items-center gap-1">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                    Sending...
                </span>
            ) : countdown > 0 ? (
                `Resend code in ${formatTime(countdown)}`
            ) : (
                "Didn't get a code? Resend"
            )}
        </button>
    );
}

export default ResendOTP;
