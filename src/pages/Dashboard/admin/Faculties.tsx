import { useState, type FormEvent } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCreateFaculty, useFaculties } from "@/hooks/useFaculty";

type Faculty = {
  id: number;
  name: string;
  code: string;
  departments?: { id: number; name: string }[];
};

export default function Faculties() {
  const { data, isLoading, isError } = useFaculties();
  const createFaculty = useCreateFaculty();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const faculties = (data?.data ?? []) as Faculty[];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await createFaculty.mutateAsync({ name, code: code.toUpperCase() });
      setName("");
      setCode("");
      toast.success("Faculty added");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not add faculty");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7b5800]">
          Academic Structure
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#001e40]">
          Faculties
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Faculty</CardTitle>
          <CardDescription>Create a top-level faculty used by departments, staff profiles, and reporting filters.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_160px_auto] md:items-end">
            <div className="space-y-1.5">
              <Label htmlFor="faculty-name">Faculty Name</Label>
              <Input id="faculty-name" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="faculty-code">Code</Label>
              <Input id="faculty-code" value={code} onChange={(event) => setCode(event.target.value)} required />
            </div>
            <Button type="submit" disabled={createFaculty.isPending}>
              {createFaculty.isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Faculty Registry</CardTitle>
          <CardDescription>{faculties.length} faculties currently available.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead className="text-right">Departments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    Loading faculties...
                  </TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-red-600">
                    Could not load faculties.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && faculties.map((faculty) => (
                <TableRow key={faculty.id}>
                  <TableCell className="font-semibold text-[#001e40]">{faculty.name}</TableCell>
                  <TableCell>{faculty.code}</TableCell>
                  <TableCell className="text-right">{faculty.departments?.length ?? 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
