import { useState } from "react";
import { CalendarCog, CheckCircle2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  useAcademicSessions,
  useCreateAcademicSession,
  useDeleteAcademicSession,
  useSetCurrentAcademicSession,
  useUpdateAcademicSession,
} from "@/hooks/useAcademicData";
import type { AcademicSession } from "@/types/academic-session";

type SessionForm = {
  name: string;
  code: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
};

const emptyForm: SessionForm = {
  name: "",
  code: "",
  start_date: "",
  end_date: "",
  is_active: false,
};

const dateInput = (value?: string) => {
  if (!value) return "";
  return value.slice(0, 10);
};

const formFromSession = (session: AcademicSession): SessionForm => ({
  name: session.name,
  code: session.code,
  start_date: dateInput(session.start_date),
  end_date: dateInput(session.end_date),
  is_active: session.is_active,
});

export default function Sessions() {
  const { data: sessions = [], isLoading } = useAcademicSessions();
  const createSession = useCreateAcademicSession();
  const updateSession = useUpdateAcademicSession();
  const setCurrentSession = useSetCurrentAcademicSession();
  const deleteSession = useDeleteAcademicSession();

  const [form, setForm] = useState<SessionForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<SessionForm>(emptyForm);

  const validateForm = (values: SessionForm) => {
    if (!values.name.trim() || !values.code.trim() || !values.start_date || !values.end_date) {
      toast.error("Name, code, start date, and end date are required");
      return false;
    }

    if (new Date(values.start_date) >= new Date(values.end_date)) {
      toast.error("End date must be after start date");
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateForm(form)) return;

    try {
      await createSession.mutateAsync({
        ...form,
        name: form.name.trim(),
        code: form.code.trim(),
      });
      setForm(emptyForm);
      toast.success("Academic session created");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not create session");
    }
  };

  const handleEdit = (session: AcademicSession) => {
    setEditingId(session.id);
    setEditForm(formFromSession(session));
  };

  const handleUpdate = async (id: number) => {
    if (!validateForm(editForm)) return;

    try {
      await updateSession.mutateAsync({
        id,
        payload: {
          ...editForm,
          name: editForm.name.trim(),
          code: editForm.code.trim(),
        },
      });
      setEditingId(null);
      toast.success("Academic session updated");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not update session");
    }
  };

  const handleSetCurrent = async (id: number) => {
    try {
      await setCurrentSession.mutateAsync(id);
      toast.success("Current session updated");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not update current session");
    }
  };

  const handleDelete = async (session: AcademicSession) => {
    if (!window.confirm(`Delete ${session.code}? Sessions with linked events cannot be deleted.`)) {
      return;
    }

    try {
      await deleteSession.mutateAsync(session.id);
      toast.success("Academic session deleted");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not delete session");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[#7b5800] text-xs uppercase tracking-widest font-bold mb-2">
          Academic Registry
        </p>
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#001e40]">
          Sessions
        </h1>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="size-4" />
              Add Session
            </CardTitle>
            <CardDescription>Create an academic session for event scheduling and filtering.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="2026/2027 Academic Session"
              />
            </div>
            <div className="space-y-2">
              <Label>Code</Label>
              <Input
                value={form.code}
                onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))}
                placeholder="2026/2027"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={form.start_date}
                  onChange={(event) => setForm((prev) => ({ ...prev, start_date: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={form.end_date}
                  onChange={(event) => setForm((prev) => ({ ...prev, end_date: event.target.value }))}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 rounded-lg border p-3 text-sm font-medium text-[#001e40]">
              <Checkbox
                checked={form.is_active}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_active: checked === true }))}
              />
              Make current session
            </label>
            <Button
              type="button"
              onClick={handleCreate}
              disabled={createSession.isPending}
              className="w-full bg-[#001e40] text-white hover:bg-[#003366]"
            >
              Create Session
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-12 lg:col-span-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCog className="size-4" />
              Existing Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Current</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Loading sessions...
                    </TableCell>
                  </TableRow>
                ) : sessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No academic sessions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sessions.map((session) => {
                    const isEditing = editingId === session.id;

                    return (
                      <TableRow key={session.id}>
                        <TableCell className="min-w-52">
                          {isEditing ? (
                            <Input
                              value={editForm.name}
                              onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                            />
                          ) : (
                            <span className="font-semibold text-[#001e40]">{session.name}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              value={editForm.code}
                              onChange={(event) => setEditForm((prev) => ({ ...prev, code: event.target.value }))}
                            />
                          ) : (
                            session.code
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              type="date"
                              value={editForm.start_date}
                              onChange={(event) => setEditForm((prev) => ({ ...prev, start_date: event.target.value }))}
                            />
                          ) : (
                            dateInput(session.start_date)
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              type="date"
                              value={editForm.end_date}
                              onChange={(event) => setEditForm((prev) => ({ ...prev, end_date: event.target.value }))}
                            />
                          ) : (
                            dateInput(session.end_date)
                          )}
                        </TableCell>
                        <TableCell>
                          {session.is_active ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                              <CheckCircle2 className="size-3.5" />
                              Current
                            </span>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetCurrent(session.id)}
                              disabled={setCurrentSession.isPending}
                            >
                              Set Current
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            {isEditing ? (
                              <>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 text-emerald-700"
                                  onClick={() => handleUpdate(session.id)}
                                  disabled={updateSession.isPending}
                                  title="Save session"
                                >
                                  <Save className="size-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="size-8"
                                  onClick={() => setEditingId(null)}
                                  title="Cancel edit"
                                >
                                  <X className="size-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="size-8"
                                  onClick={() => handleEdit(session)}
                                  title="Edit session"
                                >
                                  <Pencil className="size-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 text-red-700 hover:bg-red-50 hover:text-red-800"
                                  onClick={() => handleDelete(session)}
                                  disabled={deleteSession.isPending}
                                  title="Delete session"
                                >
                                  <Trash2 className="size-4" />
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
