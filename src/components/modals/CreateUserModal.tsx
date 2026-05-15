import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateUserForm } from "@/components/forms/CreateUserForm";

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserModal({ open, onOpenChange }: CreateUserModalProps) {
  const handleSuccess = () => {
    // Close modal after successful creation
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="overflow-y-auto border-none shadow-2xl transition-all duration-300
                   w-[95vw] 
                   sm:max-w-137.5 
                   md:max-w-187.5
                   lg:max-w-212.5
                   max-h-[90dvh] md:max-h-125
                   p-6 md:p-10
                  "
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#001e40]">
            Create New User
          </DialogTitle>
          <p className="text-sm text-slate-500 mt-2">
            Add a new user to the registry and assign role. They'll receive an
            email to set their password.
          </p>
        </DialogHeader>
        <div className="py-6">
          <CreateUserForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
