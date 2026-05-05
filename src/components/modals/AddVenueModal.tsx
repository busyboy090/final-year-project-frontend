import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Building2,
  Users,
  MapPin,
  ImageIcon,
  Layers,
  Plus
} from "lucide-react";
import { toast } from "sonner";

interface VenueFormValues {
  name: string;
  type: "hall" | "outdoor" | "classroom" | "auditorium" | "lab";
  capacity: number;
  location: string;
  thumbnail: File | null;
  images?: FileList | null;
}

function AddVenueModal({ onClose }: { onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<VenueFormValues>({
    defaultValues: {
      name: "",
      type: "hall",
      capacity: 0,
      location: "",
    }
  });

  const onSubmit = async (values: VenueFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("type", values.type);
      formData.append("capacity", values.capacity.toString());
      formData.append("location", values.location);
      
      if (values.thumbnail) {
        formData.append("thumbnail", values.thumbnail);
      }

      if (values.images) {
        Array.from(values.images).forEach((file) => {
          formData.append("images", file);
        });
      }

      const response = await fetch("/api/v1/venues", {
        method: "POST",
        body: formData, 
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Venue added successfully to ADUN registry!");
        onClose();
        reset();
      } else {
        toast.error(result.message || "Failed to add venue");
      }
    } catch (error) {
      toast.error("Connection failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogTrigger asChild>
        <Button className="bg-[#001e40] hover:bg-[#002d61] text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Venue
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 overflow-hidden border-none shadow-2xl w-[95vw] sm:max-w-[600px] max-h-[90vh]">
        
        {/* Header Section */}
        <div className="bg-[#001e40] p-6 text-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-500/30">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Add University Venue</DialogTitle>
              <DialogDescription className="text-slate-400 text-sm">
                Register a new facility in the ADUN infrastructure.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 bg-white">
          
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
              Venue Name
            </Label>
            <InputGroup>
              <InputGroupAddon><Building2 className="h-4 w-4" /></InputGroupAddon>
              <InputGroupInput
                placeholder="e.g. Admiral Dele Ezeoba Hall"
                {...register("name", { required: "Venue name is required" })}
              />
            </InputGroup>
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                Category
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-slate-400" />
                        <SelectValue placeholder="Select type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hall">Hall</SelectItem>
                      <SelectItem value="auditorium">Auditorium</SelectItem>
                      <SelectItem value="lab">Lab</SelectItem>
                      <SelectItem value="classroom">Classroom</SelectItem>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
                Capacity
              </Label>
              <InputGroup>
                <InputGroupAddon><Users className="h-4 w-4" /></InputGroupAddon>
                <InputGroupInput
                  type="number"
                  placeholder="500"
                  {...register("capacity", { required: "Capacity required", min: 1 })}
                />
              </InputGroup>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
              Location
            </Label>
            <InputGroup>
              <InputGroupAddon><MapPin className="h-4 w-4" /></InputGroupAddon>
              <InputGroupInput
                placeholder="e.g. Main Campus, West Wing"
                {...register("location", { required: "Location is required" })}
              />
            </InputGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
              Thumbnail Photo
            </Label>
            <InputGroup>
              <InputGroupAddon><ImageIcon className="h-4 w-4" /></InputGroupAddon>
              <InputGroupInput
                type="file"
                accept="image/*"
                className="cursor-pointer file:hidden pt-2"
                {...register("thumbnail")}
              />
              {errors.thumbnail && <p className="text-xs text-destructive">{errors.thumbnail.message}</p>}
            </InputGroup>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-[#001e40] hover:bg-[#002d61] text-white py-6 font-bold uppercase tracking-widest shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing Media...
                </>
              ) : (
                "Create Venue Record"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddVenueModal