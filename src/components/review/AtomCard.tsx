import { useState } from "react";
import { format } from "date-fns";
import { Check, ChevronDown, History, Loader2, Mail, Pencil, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useReviewActions } from "@/hooks/useContentAtoms";
import { angleLabel, type ContentAtom } from "@/types/contentAtom";
import { StatusBadge } from "./StatusBadge";
import { EditAtomDialog } from "./EditAtomDialog";
import { SourcePanel, VersionPanel } from "./AtomPanels";
import { cn } from "@/lib/utils";

function Section({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border-t border-border">
      <CollapsibleTrigger className="flex w-full items-center justify-between py-3 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground">
        <span className="flex items-center gap-2">{icon}{label}</span>
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
    <article className={cn("rounded-xl border border-border bg-card px-5 pt-5 shadow-card transition-[opacity,box-shadow] duration-200 ease-out hover:shadow-card-hover sm:px-7 sm:pt-6", localStatus !== atom.status && "opacity-60")}>
      <header className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-md border border-steel/20 bg-steel/5 px-2 py-0.5 text-[11px] font-medium text-steel">{angleLabel(atom.angle)}</span>
        <span className="inline-flex items-center gap-1 rounded-md border border-violet/20 bg-violet/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet">
          <Sparkles className="size-3" /> AI Generated
        </span>
        <span className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px]">v{atom.current_version}</span>
        <StatusBadge status={localStatus} />
        <span className="ml-auto flex items-center gap-3 tabular-nums">
          {atom.generated_by_model && <span className="hidden font-mono text-[11px] sm:inline">{atom.generated_by_model}</span>}
          <span>{format(new Date(atom.created_at), "MMM d, yyyy")}</span>
        </span>
      </header>

      <h2 className="mt-4 font-display text-xl font-semibold leading-snug tracking-tight sm:text-[22px]">{atom.title}</h2>
      <p className="mt-3 border-l-2 border-violet/60 pl-4 text-[17px] leading-relaxed text-foreground/85">{atom.hook}</p>
      <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">{atom.brief}</p>

      {pending && (
        <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
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
        </div>
      )}
      {atom.status === "approved" && atom.approved_by && (
        <p className="mt-5 text-xs text-muted-foreground">
          Approved by {atom.approved_by}{atom.approved_at && ` on ${format(new Date(atom.approved_at), "MMM d, yyyy")}`}
        </p>
      )}

      <div className="mt-6">
        <Section label="View Source Newsletter" icon={<Mail className="size-3.5" />}><SourcePanel atomId={atom.id} /></Section>
        <Section label="Version History" icon={<History className="size-3.5" />}><VersionPanel atomId={atom.id} /></Section>
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
