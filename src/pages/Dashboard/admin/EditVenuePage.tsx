import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiClient as api } from "@/apis/axios";
import { useVenues } from "@/hooks/useVenue";
import { useFacilities } from "@/hooks/useFacility";
import { useVenueMedia } from "@/hooks/useVenueMedia";
import { VenueForm, type VenueFormValues } from "@/components/forms/VenueForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditVenuePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { refetch: refetchVenues } = useVenues();
    const { data: facilities } = useFacilities();

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [venueData, setVenueData] = useState<Partial<VenueFormValues> | null>(null);

    const media = useVenueMedia();

    useEffect(() => {
        const fetchVenue = async () => {
            try {
                const { data } = await api.get(`/v1/venues/${id}`);
                const venue = data.data;

                setVenueData({
                    name: venue.name,
                    type: venue.type,
                    capacity: venue.capacity,
                    location: venue.location,
                    status: venue.status,
                    features: venue.venueFacilities?.map((f: any) => f.facility_id.toString()) || []
                });

                media.setThumbnailPreview(venue.thumbnail);
                media.setGalleryPreviews(venue.images || []);
                setIsLoading(false);
            } catch (err) {
                toast.error("Venue not found");
                navigate("/dashboard/admin/venues");
            }
        };
        fetchVenue();
    }, [id]);

    const handleUpdate = async (values: VenueFormValues) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (key !== 'features' && key !== 'thumbnail') {
                    formData.append(key, value.toString());
                }
            });

            values.features.forEach((fid) => formData.append("features", fid));
            if (values.thumbnail?.[0]) formData.append("thumbnail", values.thumbnail[0]);
            media.galleryFiles.forEach((file) => formData.append("images", file));

            await api.put(`/v1/venues/${id}`, formData);

            if (refetchVenues) refetchVenues();
            toast.success("Venue updated successfully");
            navigate("/dashboard/admin/venues");
        } catch (error: any) {
            toast.error("Failed to update venue");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="h-96 flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-slate-500 font-medium">Retrieving Venue Data...</p>
    </div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="rounded-full shadow-sm">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#001e40]">Edit Venue</h1>
                        <p className="text-slate-500 text-sm">Update infrastructure details for the ADUN registry.</p>
                    </div>
                </div>
                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100">ID: {id}</Badge>
            </div>

            <VenueForm
                mode="edit"
                initialData={venueData || undefined}
                facilities={facilities || []}
                onSubmit={handleUpdate}
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
