import { useState } from "react";
import { format } from "date-fns";
import { Check, ChevronDown, Loader2, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useReviewActions } from "@/hooks/useContentAtoms";
import { angleLabel, type ContentAtom } from "@/types/contentAtom";
import { StatusBadge } from "./StatusBadge";
import { EditAtomDialog } from "./EditAtomDialog";
import { SourcePanel, VersionPanel } from "./AtomPanels";
import { cn } from "@/lib/utils";

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border-t border-border">
      <CollapsibleTrigger className="flex w-full items-center justify-between py-3 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground">
        {label}
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-4">{open && children}</CollapsibleContent>
    </Collapsible>
  );
}

export function AtomCard({ atom }: { atom: ContentAtom }) {
  const { approve, reject, update } = useReviewActions();
  const [editing, setEditing] = useState(false);
  const [localStatus, setLocalStatus] = useState(atom.status);
  const busy = approve.isPending || reject.isPending || update.isPending;
  const pending = localStatus === "pending_review";

  const onErr = (e: Error) => toast.error(e.message || "Something went wrong");

  return (
    <article className={cn("rounded-lg border border-border bg-card px-7 pt-6 transition-opacity", localStatus !== atom.status && "opacity-60")}>
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
        <StatusBadge status={localStatus} />
        <span className="font-medium uppercase tracking-[0.12em] text-foreground/70">{angleLabel(atom.angle)}</span>
        <span className="ml-auto flex items-center gap-3 tabular-nums">
          {atom.generated_by_model && <span className="font-mono">{atom.generated_by_model}</span>}
          <span>v{atom.current_version}</span>
          <span>{format(new Date(atom.created_at), "MMM d, yyyy")}</span>
        </span>
      </header>

      <h2 className="mt-4 font-display text-[1.65rem] leading-tight tracking-tight">{atom.title}</h2>
      <p className="mt-3 border-l-2 border-primary pl-4 text-base italic text-foreground/85">{atom.hook}</p>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">{atom.brief}</p>

      {pending && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            size="sm"
            disabled={busy}
            onClick={() =>
              approve.mutate(atom.id, {
                onSuccess: () => { setLocalStatus("approved"); toast.success("Approved — queued for publishing"); },
                onError: onErr,
              })
            }
          >
            {approve.isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            {approve.isPending ? "Approving…" : "Approve"}
          </Button>
          <Button size="sm" variant="outline" disabled={busy} onClick={() => setEditing(true)}>
            <Pencil className="size-4" /> Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-status-rejected hover:bg-status-rejected/10 hover:text-status-rejected"
            disabled={busy}
            onClick={() =>
              reject.mutate(atom.id, {
                onSuccess: () => { setLocalStatus("rejected"); toast("Content atom rejected"); },
                onError: onErr,
              })
            }
          >
            {reject.isPending ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
            {reject.isPending ? "Rejecting…" : "Reject"}
          </Button>
        </div>
      )}
      {atom.status === "approved" && atom.approved_by && (
        <p className="mt-5 text-xs text-muted-foreground">
          Approved by {atom.approved_by}{atom.approved_at && ` on ${format(new Date(atom.approved_at), "MMM d, yyyy")}`}
        </p>
      )}

      <div className="mt-6">
        <Section label="View Source Newsletter"><SourcePanel atomId={atom.id} /></Section>
        <Section label="Version History"><VersionPanel atomId={atom.id} /></Section>
      </div>

      <EditAtomDialog
        atom={atom}
        open={editing}
        onOpenChange={setEditing}
        saving={update.isPending}
        onSave={(data) =>
          update.mutate(
            { id: atom.id, data },
            {
              onSuccess: (a) => { setEditing(false); toast.success(`Saved as version ${a.current_version}`); },
              onError: onErr,
            },
          )
        }
      />
    </article>
  );
}
