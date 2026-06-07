import { useState, type FormEvent } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useCreateFacility, useFacilities } from "@/hooks/useFacility";

type Facility = {
  id: number;
  name: string;
  description?: string | null;
  status?: string;
};

export default function Facilities() {
  const { data, isLoading, isError } = useFacilities();
  const createFacility = useCreateFacility();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const facilities = (data ?? []) as Facility[];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await createFacility.mutateAsync({ name, description });
      setName("");
      setDescription("");
      toast.success("Venue facility added");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not add venue facility");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7b5800]">
          Venue Resources
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#001e40]">
          Venue Facilities
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Venue Facility</CardTitle>
          <CardDescription>Create reusable facilities that can be attached to venues.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-[1fr_2fr_auto] lg:items-end">
            <div className="space-y-1.5">
              <Label htmlFor="facility-name">Name</Label>
              <Input id="facility-name" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="facility-description">Description</Label>
              <Textarea id="facility-description" value={description} onChange={(event) => setDescription(event.target.value)} />
            </div>
            <Button type="submit" disabled={createFacility.isPending}>
              {createFacility.isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Facility Registry</CardTitle>
          <CardDescription>{facilities.length} reusable venue facilities available.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    Loading venue facilities...
                  </TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-red-600">
                    Could not load venue facilities.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && facilities.map((facility) => (
                <TableRow key={facility.id}>
                  <TableCell className="font-semibold text-[#001e40]">{facility.name}</TableCell>
                  <TableCell>{facility.description || "No description"}</TableCell>
                  <TableCell>{facility.status ?? "active"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
