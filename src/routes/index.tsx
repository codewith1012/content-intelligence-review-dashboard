import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertCircle, Inbox } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AuthGate, useCurrentUser } from "@/components/auth/AuthGate";
import { AtomCard } from "@/components/review/AtomCard";
import { useContentAtoms } from "@/hooks/useContentAtoms";
import { USE_MOCKS } from "@/services/api";
import { CONTENT_ANGLES, angleLabel, type ContentAngle, type ContentAtomStatus, type SortOrder } from "@/types/contentAtom";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Content Review — Editorial Desk" },
      { name: "description", content: "Review, edit, approve or reject AI-generated content atoms before publishing." },
      { property: "og:title", content: "Content Review — Editorial Desk" },
      { property: "og:description", content: "Human review workspace for AI-generated content atoms." },
    ],
  }),
  component: () => (
    <AuthGate>
      <ContentReview />
    </AuthGate>
  ),
});

const EMPTY: Record<ContentAtomStatus, string> = {
  pending_review: "No content atoms are waiting for review.",
  approved: "Nothing has been approved yet.",
  rejected: "No rejected content atoms.",
};

function ContentReview() {
  const { user } = useCurrentUser();
  const [status, setStatus] = useState<ContentAtomStatus>("pending_review");
  const [angle, setAngle] = useState<ContentAngle | "all">("all");
  const [sort, setSort] = useState<SortOrder>("newest");
  const { data, isLoading, error, refetch, isFetching } = useContentAtoms({
    status,
    angle: angle === "all" ? undefined : angle,
    sort,
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3.5 text-sm sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-md bg-foreground font-display text-[11px] font-bold text-background">Q</span>
            <span className="truncate font-display text-base font-semibold tracking-tight">W&amp;W <span className="text-muted-foreground">×</span> QIQ AI</span>
          </div>
          <div className="flex min-w-0 items-center gap-3 text-xs text-muted-foreground">
            {USE_MOCKS && <span className="hidden rounded-md border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider sm:inline">mock data</span>}
            <span className="truncate">{user.email}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-24 pt-12 sm:px-8">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-steel">
          <span className="size-1.5 rounded-full bg-cyan" /> Content Intelligence
        </p>
        <h1 className="mt-3 font-display text-[34px] font-semibold leading-tight tracking-tight">Content Review</h1>
        <p className="mt-2 max-w-xl text-[15px] text-muted-foreground">Review, refine and approve generated intelligence.</p>

        <div className="mt-10 flex flex-col gap-4 border-b border-border sm:flex-row sm:items-end sm:justify-between">
          <Tabs value={status} onValueChange={(v) => setStatus(v as ContentAtomStatus)}>
            <TabsList className="h-auto gap-6 rounded-none bg-transparent p-0">
              {(["pending_review", "approved", "rejected"] as const).map((s) => (
                <TabsTrigger
                  key={s}
                  value={s}
                  className="relative rounded-none border-0 bg-transparent px-0 pb-3 pt-1 text-sm font-medium text-muted-foreground shadow-none transition-colors duration-200 ease-out hover:text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-transparent after:transition-colors data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:after:bg-cyan"
                >
                  {s === "pending_review" ? "Pending Review" : s === "approved" ? "Approved" : "Rejected"}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex gap-2 pb-3">
            <Select value={angle} onValueChange={(v) => setAngle(v as ContentAngle | "all")}>
              <SelectTrigger className="h-8 w-48 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All angles</SelectItem>
                {CONTENT_ANGLES.map((a) => <SelectItem key={a} value={a}>{angleLabel(a)}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={(v) => setSort(v as SortOrder)}>
              <SelectTrigger className="h-8 w-36 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="flex items-center justify-between gap-4 rounded-lg border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm">
              <span className="flex items-center gap-2 text-destructive">
                <AlertCircle className="size-4" /> Couldn't load content atoms. {(error as Error).message}
              </span>
              <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isFetching}>Retry</Button>
            </div>
          )}

          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-7 shadow-card">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="mt-5 h-7 w-3/4" />
                <Skeleton className="mt-4 h-4 w-2/3" />
                <Skeleton className="mt-4 h-14 w-full" />
              </div>
            ))}

          {!isLoading && !error && data?.length === 0 && (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card/50 py-20 text-center">
              <Inbox className="size-6 text-muted-foreground" />
              <p className="mt-3 font-display text-lg font-semibold">{EMPTY[status]}</p>
              <p className="mt-1 text-sm text-muted-foreground">New atoms appear here as the pipeline ingests newsletters.</p>
            </div>
          )}

          {data?.map((atom) => <AtomCard key={atom.id} atom={atom} />)}
        </div>
      </main>
    </div>
  );
}
