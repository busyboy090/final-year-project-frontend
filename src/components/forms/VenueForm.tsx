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

interface VenueFormProps {
    initialData?: Partial<VenueFormValues>;
    onSubmit: (values: VenueFormValues) => void;
    isSubmitting: boolean;
    facilities: any[];
    thumbnailPreview: string | null;
    setThumbnailPreview: (url: string | null) => void;
    galleryPreviews: string[];
    handleGalleryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeGalleryImage: (index: number) => void;
    mode: "add" | "edit";
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
    const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm<VenueFormValues>({
        defaultValues: {
            name: "",
            type: "hall",
            capacity: "",
            location: "",
            status: "available",
            features: [],
        }
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const watchThumbnail = watch("thumbnail");
    const selectedFeatures = watch("features") || [];

    useEffect(() => {
        if (watchThumbnail && watchThumbnail.length > 0) {
            const file = watchThumbnail[0];
            if (file instanceof File) {
                const url = URL.createObjectURL(file);
                setThumbnailPreview(url);
                return () => URL.revokeObjectURL(url);
            }
        }
    }, [watchThumbnail, setThumbnailPreview]);

    const toggleFeature = (id: string) => {
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
                        <span className="font-semibold uppercase tracking-wider text-xs text-blue-100">Venue Information</span>
                    </div>

                    <div className="p-6 md:p-8 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Venue Name</Label>
                            <InputGroup className={errors.name ? 'border-destructive' : ''}>
                                <InputGroupAddon><Building2 className="h-4 w-4" /></InputGroupAddon>
                                <InputGroupInput placeholder="Admiral Dele Ezeoba Hall" {...register("name", { required: "Required" })} />
                            </InputGroup>
                        </div>

                        <div className={cn("grid grid-cols-1 gap-6", mode === "edit" ? "md:grid-cols-3" : "md:grid-cols-2")}>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Type</Label>
                                <Controller name="type" control={control} render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="h-11 w-full"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hall">Hall</SelectItem>
                                            <SelectItem value="auditorium">Auditorium</SelectItem>
                                            <SelectItem value="lab">Lab</SelectItem>
                                            <SelectItem value="classroom">Classroom</SelectItem>
                                            <SelectItem value="outdoor">Outdoor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )} />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Capacity</Label>
                                <InputGroup>
                                    <InputGroupAddon><Users className="h-4 w-full" /></InputGroupAddon>
                                    <InputGroupInput type="number" {...register("capacity", { required: true })} />
                                </InputGroup>
                            </div>

                            {mode === "edit" && (
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Status</Label>
                                    <Controller name="status" control={control} render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="h-11 w-full"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="available">Available</SelectItem>
                                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                                <SelectItem value="occupied">Occupied</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )} />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Location</Label>
                            <InputGroup>
                                <InputGroupAddon><MapPin className="h-4 w-4" /></InputGroupAddon>
                                <InputGroupInput {...register("location", { required: true })} />
                            </InputGroup>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">Facilities</Label>
                            <div className="flex flex-wrap gap-2">
                                {facilities?.map((f: any) => (
                                    <button key={f.id} type="button" onClick={() => toggleFeature(f.id.toString())}
                                        className={cn("flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-bold transition-all",
                                            selectedFeatures.includes(f.id.toString()) ? "bg-[#001e40] text-white" : "bg-slate-50 text-slate-600")}>
                                        {selectedFeatures.includes(f.id.toString()) ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                                        {f.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <Button type="submit" className="w-full bg-[#001e40] py-7 font-bold uppercase tracking-widest shadow-lg" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : mode === "add" ? "Register Venue" : "Save Changes"}
                </Button>
            </div>

            <div className="space-y-6">
                <div className="bg-white rounded-2xl border shadow-sm p-6">
                    <Label className="text-[10px] font-bold uppercase tracking-widest mb-4 block text-[#001e40]">Cover Image</Label>
                    <div className="relative border-2 border-dashed rounded-xl h-52 flex items-center justify-center overflow-hidden">
                        {thumbnailPreview ? <img src={thumbnailPreview} className="w-full h-full object-cover" /> : <ImageIcon className="h-10 w-10 text-slate-300" />}
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" {...register("thumbnail")} />
                    </div>
                </div>

                <div className="bg-white rounded-2xl border shadow-sm p-6">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40] mb-4 block">Gallery</Label>
                    <div className="relative border-2 border-dashed rounded-xl p-6 text-center hover:bg-slate-50 cursor-pointer">
                        <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleGalleryChange} />
                        <Plus className="mx-auto h-6 w-6 text-slate-400" />
                        <p className="text-xs text-slate-500 mt-2 font-medium">Add Photos</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {galleryPreviews.map((url, i) => (
                            <div key={i} className="aspect-square rounded-lg overflow-hidden border relative group">
                                <img src={url} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeGalleryImage(i)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3 w-3" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </form>
    );
}