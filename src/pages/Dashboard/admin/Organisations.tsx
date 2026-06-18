import { useState } from "react";
import { Building2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDepartments } from "@/hooks/useDepartment";
import { useFaculties } from "@/hooks/useFaculty";
import {
  useCreateOrganisation,
  useDeleteOrganisation,
  useOrganisations,
  useUpdateOrganisation,
} from "@/hooks/useOrganisation";
import type { Organisation } from "@/types/organisation";

const emptyForm = {
  name: "",
  faculty_id: "",
  department_id: "",
};

export default function Organisations() {
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Organisation | null>(null);
  const { data: organisationsResponse, isLoading } = useOrganisations({ limit: 100 });
  const { data: facultiesResponse } = useFaculties();
  const { data: departmentsResponse } = useDepartments({ limit: 100 });
  const createOrganisation = useCreateOrganisation();
  const updateOrganisation = useUpdateOrganisation();
  const deleteOrganisation = useDeleteOrganisation();

  const organisations = organisationsResponse?.data ?? [];
  const faculties = facultiesResponse?.data ?? facultiesResponse ?? [];
  const departments = departmentsResponse?.departments ?? [];

  const resetForm = () => {
    setForm(emptyForm);
    setEditing(null);
  };

  const hydrateForm = (organisation: Organisation) => {
    setEditing(organisation);
    setForm({
      name: organisation.name,
      faculty_id: organisation.faculty_id ? String(organisation.faculty_id) : "",
      department_id: organisation.department_id ? String(organisation.department_id) : "",
    });
  };

  const buildPayload = () => ({
    name: form.name.trim(),
    faculty_id: form.faculty_id ? Number(form.faculty_id) : undefined,
    department_id: form.department_id ? Number(form.department_id) : undefined,
  });

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Organisation name is required");
      return;
    }

    try {
      if (editing) {
        await updateOrganisation.mutateAsync({ id: editing.id, payload: buildPayload() });
        toast.success("Organisation updated");
      } else {
        await createOrganisation.mutateAsync(buildPayload());
        toast.success("Organisation created");
      }
      resetForm();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not save organisation");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteOrganisation.mutateAsync(id);
      toast.success("Organisation deleted");
      if (editing?.id === id) resetForm();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not delete organisation");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[#7b5800] text-xs uppercase tracking-widest font-bold mb-2">
          Institutional Registry
        </p>
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#001e40]">
          Organisations
        </h1>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="size-4" />
              {editing ? "Edit Organisation" : "Add Organisation"}
            </CardTitle>
            <CardDescription>Manage event organiser affiliation targets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Student Affairs"
              />
            </div>
            <div className="space-y-2">
              <Label>Faculty</Label>
              <Select
                value={form.faculty_id || "none"}
                onValueChange={(value) => setForm((prev) => ({ ...prev, faculty_id: value === "none" ? "" : value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="No faculty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No faculty</SelectItem>
                  {faculties.map((faculty: any) => (
                    <SelectItem key={faculty.id} value={String(faculty.id)}>
                      {faculty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select
                value={form.department_id || "none"}
                onValueChange={(value) => setForm((prev) => ({ ...prev, department_id: value === "none" ? "" : value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="No department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No department</SelectItem>
                  {departments.map((department: any) => (
                    <SelectItem key={department.id} value={String(department.id)}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleSave}
                disabled={createOrganisation.isPending || updateOrganisation.isPending}
                className="flex-1 bg-[#001e40] text-white hover:bg-[#003366]"
              >
                {editing ? "Save Changes" : "Create"}
              </Button>
              {editing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-12 lg:col-span-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="size-4" />
              Organisation List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Faculty</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">Loading organisations...</TableCell>
                  </TableRow>
                ) : organisations.map((organisation) => (
                  <TableRow key={organisation.id}>
                    <TableCell className="font-semibold text-[#001e40]">{organisation.name}</TableCell>
                    <TableCell>{organisation.faculty?.name ?? "-"}</TableCell>
                    <TableCell>{organisation.department?.name ?? "-"}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" size="icon" onClick={() => hydrateForm(organisation)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" className="text-red-700" onClick={() => handleDelete(organisation.id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
