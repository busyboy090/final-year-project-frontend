import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiClient as api } from "@/apis/axios";
import { useVenues } from "@/hooks/useVenue";
import { useFacilities } from "@/hooks/useFacility";
import { useVenueMedia } from "@/hooks/useVenueMedia";
import { VenueForm, type VenueFormValues } from "@/components/forms/VenueForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AddVenuePage() {
    const navigate = useNavigate();
    const { refetch: refetchVenues } = useVenues();
    const { data: facilities } = useFacilities({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const media = useVenueMedia();

    const handleAdd = async (values: VenueFormValues) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("type", values.type);
            formData.append("capacity", values.capacity.toString());
            formData.append("location", values.location);
            
            values.features.forEach((id) => formData.append("features", id));

            if (values.thumbnail?.[0]) {
                formData.append("thumbnail", values.thumbnail[0]);
            }

            media.galleryFiles.forEach((file) => formData.append("images", file));

            await api.post("/v1/venues", formData);
            
            if (refetchVenues) refetchVenues();
            toast.success("Venue added to ADUN registry!");
            navigate("/dashboard/admin/venues");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Registration failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center gap-4 border-b pb-6">
                <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="rounded-full shadow-sm">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#001e40]">Add New Venue</h1>
                    <p className="text-slate-500 text-sm font-medium">Register a new facility for ADUN-EMS.</p>
                </div>
            </div>

            <VenueForm 
                mode="add"
                facilities={facilities || []}
                onSubmit={handleAdd}
                isSubmitting={isSubmitting}
                thumbnailPreview={media.thumbnailPreview}
                setThumbnailPreview={media.setThumbnailPreview}
                galleryPreviews={media.galleryPreviews}
                handleGalleryChange={media.handleGalleryChange}
                removeGalleryImage={media.removeGalleryImage}
            />
        </div>
    );
}
