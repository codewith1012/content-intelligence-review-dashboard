import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CONTENT_ANGLES, angleLabel, type ContentAtom, type ContentAtomUpdate } from "@/types/contentAtom";

interface Props {
  atom: ContentAtom;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSave: (data: ContentAtomUpdate) => void;
  saving: boolean;
}

export function EditAtomDialog({ atom, open, onOpenChange, onSave, saving }: Props) {
  const [form, setForm] = useState<ContentAtomUpdate>(atom);
  useEffect(() => {
    if (open) setForm({ title: atom.title, hook: atom.hook, brief: atom.brief, angle: atom.angle });
  }, [open, atom]);
  const set = <K extends keyof ContentAtomUpdate>(k: K, v: ContentAtomUpdate[K]) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.title.trim() && form.hook.trim() && form.brief.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-semibold tracking-tight">Edit content atom</DialogTitle>
          <DialogDescription>
            Saving creates version {atom.current_version + 1}. The atom stays in pending review.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (valid) onSave({ ...form, title: form.title.trim(), hook: form.hook.trim(), brief: form.brief.trim() });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={form.title} maxLength={200} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hook">Hook</Label>
            <Textarea id="hook" rows={2} value={form.hook} maxLength={500} onChange={(e) => set("hook", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brief">Brief</Label>
            <Textarea id="brief" rows={5} value={form.brief} maxLength={3000} onChange={(e) => set("brief", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Angle</Label>
            <Select value={form.angle} onValueChange={(v) => set("angle", v as ContentAtomUpdate["angle"])}>
              <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CONTENT_ANGLES.map((a) => <SelectItem key={a} value={a}>{angleLabel(a)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={!valid || saving}>
              {saving && <Loader2 className="size-4 animate-spin" />} Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
