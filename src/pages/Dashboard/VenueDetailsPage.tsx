import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VenueForm, type VenueFormValues } from "@/components/forms/VenueForm";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient as api } from "@/apis/axios";
import { useFacilities } from "@/hooks/useFacility";

export default function VenueViewPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: facilities } = useFacilities()

    const [initialData, setInitialData] = useState<Partial<VenueFormValues> | undefined>(undefined);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadVenueData() {
            try {
                setIsLoading(true);

                const { data: { data: venueData } } = await api.get(`/v1/venues/${id}`)

                // Transform backend data to match VenueFormValues
                // Maps 'venueFacilities' objects to a simple string array of IDs
                const transformedData: Partial<VenueFormValues> = {
                    name: venueData.name,
                    type: venueData.type,
                    capacity: venueData.capacity,
                    location: venueData.location,
                    status: venueData.status,
                    features: venueData.venueFacilities?.map((f: any) => f.facility_id.toString()) || [],
                };

                setInitialData(transformedData);
                setThumbnailPreview(venueData.thumbnail);

                // Map the 'images' array to a string array of URLs
                setGalleryPreviews(venueData.images?.map((img: any) => img.url || img) || []);

            } catch (error) {
                toast.error("Could not load venue details.");
                navigate("/dashboard/admin/venues");
            } finally {
                setIsLoading(false);
            }
        }

        if (id) loadVenueData();
    }, [id, navigate]);

    if (isLoading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-[#001e40]" />
                <p className="text-slate-500 font-medium italic">Retrieving venue records...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={() => navigate("/dashboard/admin/venues")} className="text-slate-600">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
            </Button>


            {/* The Unified Form in View Mode */}
            <VenueForm
                mode="view"
                initialData={initialData}
                facilities={facilities}
                thumbnailPreview={thumbnailPreview}
                setThumbnailPreview={setThumbnailPreview}
                galleryPreviews={galleryPreviews}
                // No-op functions for view mode requirements
                onSubmit={() => { }}
                isSubmitting={false}
                handleGalleryChange={() => { }}
                removeGalleryImage={() => { }}
            />
        </div>
    );
}