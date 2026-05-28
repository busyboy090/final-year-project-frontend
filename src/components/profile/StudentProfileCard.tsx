import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    InputGroup, InputGroupAddon, InputGroupInput,
} from "@/components/ui/input-group";
import { Hash, Save, Loader2 } from "lucide-react";
import { DepartmentSelect } from "../ui/department-select";
import { LevelSelect } from "../ui/level-select";
import { apiClient as api } from "@/apis/axios";
import useUser from "@/hooks/useUser";
import { toast } from "sonner";

interface StudentProfileForm {
    matric_no: string;
    department_id: number;
    level_id: number;
}

function StudentProfileCard() {
    const { profile, updateLocalProfile, needsProfileCompletion, setNeedsProfileCompletion } = useUser();

    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<StudentProfileForm>({
        // Set default values from profile if they exist
        defaultValues: {
            matric_no: profile?.matric_no || "",
            department_id: profile?.department_id,
            level_id: profile?.level_id,
        },
    });

    const onSubmit = async (values: StudentProfileForm) => {
        if (!needsProfileCompletion) return;
        try {
            const { data: { data } } = await api.patch("/v1/user/profile/student/complete", {
                ...values,
            });

            toast.success("Profile updated successfully!");
            updateLocalProfile({ ...profile, ...data });
            setNeedsProfileCompletion(false)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="border-none shadow-sm bg-white">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold text-[#001e40]">
                                Student Information
                            </CardTitle>
                            <CardDescription>
                                {needsProfileCompletion
                                    ? "Please complete your profile to continue."
                                    : "Your profile is up to date."}
                            </CardDescription>
                        </div>
                        {/* Optional: Add a badge to show status */}
                        {!needsProfileCompletion && (
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold uppercase">
                                Completed
                            </span>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* 
                      Wrap fields in fieldset. 
                      If needsProfileCompletion is false, everything inside is disabled.
                    */}
                    <fieldset disabled={!needsProfileCompletion} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Matric No */}
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                                    Matriculation Number
                                </Label>
                                <InputGroup>
                                    <InputGroupAddon className={!needsProfileCompletion ? "opacity-50" : ""}>
                                        <Hash className="h-4 w-4" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        placeholder="ADUN/FS/SEN/22/001"
                                        className="border-none"
                                        {...register("matric_no", { required: "Required" })}
                                    />
                                </InputGroup>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <DepartmentSelect control={control} errors={errors} />
                            <LevelSelect control={control} errors={errors} />
                        </div>
                    </fieldset>

                    {/* Submit Button - Only rendered if profile needs completion */}
                    {needsProfileCompletion && (
                        <div className="flex justify-end pt-2">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#001e40] hover:bg-[#003366] px-8 gap-2"
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                ) : (
                                    <><Save className="w-4 h-4" /> Save Changes</>
                                )}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </form>
    );
}

export default StudentProfileCard