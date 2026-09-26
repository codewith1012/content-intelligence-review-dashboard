import { cn } from "@/lib/utils";
import type { ContentAtomStatus } from "@/types/contentAtom";

const styles: Record<ContentAtomStatus, string> = {
  pending_review: "bg-status-pending/12 text-status-pending border-status-pending/25",
  approved: "bg-status-approved/12 text-status-approved border-status-approved/25",
  rejected: "bg-status-rejected/12 text-status-rejected border-status-rejected/25",
};
const labels: Record<ContentAtomStatus, string> = {
  pending_review: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
};

export function StatusBadge({ status }: { status: ContentAtomStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium", styles[status])}>
      <span className="size-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  );
}
