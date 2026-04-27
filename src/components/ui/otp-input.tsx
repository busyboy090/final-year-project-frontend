import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "@/components/ui/input-otp";
  import React from "react";
  
  interface Props {
    otp: string;
    setOtp: (value: string) => void;
    length?: number;
    disabled?: boolean;
  }
  
  function OtpInput({ otp, setOtp, length = 6, disabled = false }: Props) {
    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
      const pasteData = e.clipboardData.getData("text");
      const cleaned = pasteData.replace(/\D/g, "").slice(0, length);
      
      if (cleaned) {
        setOtp(cleaned);
        e.preventDefault();
      }
    };
  
    return (
      <div className="mt-4 w-full" onPaste={handlePaste}>
        <InputOTP
          maxLength={length}
          value={otp}
          onChange={(value) => setOtp(value)}
          disabled={disabled}
          pattern={"^[0-9]*$"}
        >
          <InputOTPGroup className="w-full flex gap-2">
            {Array.from({ length }).map((_, index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="flex-1 h-[60px] text-2xl font-semibold border-2 rounded-md bg-white data-[active=true]:border-primary data-[active=true]:ring-1 data-[active=true]:ring-primary"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
    );
  }
  
  export default OtpInput;