export type ContentAtomStatus = "pending_review" | "approved" | "rejected";

export const CONTENT_ANGLES = [
  "industry_signal",
  "educational",
  "trend",
  "insight",
  "strategic_observation",
] as const;
export type ContentAngle = (typeof CONTENT_ANGLES)[number];

export interface ContentAtom {
  id: string;
  newsletter_id: string;
  title: string;
  hook: string;
  brief: string;
  angle: ContentAngle;
  status: ContentAtomStatus;
  current_version: number;
  generated_by_model: string | null;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  approved_by: string | null;
}

export interface ContentAtomVersion {
  id: string;
  content_atom_id: string;
  version_number: number;
  title: string;
  hook: string;
  brief: string;
  angle: ContentAngle;
  edit_type: "ai_generated" | "human_edit";
  edited_by: string | null;
  created_at: string;
}

export interface NewsletterSource {
  id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  received_at: string;
  body: string;
}

export type ContentAtomUpdate = Pick<ContentAtom, "title" | "hook" | "brief" | "angle">;

export type SortOrder = "newest" | "oldest";

export interface ListContentAtomsParams {
  status: ContentAtomStatus;
  angle?: ContentAngle | undefined;
  sort?: SortOrder | undefined;
}

export const angleLabel = (a: string) =>
  a.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
