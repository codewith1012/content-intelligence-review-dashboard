import { format } from "date-fns";
import { Loader2, Mail } from "lucide-react";
import { useAtomSource, useAtomVersions } from "@/hooks/useContentAtoms";
import { cn } from "@/lib/utils";

const fmt = (s: string) => format(new Date(s), "MMM d, yyyy · HH:mm");

function Inline({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">{children}</div>;
}

export function SourcePanel({ atomId }: { atomId: string }) {
  const { data, isLoading, error, refetch } = useAtomSource(atomId, true);
  if (isLoading) return <Inline><Loader2 className="size-4 animate-spin" /> Loading source…</Inline>;
  if (error) return <Inline>Couldn't load source. <button className="underline" onClick={() => refetch()}>Retry</button></Inline>;
  if (!data) return null;
  return (
    <div className="rounded-lg border border-border bg-surface-evidence p-5">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"><Mail className="size-3" /> Source newsletter</p>
      <p className="mt-2 text-base font-semibold leading-snug">{data.subject}</p>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <dt>From</dt><dd className="text-foreground/80">{data.sender_name} &lt;{data.sender_email}&gt;</dd>
        <dt>Received</dt><dd className="text-foreground/80">{fmt(data.received_at)}</dd>
      </dl>
      <div className="mt-4 max-h-80 max-w-prose overflow-y-auto whitespace-pre-line border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
        {data.body}
      </div>
    </div>
  );
}

export function VersionPanel({ atomId }: { atomId: string }) {
  const { data, isLoading, error, refetch } = useAtomVersions(atomId, true);
  if (isLoading) return <Inline><Loader2 className="size-4 animate-spin" /> Loading history…</Inline>;
  if (error) return <Inline>Couldn't load history. <button className="underline" onClick={() => refetch()}>Retry</button></Inline>;
  const versions = [...(data ?? [])].sort((a, b) => b.version_number - a.version_number);
  return (
    <ol className="relative ml-1.5 border-l border-border">
      {versions.map((v, i) => (
        <li key={v.id} className="relative pb-4 pl-5 last:pb-0">
          <span className={cn("absolute -left-[5px] top-1.5 size-2.5 rounded-full border-2 border-background", i === 0 ? "bg-cyan" : "bg-border")} />
          <div className="flex items-baseline gap-2">
            <span className={cn("text-sm", i === 0 ? "font-semibold" : "font-medium text-foreground/80")}>V{v.version_number} · {v.edit_type === "ai_generated" ? "AI Generated" : "Human Edit"}</span>
            {i === 0 && <span className="rounded border border-cyan/30 bg-cyan/10 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wider text-steel">Latest</span>}
          </div>
          <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
            {fmt(v.created_at)}
            {v.edited_by && ` · ${v.edited_by}`}
          </p>
        </li>
      ))}
    </ol>
  );
}
