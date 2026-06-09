import { type FormEvent } from "react";
import { useSearchParams } from "react-router-dom"; // Or "next/navigation" depending on your framework
import { 
  Loader2, 
  Plus, 
  AlertCircle, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  GraduationCap, 
  BookOpen,
  Search as SearchIcon,
  FilterX
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDepartments } from "@/hooks/useDepartment";
import { useFaculties } from "@/hooks/useFaculty";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/apis/axios";
import type { Department, DepartmentType } from "@/types/department";
import { useDebounce } from "@/hooks/useDebounce";
import { useState } from "react";

type FacultyOption = {
  id: number;
  name: string;
};

const departmentTypes: DepartmentType[] = [
  "Academic",
  "Administrative",
  "Student Union",
  "Support Unit",
  "Research Unit",
];

export default function Departments() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // ── URL Search Param Mappings ──
  const filterSearch = searchParams.get("search") || "";
  const filterFaculty = searchParams.get("facultyId") || "all";
  const filterType = searchParams.get("type") || "all";
  const page = searchParams.get("page") || "1";

  // Helper to safely update individual search parameters without erasing others
  const updateSearchParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value || value === "all") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      // Reset to page 1 on filter changes to prevent empty data states
      if (key !== "page") next.delete("page");
      return next;
    });
  };

  // Debounce the search input text by 300ms
  const debouncedSearch = useDebounce(filterSearch, 300);

  // ── Queries for fetching data (Passing server-side search params) ──
  const { data, isLoading, isError } = useDepartments({
    search: debouncedSearch || undefined,
    type: filterType === "all" ? undefined : (filterType as DepartmentType),
    facultyId: filterFaculty === "all" ? undefined : filterFaculty === "none" ? undefined : Number(filterFaculty),
    page: Number(page),
  });
  
  const { data: facultiesData } = useFaculties();

  const departments = data?.departments ?? [];
  const faculties = (facultiesData?.data ?? []) as FacultyOption[];

  // ── Form State for creating new department ──
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState<DepartmentType>("Academic");
  const [facultyId, setFacultyId] = useState<string>("none");

  // ── State for inline editing tracking ──
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editType, setEditType] = useState<DepartmentType>("Academic");
  const [editFacultyId, setEditFacultyId] = useState<string>("none");

  // ── State for tracking target deletion modal ──
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);

  // ── Inline TanStack Query Mutations ──
  const createDepartmentMutation = useMutation({
    mutationFn: async (newDept: { name: string; code: string; type: DepartmentType; facultyId?: number }) => {
      const response = await apiClient.post("/v1/departments", newDept);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: async (updatedDept: { id: number; name: string; code: string; type: DepartmentType; facultyId?: number }) => {
      const response = await apiClient.patch(`/v1/departments/${updatedDept.id}`, {
        name: updatedDept.name,
        code: updatedDept.code,
        type: updatedDept.type,
        facultyId: updatedDept.facultyId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: async (deptId: number) => {
      const response = await apiClient.delete(`/v1/departments/${deptId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await createDepartmentMutation.mutateAsync({
        name,
        code: code.toUpperCase(),
        type,
        facultyId: facultyId === "none" ? undefined : Number(facultyId),
      });
      setName("");
      setCode("");
      setType("Academic");
      setFacultyId("none");
      toast.success("Department added successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not add department");
    }
  };

  const startEditing = (department: Department) => {
    setEditingId(department.id);
    setEditName(department.name);
    setEditCode(department.code);
    setEditType(department.type);
    setEditFacultyId(department.facultyId ? String(department.facultyId) : "none");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
    setEditCode("");
    setEditType("Academic");
    setEditFacultyId("none");
  };

  const handleSaveEdit = async (deptId: number) => {
    if (!editName.trim() || !editCode.trim()) {
      toast.error("Name and Code cannot be empty");
      return;
    }

    try {
      await updateDepartmentMutation.mutateAsync({
        id: deptId,
        name: editName,
        code: editCode.toUpperCase(),
        type: editType,
        facultyId: editFacultyId === "none" ? undefined : Number(editFacultyId),
      });
      setEditingId(null);
      toast.success("Department updated successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not update department");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteDepartmentMutation.mutateAsync(deleteTarget.id);
      toast.success("Department deleted successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not delete department");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="space-y-8">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
        <div className="flex items-start gap-4">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.25em] mb-1"
              style={{ color: "#c9a227" }}
            >
              Academic Structure
            </p>
            <h1
              className="text-[2rem] font-extrabold leading-none tracking-tight"
              style={{
                color: "#001e40",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.03em",
              }}
            >
              Departments
            </h1>
          </div>
        </div>

        {!isLoading && !isError && (
          <div
            className="flex items-center gap-3 rounded-xl px-5 py-3 border"
            style={{
              background: "#fff",
              borderColor: "#e3dfd5",
            }}
          >
            <BookOpen size={18} strokeWidth={1.5} style={{ color: "#c9a227" }} />
            <span className="text-sm font-semibold" style={{ color: "#001e40" }}>
              {departments.length}
              <span className="font-normal ml-1.5" style={{ color: "#64748b" }}>
                {departments.length === 1 ? "department" : "departments"} found
              </span>
            </span>
          </div>
        )}
      </div>

      {/* ── Add Department Form ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "#fff",
          border: "1px solid #e3dfd5",
          boxShadow: "0 1px 4px 0 rgba(0,30,64,0.06)",
        }}
      >
        <div
          className="flex items-center gap-3 px-6 py-4 border-b"
          style={{
            borderColor: "#e3dfd5",
            background: "#001e40",
          }}
        >
          <Plus size={16} className="text-[#c9a227]" strokeWidth={2} />
          <span className="text-sm font-bold uppercase tracking-widest text-white">
            Add New Department
          </span>
        </div>

        <div className="px-6 py-5">
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            Create departments for academic modules, administrative targets, and specialized university operational support units.
          </p>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-[1fr_140px_180px_1fr_auto] gap-4 items-end"
          >
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="department-name"
                className="text-[10.5px] font-extrabold uppercase tracking-widest px-0.5"
                style={{ color: "#001e40" }}
              >
                Department Name
              </Label>
              <Input
                id="department-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                placeholder="e.g. Computer Science"
                className="h-10 bg-[#f9f8f5] border-[#e3dfd5] text-sm focus-visible:ring-[#c9a227]/40 focus-visible:border-[#c9a227]"
                style={{ color: "#001e40" }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="department-code"
                className="text-[10.5px] font-extrabold uppercase tracking-widest px-0.5"
                style={{ color: "#001e40" }}
              >
                Code
              </Label>
              <Input
                id="department-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                required
                placeholder="e.g. CSC"
                className="h-10 bg-[#f9f8f5] border-[#e3dfd5] text-sm focus-visible:ring-[#c9a227]/40 focus-visible:border-[#c9a227]"
                style={{ color: "#001e40" }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-[10.5px] font-extrabold uppercase tracking-widest px-0.5" style={{ color: "#001e40" }}>
                Type
              </Label>
              <Select value={type} onValueChange={(value) => setType(value as DepartmentType)}>
                <SelectTrigger className="h-10! w-full bg-[#f9f8f5] border-[#e3dfd5] text-sm focus:ring-[#c9a227]/40 text-[#001e40]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departmentTypes.map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-[10.5px] font-extrabold uppercase tracking-widest px-0.5" style={{ color: "#001e40" }}>
                Faculty Mapping
              </Label>
              <Select value={facultyId} onValueChange={setFacultyId}>
                <SelectTrigger className="h-10! w-full bg-[#f9f8f5] border-[#e3dfd5] text-sm focus:ring-[#c9a227]/40 text-[#001e40]">
                  <SelectValue placeholder="No faculty alignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No faculty alignment</SelectItem>
                  {faculties.map((faculty) => (
                    <SelectItem key={faculty.id} value={String(faculty.id)}>{faculty.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={createDepartmentMutation.isPending}
              className="h-10 px-6 font-semibold text-sm gap-2 text-white"
              style={{
                background: createDepartmentMutation.isPending
                  ? "#334155"
                  : "linear-gradient(135deg, #001e40 0%, #002d5e 100%)",
                border: "none",
              }}
            >
              {createDepartmentMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              Add Dept
            </Button>
          </form>
        </div>
      </div>

      {/* ── Filter & Registry Box ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "#fff",
          border: "1px solid #e3dfd5",
          boxShadow: "0 1px 4px 0 rgba(0,30,64,0.06)",
        }}
      >
        <div className="px-6 py-4 border-b" style={{ borderColor: "#e3dfd5" }}>
          <h2 className="text-base font-bold tracking-tight" style={{ color: "#001e40" }}>
            Department Registry
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Structural distribution matrix across academic and auxiliary units
          </p>
        </div>

        {/* ── Filter Bars ── */}
        <div className="bg-[#faf9f6] p-6 border-b grid grid-cols-1 sm:grid-cols-[1fr_200px_180px_auto] gap-4 items-end" style={{ borderColor: "#f0ede4" }}>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-extrabold uppercase tracking-widest text-[#001e40]/70">
              Search Context
            </Label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                value={filterSearch}
                onChange={(e) => updateSearchParam("search", e.target.value)}
                placeholder="Filter by name or operational code..."
                className="pl-9 h-10 bg-white border-[#e3dfd5] text-sm focus-visible:ring-[#c9a227]/40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-extrabold uppercase tracking-widest text-[#001e40]/70">
              Faculty Filter
            </Label>
            <Select value={filterFaculty} onValueChange={(val) => updateSearchParam("facultyId", val)}>
              <SelectTrigger className="h-10! bg-white border-[#e3dfd5] text-sm focus:ring-[#c9a227]/40 text-[#001e40] w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Faculties</SelectItem>
                {faculties.map((f) => (
                  <SelectItem key={f.id} value={String(f.id)}>{f.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-extrabold uppercase tracking-widest text-[#001e40]/70">
              Type Filter
            </Label>
            <Select value={filterType} onValueChange={(val) => updateSearchParam("type", val)}>
              <SelectTrigger className="h-10! w-full bg-white border-[#e3dfd5] text-sm focus:ring-[#c9a227]/40 text-[#001e40]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {departmentTypes.map((item) => (
                  <SelectItem key={item} value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(filterSearch || filterFaculty !== "all" || filterType !== "all" || page !== "1") ? (
            <Button
              variant="ghost"
              onClick={handleClearFilters}
              className="h-10 px-4 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50/50 gap-2 border border-dashed border-red-200"
            >
              <FilterX className="size-4" />
              Reset Filters
            </Button>
          ) : (
            <div className="h-10 w-0 hidden sm:block" />
          )}
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="min-h-[280px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="animate-spin" size={32} style={{ color: "#001e40", opacity: 0.5 }} />
              <p className="text-sm font-medium text-slate-500">Loading department datasets…</p>
            </div>
          </div>
        )}

        {/* Error Handling */}
        {isError && !isLoading && (
          <div className="min-h-[280px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center rounded-full w-12 h-12 bg-red-50">
                <AlertCircle size={24} className="text-red-500" />
              </div>
              <p className="text-sm font-semibold text-red-600">Failed to sync network departments</p>
              <p className="text-xs text-slate-400">Please review API authorization or network gateway states.</p>
            </div>
          </div>
        )}

        {/* Main Data Layer */}
        {!isLoading && !isError && (
          <Table>
            <TableHeader>
              <TableRow className="border-b" style={{ background: "#f9f8f5", borderColor: "#e3dfd5" }}>
                <TableHead className="pl-6 py-3 text-[10.5px] font-extrabold uppercase tracking-widest" style={{ color: "#94928a" }}>
                  Department Name
                </TableHead>
                <TableHead className="py-3 text-[10.5px] font-extrabold uppercase tracking-widest w-[120px]" style={{ color: "#94928a" }}>
                  Code
                </TableHead>
                <TableHead className="py-3 text-[10.5px] font-extrabold uppercase tracking-widest w-[160px]" style={{ color: "#94928a" }}>
                  Type
                </TableHead>
                <TableHead className="py-3 text-[10.5px] font-extrabold uppercase tracking-widest" style={{ color: "#94928a" }}>
                  Assigned Faculty
                </TableHead>
                <TableHead className="pr-6 py-3 text-right text-[10.5px] font-extrabold uppercase tracking-widest w-[140px]" style={{ color: "#94928a" }}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="flex flex-col items-center justify-center gap-3 py-16">
                      <div className="flex items-center justify-center rounded-2xl w-14 h-14 bg-[#f0ede4]">
                        <GraduationCap size={26} strokeWidth={1.5} style={{ color: "#c9a227" }} />
                      </div>
                      <p className="text-sm font-semibold" style={{ color: "#001e40" }}>
                        No departments found
                      </p>
                      <p className="text-xs text-slate-400">
                        Try widening your keyword matrix or clearing constraints above.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((department: Department, index) => {
                  const isRowEditing = editingId === department.id;

                  return (
                    <TableRow
                      key={department.id}
                      className="border-b transition-colors"
                      style={{
                        borderColor: "#f0ede4",
                        background: index % 2 === 0 ? "#fff" : "#fdfcfa",
                      }}
                      onMouseEnter={(e) => {
                        if (!isRowEditing) (e.currentTarget as HTMLTableRowElement).style.background = "#f9f7f1";
                      }}
                      onMouseLeave={(e) => {
                        if (!isRowEditing) {
                          (e.currentTarget as HTMLTableRowElement).style.background =
                            index % 2 === 0 ? "#fff" : "#fdfcfa";
                        }
                      }}
                    >
                      {/* Name Cell */}
                      <TableCell className="py-3 pl-6">
                        <div className="flex items-center gap-3">
                          <div
                            className="shrink-0 rounded w-0.5 h-8"
                            style={{ background: "#c9a227", opacity: 0.7 }}
                          />
                          {isRowEditing ? (
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="h-9 bg-white border-[#e3dfd5] text-sm focus-visible:ring-[#c9a227]/40"
                            />
                          ) : (
                            <span className="font-semibold text-[0.9375rem] leading-snug" style={{ color: "#001e40" }}>
                              {department.name}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Code Cell */}
                      <TableCell className="py-3">
                        {isRowEditing ? (
                          <Input
                            value={editCode}
                            onChange={(e) => setEditCode(e.target.value)}
                            className="h-9 bg-white border-[#e3dfd5] text-sm uppercase focus-visible:ring-[#c9a227]/40 max-w-[90px]"
                          />
                        ) : (
                          <span className="inline-flex items-center text-xs font-bold tracking-widest uppercase">
                            {department.code}
                          </span>
                        )}
                      </TableCell>

                      {/* Type Cell */}
                      <TableCell className="py-3">
                        {isRowEditing ? (
                          <Select value={editType} onValueChange={(val) => setEditType(val as DepartmentType)}>
                            <SelectTrigger className="h-9 bg-white border-[#e3dfd5] text-xs focus:ring-[#c9a227]/40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {departmentTypes.map((item) => (
                                <SelectItem key={item} value={item}>{item}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-sm text-slate-600">{department.type}</span>
                        )}
                      </TableCell>

                      {/* Faculty alignment Cell */}
                      <TableCell className="py-3">
                        {isRowEditing ? (
                          <Select value={editFacultyId} onValueChange={setEditFacultyId}>
                            <SelectTrigger className="h-9 bg-white border-[#e3dfd5] text-xs focus:ring-[#c9a227]/40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No faculty alignment</SelectItem>
                              {faculties.map((f) => (
                                <SelectItem key={f.id} value={String(f.id)}>{f.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-sm font-medium text-slate-500">
                            {department.faculty?.name ?? "No faculty"}
                          </span>
                        )}
                      </TableCell>

                      {/* Action Cell */}
                      <TableCell className="py-3 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isRowEditing ? (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                disabled={updateDepartmentMutation.isPending}
                                onClick={() => handleSaveEdit(department.id)}
                                className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
                                title="Save changes"
                              >
                                {updateDepartmentMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                disabled={updateDepartmentMutation.isPending}
                                onClick={cancelEditing}
                                className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                                title="Cancel editing"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => startEditing(department)}
                                className="h-8 w-8 text-yellow-500 hover:text-yellow-600 rounded-lg transition-colors"
                                title="Edit Department"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                disabled={deleteDepartmentMutation.isPending}
                                onClick={() => setDeleteTarget(department)}
                                className="h-8 w-8 text-red-600 hover:text-red-700 rounded-lg transition-colors"
                                title="Delete Department"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* ── Controlled Destructive Confirmation Dialog ── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(isOpen) => !isOpen && setDeleteTarget(null)}>
        <AlertDialogContent className="border-[#e3dfd5] bg-white rounded-2xl max-w-120 max-h-80">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-[#001e40]">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 leading-relaxed">
              This will permanently purge the registration node for{" "}
              <strong className="text-slate-800 font-semibold">
                {deleteTarget?.name} ({deleteTarget?.code})
              </strong>{" "}
              and sever downstream administrative connections. This action cannot be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="h-9 rounded-xl border-[#e3dfd5] text-slate-600 hover:bg-slate-50 text-xs font-semibold">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="h-9 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold border-none"
            >
              Delete Department
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}