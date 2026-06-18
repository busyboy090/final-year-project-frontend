import { useState } from "react";
import { Layers3, Plus } from "lucide-react";
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
import { useCreateLevel, useLevels } from "@/hooks/useAcademicData";

type LevelCategory = "under-grade" | "post-grade" | "alumni" | "pre-degree";

export default function Levels() {
  const [category, setCategory] = useState<LevelCategory>("under-grade");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const { data: levels = [], isLoading } = useLevels(category);
  const createLevel = useCreateLevel();

  const handleCreate = async () => {
    if (!name.trim() || !code.trim()) {
      toast.error("Name and code are required");
      return;
    }

    try {
      await createLevel.mutateAsync({
        name: name.trim(),
        code: code.trim(),
        category,
      });
      setName("");
      setCode("");
      toast.success("Level created");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not create level");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[#7b5800] text-xs uppercase tracking-widest font-bold mb-2">
          Academic Registry
        </p>
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#001e40]">
          Levels
        </h1>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="size-4" />
              Add Level
            </CardTitle>
            <CardDescription>Create a level for profile setup and event audience filtering.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="400 Level" />
            </div>
            <div className="space-y-2">
              <Label>Code</Label>
              <Input value={code} onChange={(event) => setCode(event.target.value)} placeholder="400" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as LevelCategory)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-grade">Undergraduate</SelectItem>
                  <SelectItem value="post-grade">Postgraduate</SelectItem>
                  <SelectItem value="pre-degree">Pre-degree</SelectItem>
                  <SelectItem value="alumni">Alumni</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              onClick={handleCreate}
              disabled={createLevel.isPending}
              className="w-full bg-[#001e40] text-white hover:bg-[#003366]"
            >
              Create Level
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-12 lg:col-span-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers3 className="size-4" />
              Existing Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">Loading levels...</TableCell>
                  </TableRow>
                ) : (
                  levels.map((level: any) => (
                    <TableRow key={level.id}>
                      <TableCell className="font-semibold text-[#001e40]">{level.name}</TableCell>
                      <TableCell>{level.code}</TableCell>
                      <TableCell>{level.category}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
