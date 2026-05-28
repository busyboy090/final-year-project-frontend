import {
    Building2, Users,
  } from "lucide-react";
  import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
  import { Separator } from "@/components/ui/separator";
  import { Badge } from "@/components/ui/badge";
  import { Label } from "@/components/ui/label";
  import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
  import useUser from "@/hooks/useUser";
  
  function DetailRow({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType;
    label: string;
    value?: string | null;
  }) {
    return (
      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-widest text-[#001e40]">
          {label}
        </Label>
        <InputGroup>
          <InputGroupAddon>
            <Icon className="h-4 w-4 text-[#001e40]/40" />
          </InputGroupAddon>
          <InputGroupInput
            value={value ?? ""}
            placeholder="Not provided"
            disabled
            className="bg-[#f6faff] border-none disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </InputGroup>
      </div>
    );
  }
  
  function EventOrganiserProfileCard() {
    const { profile } = useUser();
  
    const organiserProfile = profile;
  
    return (
      <Card className="border-none shadow-sm bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="text-xl font-bold text-[#001e40]">
                Organiser Information
              </CardTitle>
              <CardDescription>
                Your official university event organiser details.
              </CardDescription>
            </div>
            <Badge
              variant="secondary"
              className="shrink-0 bg-[#f0f5ff] text-[#001e40] border-none text-[10px] font-bold uppercase tracking-widest"
            >
              Event Organiser
            </Badge>
          </div>
        </CardHeader>
  
        <CardContent className="space-y-6">
          <Separator />
    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailRow
              icon={Users}
              label="Organisation"
              value={organiserProfile?.organisation?.name}
            />
            <DetailRow
              icon={Building2}
              label="Department / Unit"
              value={organiserProfile?.organisation?.department?.name}
            />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  export default EventOrganiserProfileCard;