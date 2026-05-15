import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient as api } from "@/apis/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface PasswordForm {
    current_password: string;
    new_password: string;
    confirm_password: string;
}

function ChangePasswordCard() {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting, isValid },
    } = useForm<PasswordForm>({
        mode: "onChange"
    });

    const password = watch("new_password", "");

    const onSubmit = async (values: PasswordForm) => {
        try {
            await api.patch("/v1/user/change-password", {
                current_password: values.current_password,
                new_password: values.new_password
            });
            toast.success("Password updated successfully");
            reset();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update password");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="border-none shadow-sm bg-white">
                <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-[#001e40]">
                        <KeyRound className="w-5 h-5 text-[#003366]" /> Security
                        Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                                Current Password
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showCurrent ? "text" : "password"}
                                    className="bg-[#f6faff] pr-10"
                                    {...register("current_password", { required: "Required" })}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowCurrent(!showCurrent)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showCurrent ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {errors.current_password && (
                                <p className="text-xs text-destructive">{errors.current_password.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                                New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showNew ? "text" : "password"}
                                    className="bg-[#f6faff] pr-10"
                                    {...register("new_password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 8,
                                            message: "Password must be at least 8 characters"
                                        },
                                        pattern: {
                                            // Combined regex to check for A-Z, a-z, and 0-9
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                                            message: "Password Must include uppercase, lowercase, and a number"
                                        }
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showNew ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {errors.new_password && (
                                <p className="text-xs text-destructive">{errors.new_password.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showConfirm ? "text" : "password"}
                                    className="bg-[#f6faff] pr-10"
                                    {...register("confirm_password", {
                                        required: "Confirm your password",
                                        validate: (val) => val === password || "Passwords do not match",
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirm(!showConfirm)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showConfirm ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {errors.confirm_password && (
                                <p className="text-xs text-destructive">{errors.confirm_password.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={isSubmitting || !isValid}
                            className="bg-[#001e40] hover:bg-[#003366] px-8 gap-2"
                        >
                            {isSubmitting
                                ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Updating...</>
                                : "Update Password"
                            }
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}

export default ChangePasswordCard