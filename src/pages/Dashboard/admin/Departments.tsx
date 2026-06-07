import { useState, type FormEvent } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCreateDepartment, useDepartments } from "@/hooks/useDepartment";
import { useFaculties } from "@/hooks/useFaculty";
import type { Department, DepartmentType } from "@/types/department";

const departmentTypes: DepartmentType[] = [
  "Academic",
  "Administrative",
  "Student Union",
  "Support Unit",
  "Research Unit",
];

type FacultyOption = {
  id: number;
  name: string;
};

export default function Departments() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState<DepartmentType>("Academic");
  const [facultyId, setFacultyId] = useState<string>("none");

  const { data, isLoading, isError } = useDepartments({ limit: 100 });
  const { data: facultiesData } = useFaculties();
  const createDepartment = useCreateDepartment();

  const departments = data?.departments ?? [];
  const faculties = (facultiesData?.data ?? []) as FacultyOption[];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await createDepartment.mutateAsync({
        name,
        code: code.toUpperCase(),
        type,
        facultyId: facultyId === "none" ? undefined : Number(facultyId),
      });
      setName("");
      setCode("");
      setType("Academic");
      setFacultyId("none");
      toast.success("Department added");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not add department");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7b5800]">
          Academic Structure
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#001e40]">
          Departments
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Department</CardTitle>
          <CardDescription>Create departments for academic, administrative, and support units.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-[1fr_140px_180px_1fr_auto] lg:items-end">
            <div className="space-y-1.5">
              <Label htmlFor="department-name">Department Name</Label>
              <Input id="department-name" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="department-code">Code</Label>
              <Input id="department-code" value={code} onChange={(event) => setCode(event.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as DepartmentType)}>
                <SelectTrigger className="h-10! w-full bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departmentTypes.map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Faculty</Label>
              <Select value={facultyId} onValueChange={setFacultyId}>
                <SelectTrigger className="h-10! w-full bg-white">
                  <SelectValue placeholder="No faculty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No faculty</SelectItem>
                  {faculties.map((faculty) => (
                    <SelectItem key={faculty.id} value={String(faculty.id)}>{faculty.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={createDepartment.isPending}>
              {createDepartment.isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Department Registry</CardTitle>
          <CardDescription>{departments.length} departments loaded.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Faculty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Loading departments...
                  </TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-red-600">
                    Could not load departments.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && departments.map((department: Department) => (
                <TableRow key={department.id}>
                  <TableCell className="font-semibold text-[#001e40]">{department.name}</TableCell>
                  <TableCell>{department.code}</TableCell>
                  <TableCell>{department.type}</TableCell>
                  <TableCell>{department.faculty?.name ?? "No faculty"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
