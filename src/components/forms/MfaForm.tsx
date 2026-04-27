import React from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import useAuth from "@/hooks/useAuth";
import OtpInput from "../ui/otp-input";

interface MfaFormProps {
    onSubmit: () => Promise<void> | void;
    otp: string;
    setOtp: (value: string) => void;
    loading: boolean;
}

function MfaForm({ onSubmit, otp, setOtp, loading }: MfaFormProps) {
    const { clearError } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 6) return;

        onSubmit();
    }

    return (
        <form onSubmit={handleSubmit} className="px-8 space-y-8 animate-in fade-in duration-300">
            <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest block text-center">
                    Verification Code
                </Label>
                
                <OtpInput otp={otp} setOtp={setOtp} length={6}/>
            </div>

            <div className="flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-11"
                    onClick={() => {
                        setOtp("");
                        clearError();
                    }}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="flex-1 h-11 text-white"
                    disabled={ loading || otp.length !== 6}
                >
                    { loading ? "Verifying…" : "Confirm"}
                </Button>
            </div>
        </form>
    )
}

export default MfaForm