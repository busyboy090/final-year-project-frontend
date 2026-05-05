import { useState, useCallback } from "react";

export function useVenueMedia() {
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    const handleGalleryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            // Add new files to the list
            setGalleryFiles((prev) => [...prev, ...newFiles]);
            // Create local previews for new files
            const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
            setGalleryPreviews((prev) => [...prev, ...newPreviews]);
        }
    }, []);

    const removeGalleryImage = useCallback((index: number) => {
        // Revoke the URL to prevent memory leaks if it was a local blob
        if (galleryPreviews[index].startsWith('blob:')) {
            URL.revokeObjectURL(galleryPreviews[index]);
        }
        setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
        setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    }, [galleryPreviews]);

    return {
        thumbnailPreview,
        setThumbnailPreview,
        galleryFiles,
        galleryPreviews,
        setGalleryFiles,
        setGalleryPreviews, // Needed for the Edit Page fetch
        handleGalleryChange,
        removeGalleryImage,
    };
}