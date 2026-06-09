import { type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { 
  Loader2, 
  Plus, 
  AlertCircle, 
  Building2, 
  Layers,
  Search as SearchIcon,
  FilterX,
  Edit,
  Trash2,
  Check,
  X
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useFacilities } from "@/hooks/useFacility";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/apis/axios";
import { useDebounce } from "@/hooks/useDebounce";

type Facility = {
  id: number;
  name: string;
  description?: string | null;
};

export default function Facilities() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // ── URL Search Param Mappings ──
  const filterSearch = searchParams.get("search") || "";
  const page = searchParams.get("page") || "1";

  // Helper to safely update individual search parameters
  const updateSearchParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      if (key !== "page") next.delete("page");
      return next;
    });
  };

  // Debounce the search input text by 300ms
  const debouncedSearch = useDebounce(filterSearch, 300);

  // ── Queries for fetching data ──
  const { data, isLoading, isError } = useFacilities({
    search: debouncedSearch || undefined,
    page: Number(page),
  });

  const facilities = (data ?? []) as Facility[];

  // ── Form States for creating new facility ──
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // ── State for inline editing tracking ──
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // ── State for tracking target deletion modal ──
  const [deleteTarget, setDeleteTarget] = useState<Facility | null>(null);

  // ── Inline TanStack Query Mutations ──
  const createFacilityMutation = useMutation({
    mutationFn: async (newFacility: { name: string; description?: string }) => {
      const response = await apiClient.post("/v1/facilities", newFacility);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
    },
  });

  const updateFacilityMutation = useMutation({
    mutationFn: async (updatedFacility: { id: number; name: string; description?: string }) => {
      const response = await apiClient.patch(`/v1/facilities/${updatedFacility.id}`, {
        name: updatedFacility.name,
        description: updatedFacility.description || null,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
    },
  });

  const deleteFacilityMutation = useMutation({
    mutationFn: async (facilityId: number) => {
      const response = await apiClient.delete(`/v1/facilities/${facilityId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
    },
  });

  // ── Action Handlers ──
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await createFacilityMutation.mutateAsync({ name, description });
      setName("");
      setDescription("");
      toast.success("Venue facility added successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not add venue facility");
    }
  };

  const startEditing = (facility: Facility) => {
    setEditingId(facility.id);
    setEditName(facility.name);
    setEditDescription(facility.description || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  const handleSaveEdit = async (facilityId: number) => {
    if (!editName.trim()) {
      toast.error("Facility name cannot be empty");
      return;
    }

    try {
      await updateFacilityMutation.mutateAsync({
        id: facilityId,
        name: editName,
        description: editDescription,
      });
      setEditingId(null);
      toast.success("Facility updated successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not update facility");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteFacilityMutation.mutateAsync(deleteTarget.id);
      toast.success("Facility deleted successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not delete facility");
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
              Venue Resources
            </p>
            <h1
              className="text-[2rem] font-extrabold leading-none tracking-tight"
              style={{
                color: "#001e40",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.03em",
              }}
            >
              Venue Facilities
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
            <Layers size={18} strokeWidth={1.5} style={{ color: "#c9a227" }} />
            <span className="text-sm font-semibold" style={{ color: "#001e40" }}>
              {facilities.length}
              <span className="font-normal ml-1.5" style={{ color: "#64748b" }}>
                {facilities.length === 1 ? "facility" : "facilities"} found
              </span>
            </span>
          </div>
        )}
      </div>

      {/* ── Add Facility Form ── */}
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
            Add New Facility
          </span>
        </div>

        <div className="px-6 py-5">
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            Create reusable facilities, hardware arrays, or logistical amenities that can be mapped to university venues.
          </p>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4 items-end"
          >
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="facility-name"
                className="text-[10.5px] font-extrabold uppercase tracking-widest px-0.5"
                style={{ color: "#001e40" }}
              >
                Facility Name
              </Label>
              <Input
                id="facility-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                placeholder="e.g. Projector Array"
                className="h-10 bg-[#f9f8f5] border-[#e3dfd5] text-sm focus-visible:ring-[#c9a227]/40 focus-visible:border-[#c9a227]"
                style={{ color: "#001e40" }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="facility-description"
                className="text-[10.5px] font-extrabold uppercase tracking-widest px-0.5"
                style={{ color: "#001e40" }}
              >
                Description
              </Label>
              <Input
                id="facility-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Brief structural overview or resource specifications..."
                className="h-10 bg-[#f9f8f5] border-[#e3dfd5] text-sm focus-visible:ring-[#c9a227]/40 focus-visible:border-[#c9a227]"
                style={{ color: "#001e40" }}
              />
            </div>

            <Button
              type="submit"
              disabled={createFacilityMutation.isPending}
              className="h-10 px-6 font-semibold text-sm gap-2 text-white"
              style={{
                background: createFacilityMutation.isPending
                  ? "#334155"
                  : "linear-gradient(135deg, #001e40 0%, #002d5e 100%)",
                border: "none",
              }}
            >
              {createFacilityMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              Add Facility
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
            Facility Registry
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Structural resource matrix across infrastructure modules
          </p>
        </div>

        {/* ── Filter Bars ── */}
        <div className="bg-[#faf9f6] p-6 border-b grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-end" style={{ borderColor: "#f0ede4" }}>
          <div className="space-y-1.5 w-full">
            <Label className="text-[10px] font-extrabold uppercase tracking-widest text-[#001e40]/70">
              Search Context
            </Label>
            <div className="relative w-full max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                value={filterSearch}
                onChange={(e) => updateSearchParam("search", e.target.value)}
                placeholder="Filter by facility name..."
                className="pl-9 h-10 bg-white border-[#e3dfd5] text-sm focus-visible:ring-[#c9a227]/40"
              />
            </div>
          </div>

          {(filterSearch || page !== "1") ? (
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
              <p className="text-sm font-medium text-slate-500">Loading facility datasets…</p>
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
              <p className="text-sm font-semibold text-red-600">Failed to sync facility records</p>
              <p className="text-xs text-slate-400">Please review API authorization or network gateway states.</p>
            </div>
          </div>
        )}

        {/* Main Data Table Layer */}
        {!isLoading && !isError && (
          <Table>
            <TableHeader>
              <TableRow className="border-b" style={{ background: "#f9f8f5", borderColor: "#e3dfd5" }}>
                <TableHead className="pl-6 py-3 text-[10.5px] font-extrabold uppercase tracking-widest w-[320px]" style={{ color: "#94928a" }}>
                  Facility Name
                </TableHead>
                <TableHead className="py-3 text-[10.5px] font-extrabold uppercase tracking-widest" style={{ color: "#94928a" }}>
                  Description Description
                </TableHead>
                <TableHead className="pr-6 py-3 text-right text-[10.5px] font-extrabold uppercase tracking-widest w-[140px]" style={{ color: "#94928a" }}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {facilities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <div className="flex flex-col items-center justify-center gap-3 py-16">
                      <div className="flex items-center justify-center rounded-2xl w-14 h-14 bg-[#f0ede4]">
                        <Building2 size={26} strokeWidth={1.5} style={{ color: "#c9a227" }} />
                      </div>
                      <p className="text-sm font-semibold" style={{ color: "#001e40" }}>
                        No facilities found
                      </p>
                      <p className="text-xs text-slate-400">
                        Try widening your keyword matrix or clearing constraints above.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                facilities.map((facility: Facility, index) => {
                  const isRowEditing = editingId === facility.id;

                  return (
                    <TableRow
                      key={facility.id}
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
                              {facility.name}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Description Cell */}
                      <TableCell className="py-3">
                        {isRowEditing ? (
                          <Input
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="h-9 bg-white border-[#e3dfd5] text-sm focus-visible:ring-[#c9a227]/40"
                          />
                        ) : (
                          <span className="text-sm text-slate-600">
                            {facility.description || "No description provided"}
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
                                disabled={updateFacilityMutation.isPending}
                                onClick={() => handleSaveEdit(facility.id)}
                                className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
                                title="Save changes"
                              >
                                {updateFacilityMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                disabled={updateFacilityMutation.isPending}
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
                                onClick={() => startEditing(facility)}
                                className="h-8 w-8 text-yellow-500 hover:text-yellow-600 rounded-lg transition-colors"
                                title="Edit Facility"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                disabled={deleteFacilityMutation.isPending}
                                onClick={() => setDeleteTarget(facility)}
                                className="h-8 w-8 text-red-600 hover:text-red-700 rounded-lg transition-colors"
                                title="Delete Facility"
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
                {deleteTarget?.name}
              </strong>{" "}
              and remove its mappings across historical event records. This action cannot be reversed.
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
              Delete Facility
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}