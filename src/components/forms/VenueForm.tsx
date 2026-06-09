import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Building2, Users, MapPin, ImageIcon, Plus, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VenueFormValues {
    name: string;
    type: "hall" | "outdoor" | "classroom" | "auditorium" | "lab";
    capacity: number | string;
    location: string;
    status: "available" | "maintenance" | "occupied";
    thumbnail: FileList | null;
    features: string[];
}

interface FacilityOption {
    id: string | number;
    name: string;
}

interface VenueFormProps {
    initialData?: Partial<VenueFormValues>;
    onSubmit: (values: VenueFormValues) => void;
    isSubmitting: boolean;
    facilities: FacilityOption[];
    thumbnailPreview: string | null;
    setThumbnailPreview: (url: string | null) => void;
    galleryPreviews: string[];
    handleGalleryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeGalleryImage: (index: number) => void;
    mode: "add" | "edit" | "view";
}

export function VenueForm({
    initialData,
    onSubmit,
    isSubmitting,
    facilities,
    thumbnailPreview,
    setThumbnailPreview,
    galleryPreviews,
    handleGalleryChange,
    removeGalleryImage,
    mode
}: VenueFormProps) {
    const isViewOnly = mode === "view";

    const { register, handleSubmit, control, reset, watch, setValue, formState: { errors, isValid } } = useForm<VenueFormValues>({
        defaultValues: {
            name: "",
            type: "hall",
            capacity: "",
            location: "",
            status: "available",
            features: [],
        },
        mode: "onChange"
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    useEffect(() => {
        if (!isViewOnly) {
            register("features", {
                validate: (value) => (value?.length ?? 0) > 0 || "At least one venue feature is required",
            });
        }
    }, [isViewOnly, register]);

    const watchThumbnail = watch("thumbnail");
    const selectedFeatures = watch("features") || [];

    useEffect(() => {
        if (!isViewOnly && watchThumbnail && watchThumbnail.length > 0) {
            const file = watchThumbnail[0];
            if (file instanceof File) {
                const url = URL.createObjectURL(file);
                setThumbnailPreview(url);
                return () => URL.revokeObjectURL(url);
            }
        }
    }, [watchThumbnail, setThumbnailPreview, isViewOnly]);

    const toggleFeature = (id: string) => {
        if (isViewOnly) return;
        const current = [...selectedFeatures];
        const index = current.indexOf(id);
        index > -1 ? current.splice(index, 1) : current.push(id);
        setValue("features", current, { shouldValidate: true });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                    <div className="bg-[#001e40] p-4 text-white flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-blue-400" />
                        <span className="font-semibold uppercase tracking-wider text-xs text-blue-100">
                            {isViewOnly ? "Venue Details" : "Venue Information"}
                        </span>
                    </div>

                    <div className="p-6 md:p-8 space-y-6">
                        {/* Venue Name */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Venue Name</Label>
                            {isViewOnly ? (
                                <p className="text-sm font-semibold text-slate-700 h-11 flex items-center px-4 bg-slate-50 rounded-lg border">{watch("name")}</p>
                            ) : (
                                <InputGroup className={errors.name ? 'border-destructive' : ''}>
                                    <InputGroupAddon><Building2 className="h-4 w-4" /></InputGroupAddon>
                                    <InputGroupInput
                                        placeholder="Admiral Dele Ezeoba Hall"
                                        {...register("name", {
                                            required: "Venue name is required",
                                            minLength: { value: 3, message: "Venue name must be at least 3 characters long" },
                                        })}
                                    />
                                </InputGroup>
                            )}
                            {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
                        </div>

                        <div className={cn("grid grid-cols-1 gap-6", mode !== "add" ? "md:grid-cols-3" : "md:grid-cols-2")}>
                            {/* Type */}
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Type</Label>
                                {isViewOnly ? (
                                    <p className="text-sm font-semibold text-slate-700 h-11 flex items-center px-4 bg-slate-50 rounded-lg border capitalize">{watch("type")}</p>
                                ) : (
                                    <Controller name="type" control={control} render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className={cn("h-10! w-full", errors.type && "border-destructive")}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="hall">Hall</SelectItem>
                                                <SelectItem value="auditorium">Auditorium</SelectItem>
                                                <SelectItem value="lab">Lab</SelectItem>
                                                <SelectItem value="classroom">Classroom</SelectItem>
                                                <SelectItem value="outdoor">Outdoor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )} />
                                )}
                                {errors.type && <p className="text-xs text-red-500 font-medium">{errors.type.message}</p>}
                            </div>

                            {/* Capacity */}
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Capacity</Label>
                                {isViewOnly ? (
                                    <p className="text-sm font-semibold text-slate-700 h-11 flex items-center px-4 bg-slate-50 rounded-lg border">{watch("capacity")} Guests</p>
                                ) : (
                                    <InputGroup className={errors.capacity ? 'border-destructive' : ''}>
                                        <InputGroupAddon><Users className="h-4 w-4" /></InputGroupAddon>
                                        <InputGroupInput
                                            type="number"
                                            {...register("capacity", {
                                                required: "Capacity is required",
                                                min: { value: 0, message: "Capacity cannot be negative" },
                                                validate: (value) =>
                                                    Number.isInteger(Number(value)) || "Capacity must be a whole number",
                                            })}
                                        />
                                    </InputGroup>
                                )}
                                {errors.capacity && <p className="text-xs text-red-500 font-medium">{errors.capacity.message}</p>}
                            </div>

                            {/* Status — shown in Edit and View only */}
                            {mode !== "add" && (
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Status</Label>
                                    {isViewOnly ? (
                                        <p className="text-sm font-semibold text-slate-700 h-11 flex items-center px-4 bg-slate-50 rounded-lg border capitalize">{watch("status")}</p>
                                    ) : (
                                        <Controller name="status" control={control} render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className={cn("h-11 w-full", errors.status && "border-destructive")}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="available">Available</SelectItem>
                                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                                    <SelectItem value="occupied">Occupied</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )} />
                                    )}
                                    {errors.status && <p className="text-xs text-red-500 font-medium">{errors.status.message}</p>}
                                </div>
                            )}
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Location</Label>
                            {isViewOnly ? (
                                <p className="text-sm font-semibold text-slate-700 h-11 flex items-center px-4 bg-slate-50 rounded-lg border">{watch("location")}</p>
                            ) : (
                                <InputGroup className={errors.location ? 'border-destructive' : ''}>
                                    <InputGroupAddon><MapPin className="h-4 w-4" /></InputGroupAddon>
                                    <InputGroupInput
                                        {...register("location", {
                                            required: "Location description is required",
                                            minLength: { value: 5, message: "Please provide a more detailed location description" },
                                        })}
                                    />
                                </InputGroup>
                            )}
                            {errors.location && <p className="text-xs text-red-500 font-medium">{errors.location.message}</p>}
                        </div>

                        {/* Facilities */}
                        <div className="space-y-4">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Facilities</Label>
                            <div className="flex flex-wrap gap-2">
                                {facilities?.map((f) => {
                                    const isSelected = selectedFeatures.includes(f.id.toString());
                                    if (isViewOnly && !isSelected) return null;

                                    return (
                                        <button
                                            key={f.id}
                                            type="button"
                                            onClick={() => toggleFeature(f.id.toString())}
                                            disabled={isViewOnly}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-bold transition-all",
                                                isSelected
                                                    ? "bg-[#001e40] text-white border-[#001e40]"
                                                    : "bg-slate-50 text-slate-600 border-slate-200",
                                                isViewOnly && "cursor-default"
                                            )}
                                        >
                                            {isSelected ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                                            {f.name}
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.features && <p className="text-xs text-red-500 font-medium">{errors.features.message}</p>}
                        </div>
                    </div>
                </div>

                {!isViewOnly && (
                    <Button
                        type="submit"
                        className="w-full bg-[#001e40] py-7 font-bold uppercase tracking-widest shadow-lg"
                        disabled={isSubmitting || !isValid}
                    >
                        {isSubmitting
                            ? <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            : mode === "add" ? "Register Venue" : "Save Changes"
                        }
                    </Button>
                )}
            </div>

            <div className="space-y-6">
                {/* Cover Image */}
                <div className="bg-white rounded-2xl border shadow-sm p-6">
                    <Label className="text-[10px] font-bold uppercase tracking-widest mb-4 block text-[#001e40]">Cover Image</Label>
                    <div className={cn(
                        "relative border-2 border-dashed rounded-xl h-52 flex items-center justify-center overflow-hidden",
                        isViewOnly && "border-solid bg-slate-50"
                    )}>
                        {thumbnailPreview ? (
                            <img src={thumbnailPreview} className="w-full h-full object-cover" alt="Cover" />
                        ) : (
                            <ImageIcon className="h-10 w-10 text-slate-300" />
                        )}
                        {!isViewOnly && (
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                {...register("thumbnail")}
                            />
                        )}
                    </div>
                </div>

                {/* Gallery */}
                <div className="bg-white rounded-2xl border shadow-sm p-6">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40] mb-4 block">Gallery</Label>
                    {!isViewOnly && (
                        <div className="relative border-2 border-dashed rounded-xl p-6 text-center hover:bg-slate-50 cursor-pointer mb-4">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleGalleryChange}
                            />
                            <Plus className="mx-auto h-6 w-6 text-slate-400" />
                            <p className="text-xs text-slate-500 mt-2 font-medium">Add Photos</p>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                        {galleryPreviews.map((url, i) => (
                            <div key={i} className="aspect-square rounded-lg overflow-hidden border relative group">
                                <img src={url} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                                {!isViewOnly && (
                                    <button
                                        type="button"
                                        onClick={() => removeGalleryImage(i)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </form>
    );
}