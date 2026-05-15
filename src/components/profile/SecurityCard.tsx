import { BellRing } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { apiClient as api } from "@/apis/axios";
import useUser from "@/hooks/useUser";

function SecurityCard() {
  const { profile, updateLocalProfile } = useUser();

  const handleToggle2FA = async (checked: boolean) => {
    try {
      await api.patch("/v1/auth/2fa-toggle", { enabled: checked });
      updateLocalProfile({ ...profile, two_factor_enabled: checked });
      toast.success(`2FA ${checked ? "enabled" : "disabled"}`);
    } catch {
      toast.error("Failed to update 2FA settings");
    }
  };

  return (
    <Card className="bg-[#001e40] text-white border-none shadow-xl" >
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BellRing className="w-5 h-5 text-[#fec657]" /> Security Access
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-bold">Two-Factor Auth</Label>
            <p className="text-[11px] text-blue-200/70">Secure login toggle</p>
          </div>
          <Switch
            className="data-[state=checked]:bg-amber-500"
            checked={profile?.two_factor_enabled || false}
            onCheckedChange={handleToggle2FA}
          />
        </div>
        <Separator className="bg-white/10" />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-bold">In-App Alerts</Label>
            <p className="text-[11px] text-blue-200/70">Real-time system notices</p>
          </div>
          <Switch className="data-[state=checked]:bg-amber-500" defaultChecked />
        </div>
      </CardContent>
    </Card >
  );
}

export default SecurityCard;