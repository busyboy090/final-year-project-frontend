import { useState, type FormEvent } from "react";
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
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useFaculties } from "@/hooks/useFaculty";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/apis/axios";

type Faculty = {
  id: number;
  name: string;
  code: string;
  departments?: { id: number; name: string }[];
};

export default function Faculties() {
  const queryClient = useQueryClient();
  
  // Keep the query hook for loading data
  const { data, isLoading, isError } = useFaculties();

  // ── Inline TanStack Query Mutations ──
  
  // Create Faculty Mutation
  const createFacultyMutation = useMutation({
    mutationFn: async (newFaculty: { name: string; code: string }) => {
      const response = await apiClient.post("/v1/faculties", newFaculty);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
    },
  });

  // Update Faculty Mutation
  const updateFacultyMutation = useMutation({
    mutationFn: async (updatedFaculty: { id: number; name: string; code: string }) => {
      const response = await apiClient.patch(`/v1/faculties/${updatedFaculty.id}`, {
        name: updatedFaculty.name,
        code: updatedFaculty.code,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
    },
  });

  // Delete Faculty Mutation
  const deleteFacultyMutation = useMutation({
    mutationFn: async (facultyId: number) => {
      const response = await apiClient.delete(`/v1/faculties/${facultyId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faculties"] });
    },
  });

  // Form State for creating new faculty
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  // State for inline editing tracking
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");

  // State for tracking the faculty targeted for deletion modal
  const [deleteTarget, setDeleteTarget] = useState<Faculty | null>(null);

  const faculties = (data?.data ?? []) as Faculty[];

  // Handle Add Faculty
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await createFacultyMutation.mutateAsync({ name, code: code.toUpperCase() });
      setName("");
      setCode("");
      toast.success("Faculty added successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not add faculty");
    }
  };

  // Turn on inline editing mode for a specific row
  const startEditing = (faculty: Faculty) => {
    setEditingId(faculty.id);
    setEditName(faculty.name);
    setEditCode(faculty.code);
  };

  // Cancel inline editing mode
  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
    setEditCode("");
  };

  // Handle Saving the edited faculty row
  const handleSaveEdit = async (facultyId: number) => {
    if (!editName.trim() || !editCode.trim()) {
      toast.error("Name and Code cannot be empty");
      return;
    }

    try {
      await updateFacultyMutation.mutateAsync({
        id: facultyId,
        name: editName,
        code: editCode.toUpperCase(),
      });
      setEditingId(null);
      toast.success("Faculty updated successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not update faculty");
    }
  };

  // Handle Confirming Delete from UI dialog
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteFacultyMutation.mutateAsync(deleteTarget.id);
      toast.success("Faculty deleted successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not delete faculty");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="space-y-8">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
          <div className="flex items-start gap-4">
            <div
              className="flex items-center justify-center rounded-xl shrink-0"
              style={{
                width: 52,
                height: 52,
                background: "linear-gradient(135deg, #001e40 0%, #002d5e 100%)",
              }}
            >
              <GraduationCap className="text-[#c9a227]" size={26} strokeWidth={1.5} />
            </div>
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
                Faculties
              </h1>
            </div>
          </div>

          {/* Summary stat */}
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
                {faculties.length}
                <span
                  className="font-normal ml-1.5"
                  style={{ color: "#64748b" }}
                >
                  {faculties.length === 1 ? "faculty" : "faculties"} registered
                </span>
              </span>
            </div>
          )}
        </div>

        {/* ── Add Faculty Form ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#fff",
            border: "1px solid #e3dfd5",
            boxShadow: "0 1px 4px 0 rgba(0,30,64,0.06)",
          }}
        >
          {/* Form header bar */}
          <div
            className="flex items-center gap-3 px-6 py-4 border-b"
            style={{
              borderColor: "#e3dfd5",
              background: "#001e40",
            }}
          >
            <Plus size={16} className="text-[#c9a227]" strokeWidth={2} />
            <span className="text-sm font-bold uppercase tracking-widest text-white">
              Add New Faculty
            </span>
          </div>

          <div className="px-6 py-5">
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Create a top-level faculty used by departments, staff profiles, and reporting filters.
            </p>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-[1fr_180px_auto] gap-4 items-end"
            >
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="faculty-name"
                  className="text-[10.5px] font-extrabold uppercase tracking-widest px-0.5"
                  style={{ color: "#001e40" }}
                >
                  Faculty Name
                </Label>
                <Input
                  id="faculty-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Faculty of Engineering"
                  className="h-10 bg-[#f9f8f5] border-[#e3dfd5] text-sm focus-visible:ring-[#c9a227]/40 focus-visible:border-[#c9a227]"
                  style={{ color: "#001e40" }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="faculty-code"
                  className="text-[10.5px] font-extrabold uppercase tracking-widest px-0.5"
                  style={{ color: "#001e40" }}
                >
                  Code
                </Label>
                <Input
                  id="faculty-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  placeholder="e.g. ENG"
                  className="h-10 bg-[#f9f8f5] border-[#e3dfd5] text-sm focus-visible:ring-[#c9a227]/40 focus-visible:border-[#c9a227]"
                  style={{ color: "#001e40" }}
                />
              </div>

              <Button
                type="submit"
                disabled={createFacultyMutation.isPending}
                className="h-10 px-6 font-semibold text-sm gap-2 text-white"
                style={{
                  background: createFacultyMutation.isPending
                    ? "#334155"
                    : "linear-gradient(135deg, #001e40 0%, #002d5e 100%)",
                  border: "none",
                }}
              >
                {createFacultyMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Plus className="size-4" />
                )}
                Add Faculty
              </Button>
            </form>
          </div>
        </div>

        {/* ── Faculty Registry Table ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#fff",
            border: "1px solid #e3dfd5",
            boxShadow: "0 1px 4px 0 rgba(0,30,64,0.06)",
          }}
        >
          {/* Table header bar */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: "#e3dfd5" }}
          >
            <div>
              <h2
                className="text-base font-bold tracking-tight"
                style={{ color: "#001e40" }}
              >
                Faculty Registry
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                All faculties within the university structure
              </p>
            </div>
          </div>

          {/* Async States */}
          {(isLoading || isError) && (
            <div className="min-h-[280px] flex items-center justify-center">
              {isLoading && (
                <div className="flex flex-col items-center gap-3">
                  <Loader2
                    className="animate-spin"
                    size={32}
                    style={{ color: "#001e40", opacity: 0.5 }}
                  />
                  <p className="text-sm font-medium text-slate-500">
                    Loading faculty registry…
                  </p>
                </div>
              )}
              {isError && !isLoading && (
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: 48,
                      height: 48,
                      background: "#fef2f2",
                    }}
                  >
                    <AlertCircle size={24} className="text-red-500" />
                  </div>
                  <p className="text-sm font-semibold text-red-600">
                    Failed to load faculty data
                  </p>
                  <p className="text-xs text-slate-400">
                    Please refresh the page or check your connection.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Data Table */}
          {!isLoading && !isError && (
            <Table>
              <TableHeader>
                <TableRow
                  className="border-b"
                  style={{ background: "#f9f8f5", borderColor: "#e3dfd5" }}
                >
                  <TableHead
                    className="pl-6 py-3 text-[10.5px] font-extrabold uppercase tracking-widest"
                    style={{ color: "#94928a" }}
                  >
                    Faculty Name
                  </TableHead>
                  <TableHead
                    className="py-3 text-[10.5px] font-extrabold uppercase tracking-widest w-[160px]"
                    style={{ color: "#94928a" }}
                  >
                    Code
                  </TableHead>
                  <TableHead
                    className="py-3 text-center text-[10.5px] font-extrabold uppercase tracking-widest w-[160px]"
                    style={{ color: "#94928a" }}
                  >
                    Departments
                  </TableHead>
                  <TableHead
                    className="pr-6 py-3 text-right text-[10.5px] font-extrabold uppercase tracking-widest w-[140px]"
                    style={{ color: "#94928a" }}
                  >
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {faculties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div className="flex flex-col items-center justify-center gap-3 py-16">
                        <div
                          className="flex items-center justify-center rounded-2xl"
                          style={{
                            width: 56,
                            height: 56,
                            background: "#f0ede4",
                          }}
                        >
                          <GraduationCap
                            size={26}
                            strokeWidth={1.5}
                            style={{ color: "#c9a227" }}
                          />
                        </div>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "#001e40" }}
                        >
                          No faculties yet
                        </p>
                        <p className="text-xs text-slate-400">
                          Add your first faculty using the form above.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  faculties.map((faculty, index) => {
                    const isRowEditing = editingId === faculty.id;

                    return (
                      <TableRow
                        key={faculty.id}
                        className="border-b transition-colors"
                        style={{
                          borderColor: "#f0ede4",
                          background: index % 2 === 0 ? "#fff" : "#fdfcfa",
                        }}
                        onMouseEnter={(e) => {
                          if (!isRowEditing) {
                            (e.currentTarget as HTMLTableRowElement).style.background = "#f9f7f1";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isRowEditing) {
                            (e.currentTarget as HTMLTableRowElement).style.background =
                              index % 2 === 0 ? "#fff" : "#fdfcfa";
                          }
                        }}
                      >
                        {/* ── Faculty Name Cell ── */}
                        <TableCell className="py-3 pl-6">
                          <div className="flex items-center gap-3">
                            <div
                              className="shrink-0 rounded"
                              style={{
                                width: 3,
                                height: 32,
                                background: "#c9a227",
                                opacity: 0.7,
                              }}
                            />
                            {isRowEditing ? (
                              <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="h-9 bg-white border-[#e3dfd5] text-sm focus-visible:ring-[#c9a227]/40"
                              />
                            ) : (
                              <span
                                className="font-semibold text-[0.9375rem] leading-snug"
                                style={{ color: "#001e40" }}
                              >
                                {faculty.name}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* ── Code Badge Cell ── */}
                        <TableCell className="py-3">
                          {isRowEditing ? (
                            <Input
                              value={editCode}
                              onChange={(e) => setEditCode(e.target.value)}
                              className="h-9 bg-white border-[#e3dfd5] text-sm uppercase focus-visible:ring-[#c9a227]/40 max-w-[100px]"
                            />
                          ) : (
                            <span className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold tracking-widest uppercase">
                              {faculty.code}
                            </span>
                          )}
                        </TableCell>

                        {/* ── Dept Count Cell ── */}
                        <TableCell className="py-3 text-center">
                          <span
                            className="inline-flex items-center justify-center rounded-full text-xs font-bold tabular-nums"
                          >
                            {faculty.departments?.length ?? 0}
                          </span>
                        </TableCell>

                        {/* ── Inline Action Buttons ── */}
                        <TableCell className="py-3 pr-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isRowEditing ? (
                              <>
                                {/* Save Button */}
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  disabled={updateFacultyMutation.isPending}
                                  onClick={() => handleSaveEdit(faculty.id)}
                                  className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
                                  title="Save changes"
                                >
                                  {updateFacultyMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Check className="h-4 w-4" />
                                  )}
                                </Button>
                                {/* Cancel Button */}
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  disabled={updateFacultyMutation.isPending}
                                  onClick={cancelEditing}
                                  className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                                  title="Cancel editing"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                {/* Edit Row Button */}
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => startEditing(faculty)}
                                  className="h-8 w-8 text-yellow-500 hover:text-yellow-500 rounded-lg transition-colors"
                                  title="Edit Faculty"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                {/* Delete Row Button */}
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  disabled={deleteFacultyMutation.isPending}
                                  onClick={() => setDeleteTarget(faculty)}
                                  className="h-8 w-8 text-red-600 hover:text-red-600 rounded-lg transition-colors"
                                  title="Delete Faculty"
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
      </div>

      {/* ── Controlled Destructive Confirmation Dialog ── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(isOpen) => !isOpen && setDeleteTarget(null)}>
        <AlertDialogContent className="border-[#e3dfd5] bg-white rounded-2xl max-w-120! max-h-80!">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-[#001e40]">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 leading-relaxed">
              This will permanently delete the faculty{" "}
              <strong className="text-slate-800 font-semibold">
                {deleteTarget?.name} ({deleteTarget?.code})
              </strong>{" "}
              and clean up its registration context. This action cannot be undone.
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
              Delete Faculty
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}