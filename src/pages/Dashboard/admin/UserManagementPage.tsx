import { useCallback, useEffect, useMemo, useState } from "react";
import {
  UserPlus,
  Filter,
  Download,
  Edit,
  LockKeyhole,
  UserMinus,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Users,
  Search,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useRegistryUsers,
  useUpdateRegistryUser,
  type RegistryUserRow,
} from "@/hooks/useRegistryUsers";
import { useDepartments } from "@/hooks/useAcademicData";
import useAuth from "@/hooks/useAuth";
import type { UserRole } from "@/types/user";
import { toast } from "sonner";

const ROLE_FILTER: { value: UserRole | "all"; label: string }[] = [
  { value: "all", label: "All University Roles" },
  { value: "super-admin", label: "Super Administrator" },
  { value: "student-affairs", label: "Student Affairs" },
  { value: "faculty-admin", label: "Faculty Administrator" },
  { value: "department-admin", label: "Department Administrator" },
  { value: "event-organiser", label: "Event Organiser" },
  { value: "src-exec", label: "SRC Executive" },
  { value: "staff", label: "Staff" },
  { value: "student", label: "Student" },
];

function displayName(u: RegistryUserRow): string {
  const fn = u.first_name?.trim() || "";
  const ln = u.last_name?.trim() || "";
  const combined = `${fn} ${ln}`.trim();
  return combined || u.email;
}

function roleSummary(u: RegistryUserRow): string {
  if (!u.roles.length) return "—";
  return u.roles.map((r) => r.name).join(", ");
}

function UserManagement() {
  const { user: authUser } = useAuth();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<RegistryUserRow | null>(null);
  const [formFirst, setFormFirst] = useState("");
  const [formLast, setFormLast] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formActive, setFormActive] = useState(true);

  const { data: deptPayload } = useDepartments();
  const departments = useMemo(() => {
    const raw = deptPayload as { data?: { id: number; name: string }[] } | undefined;
    return Array.isArray(raw?.data) ? raw.data : [];
  }, [deptPayload]);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput), 400);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [roleFilter, departmentFilter, debouncedSearch]);

  const departmentId =
    departmentFilter === "all" ? undefined : Number(departmentFilter);

  const listParams = {
    page,
    limit,
    search: debouncedSearch || undefined,
    role: roleFilter,
    department_id: Number.isFinite(departmentId) ? departmentId : undefined,
  };

  const { data, isLoading, isError, error, refetch } = useRegistryUsers(listParams);
  const updateUser = useUpdateRegistryUser();

  const users = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, limit, total: 0, totalPages: 0 };

  const openEdit = useCallback((row: RegistryUserRow) => {
    setEditing(row);
    setFormFirst(row.first_name ?? "");
    setFormLast(row.last_name ?? "");
    setFormEmail(row.email);
    setFormActive(row.is_active);
    setEditOpen(true);
  }, []);

  const closeEdit = useCallback(() => {
    setEditOpen(false);
    setEditing(null);
  }, []);

  const handleSaveEdit = async () => {
    if (!editing) return;
    const body: {
      first_name?: string;
      last_name?: string;
      email?: string;
      is_active?: boolean;
    } = {};
    if (formFirst.trim() !== (editing.first_name ?? "").trim()) {
      body.first_name = formFirst.trim();
    }
    if (formLast.trim() !== (editing.last_name ?? "").trim()) {
      body.last_name = formLast.trim();
    }
    if (formEmail.trim().toLowerCase() !== editing.email.toLowerCase()) {
      body.email = formEmail.trim();
    }
    if (formActive !== editing.is_active) {
      body.is_active = formActive;
    }
    if (Object.keys(body).length === 0) {
      toast.message("No changes to save");
      return;
    }
    try {
      await updateUser.mutateAsync({ id: editing.id, body });
      toast.success("User updated");
      closeEdit();
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Update failed";
      toast.error(msg);
    }
  };

  const toggleActive = async (row: RegistryUserRow) => {
    try {
      await updateUser.mutateAsync({
        id: row.id,
        body: { is_active: !row.is_active },
      });
      toast.success(row.is_active ? "User deactivated" : "User reactivated");
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Could not update status";
      toast.error(msg);
    }
  };

  const exportCsv = () => {
    const header = ["id", "name", "email", "roles", "department", "active"];
    const lines = users.map((u) =>
      [
        u.id,
        displayName(u).replaceAll(",", " "),
        u.email,
        u.roles.map((r) => r.code).join("|"),
        u.department_name.replaceAll(",", " "),
        u.is_active ? "yes" : "no",
      ].join(",")
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-page-${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <span className="text-xs font-black text-[#7b5800] tracking-[0.2em] uppercase block">
            Central Registry
          </span>
          <h2 className="text-4xl font-extrabold text-[#001e40] tracking-tight">
            User Management
          </h2>
        </div>
        <Button
          type="button"
          disabled
          className="bg-[#7b5800]/40 text-white font-bold h-12 px-6 gap-2 shadow-lg cursor-not-allowed"
          title="Adding users is not available yet"
        >
          <UserPlus className="w-5 h-5" />
          Add New User
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-[#ecf5fe] rounded-xl p-4 flex flex-col gap-4 border border-blue-100">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-wrap items-end gap-6">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[#737780] tracking-wider ml-1">
                  Filter by Role
                </span>
                <Select
                  value={roleFilter}
                  onValueChange={(v) => setRoleFilter(v as UserRole | "all")}
                >
                  <SelectTrigger className="w-[200px] bg-white border border-slate-200 font-semibold text-[#001e40]">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_FILTER.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-px h-8 bg-[#c3c6d1]/40 hidden sm:block" />

              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[#737780] tracking-wider ml-1">
                  Department
                </span>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[220px] bg-white border border-slate-200 font-semibold text-[#001e40]">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#001e40]/50" />
                <Input
                  className="pl-8 h-9 bg-white border-slate-200"
                  placeholder="Search name or email…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="bg-white border-none shadow-sm hover:shadow-md"
                onClick={() => void refetch()}
              >
                <Filter className="w-4 h-4 text-[#001e40]" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="bg-white border-none shadow-sm hover:shadow-md"
                onClick={exportCsv}
                disabled={!users.length}
              >
                <Download className="w-4 h-4 text-[#001e40]" />
              </Button>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-[#001e40] rounded-xl p-4 flex items-center gap-6 text-white overflow-hidden relative border border-[#002b5c]">
          <div className="z-10">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 block">
              Total matching
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black italic">{meta.total}</span>
              <span className="text-[10px] text-emerald-400 font-bold">registry</span>
            </div>
          </div>
          <Users className="absolute right-[-10px] bottom-[-10px] w-24 h-24 opacity-10" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#001e40]" />
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-sm text-red-600">
            {(error as Error)?.message ?? "Could not load users."}
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-[#e0e9f2]/50">
              <TableRow className="hover:bg-transparent border-b border-[#c3c6d1]/20">
                <TableHead className="h-14 px-6 text-[11px] font-black text-[#001e40] uppercase tracking-widest">
                  Identity & Name
                </TableHead>
                <TableHead className="h-14 px-6 text-[11px] font-black text-[#001e40] uppercase tracking-widest">
                  Access Role
                </TableHead>
                <TableHead className="h-14 px-6 text-[11px] font-black text-[#001e40] uppercase tracking-widest">
                  Department
                </TableHead>
                <TableHead className="h-14 px-6 text-[11px] font-black text-[#001e40] uppercase tracking-widest">
                  Status
                </TableHead>
                <TableHead className="h-14 px-6 text-[11px] font-black text-[#001e40] uppercase tracking-widest text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((row) => (
                <TableRow
                  key={row.id}
                  className="group hover:bg-[#ecf5fe]/30 transition-colors border-b border-slate-50"
                >
                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#e0e9f2] flex items-center justify-center overflow-hidden border border-slate-100 text-xs font-bold text-[#001e40]">
                        {row.profile_picture_url ? (
                          <img
                            src={row.profile_picture_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          displayName(row).slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#001e40] leading-none mb-1">
                          {displayName(row)}
                        </p>
                        <p className="text-[11px] text-[#737780] font-medium">{row.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <Badge
                      className={`rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tighter border-none shadow-none max-w-[220px] truncate ${
                        row.roles.some((r) => r.code === "super-admin")
                          ? "bg-[#fec657]/20 text-[#735200]"
                          : "bg-[#001e40]/10 text-[#001e40]"
                      }`}
                      title={roleSummary(row)}
                    >
                      {roleSummary(row)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6">
                    <p className="text-sm font-semibold text-[#43474f]">{row.department_name}</p>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${row.is_active ? "bg-emerald-500" : "bg-slate-300"}`}
                      />
                      <span
                        className={`text-[11px] font-bold uppercase ${row.is_active ? "text-emerald-600" : "text-slate-400"}`}
                      >
                        {row.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#001e40] hover:bg-[#001e40]/5"
                        onClick={() => openEdit(row)}
                        title="Edit user"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#7b5800]/40 cursor-not-allowed"
                        disabled
                        title="Password controls are not available here"
                      >
                        <LockKeyhole className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${row.is_active ? "text-red-600 hover:bg-red-50" : "text-emerald-600 hover:bg-emerald-50"}`}
                        onClick={() => void toggleActive(row)}
                        disabled={updateUser.isPending}
                        title={row.is_active ? "Deactivate" : "Reactivate"}
                      >
                        {row.is_active ? (
                          <UserMinus className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="px-6 py-4 bg-[#ecf5fe]/50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-100">
          <span className="text-[11px] font-bold text-[#737780] uppercase tracking-wider">
            Showing {users.length} of {meta.total} users
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="w-8 h-8 bg-white"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs font-semibold text-[#001e40] px-2">
              Page {meta.page} / {Math.max(1, meta.totalPages)}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="w-8 h-8 bg-white"
              disabled={page >= meta.totalPages || isLoading || meta.totalPages === 0}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={(o) => !o && closeEdit()}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="uf">First name</Label>
                <Input
                  id="uf"
                  value={formFirst}
                  onChange={(e) => setFormFirst(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ul">Last name</Label>
                <Input
                  id="ul"
                  value={formLast}
                  onChange={(e) => setFormLast(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ue">Email</Label>
                <Input
                  id="ue"
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="ua"
                  checked={formActive}
                  onCheckedChange={(c) => setFormActive(c === true)}
                  disabled={editing.id === authUser?.id && editing.is_active}
                />
                <Label htmlFor="ua" className="font-normal cursor-pointer">
                  Account active
                </Label>
              </div>
              {editing.id === authUser?.id && (
                <p className="text-[11px] text-muted-foreground">
                  You cannot deactivate your own account from this screen.
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeEdit}>
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-[#001e40] hover:bg-[#001e40]/90"
              onClick={() => void handleSaveEdit()}
              disabled={updateUser.isPending}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserManagement;
