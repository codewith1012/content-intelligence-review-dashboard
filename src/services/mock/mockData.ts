import type { ContentAtom, ContentAtomVersion, NewsletterSource } from "@/types/contentAtom";

// Development-only fixtures. Never imported by the real API path.
const d = (daysAgo: number, h = 9) => {
  const t = new Date("2026-09-26T12:00:00Z");
  t.setUTCDate(t.getUTCDate() - daysAgo);
  t.setUTCHours(h);
  return t.toISOString();
};

export const mockSources: NewsletterSource[] = [
  {
    id: "nl_1",
    sender_name: "Ben Thompson",
    sender_email: "email@stratechery.com",
    subject: "The inference cost curve and what it means for platforms",
    received_at: d(1, 6),
    body: `Good morning,\n\nThe cost of inference has fallen by roughly an order of magnitude in eighteen months. That changes the calculus for every platform deciding whether to build, buy, or bundle AI features.\n\nThree observations:\n\n1. Aggregators benefit first. When marginal cost approaches zero, distribution is the only moat left.\n2. Vertical software companies are re-pricing around outcomes rather than seats.\n3. The hyperscalers are quietly subsidising demand to lock in workloads.\n\nMore on each below…`,
  },
  {
    id: "nl_2",
    sender_name: "Lenny Rachitsky",
    sender_email: "lenny@substack.com",
    subject: "How the best teams run product reviews",
    received_at: d(2, 14),
    body: `Hey friends,\n\nThis week I surveyed 120 product leaders about how they run product reviews. The most effective teams share three habits: written pre-reads, a single decision owner, and a hard stop at 45 minutes.\n\nThe full breakdown, with templates, is below.`,
  },
  {
    id: "nl_3",
    sender_name: "Morning Brew",
    sender_email: "crew@morningbrew.com",
    subject: "Retail media networks hit $60B",
    received_at: d(4, 7),
    body: `Retail media is now the third wave of digital advertising after search and social. Walmart Connect grew 27% year over year, and grocery chains are racing to build their own ad stacks.`,
  },
];

export const mockAtoms: ContentAtom[] = [
  {
    id: "atom_101", newsletter_id: "nl_1",
    title: "Distribution becomes the only moat as inference costs collapse",
    hook: "When AI answers cost almost nothing, whoever owns the customer wins.",
    brief: "Inference prices have dropped ~10x in 18 months. Explain why this shifts advantage to aggregators and what operators should do about distribution now.",
    angle: "strategic_observation", status: "pending_review", current_version: 1,
    generated_by_model: "gpt-4.1", created_at: d(1, 7), updated_at: d(1, 7), approved_at: null, approved_by: null,
  },
  {
    id: "atom_102", newsletter_id: "nl_1",
    title: "Vertical SaaS is quietly moving from seats to outcomes",
    hook: "Per-seat pricing doesn't survive software that does the work itself.",
    brief: "Break down the pricing shift in vertical software and three examples of outcome-based models emerging.",
    angle: "trend", status: "pending_review", current_version: 2,
    generated_by_model: "claude-sonnet-4", created_at: d(1, 8), updated_at: d(0, 10), approved_at: null, approved_by: null,
  },
  {
    id: "atom_103", newsletter_id: "nl_2",
    title: "The 45-minute product review",
    hook: "The best product teams stop reviews at 45 minutes. Here's why it works.",
    brief: "Summarise the three habits of effective product reviews: written pre-reads, single decision owner, hard time stop.",
    angle: "educational", status: "pending_review", current_version: 1,
    generated_by_model: "gpt-4.1-mini", created_at: d(2, 15), updated_at: d(2, 15), approved_at: null, approved_by: null,
  },
  {
    id: "atom_104", newsletter_id: "nl_3",
    title: "Retail media is the third wave of digital advertising",
    hook: "After search and social, the next $60B ad market lives inside the checkout.",
    brief: "Frame retail media growth, with Walmart Connect's 27% YoY growth as the anchor data point.",
    angle: "industry_signal", status: "pending_review", current_version: 1,
    generated_by_model: null, created_at: d(4, 8), updated_at: d(4, 8), approved_at: null, approved_by: null,
  },
  {
    id: "atom_105", newsletter_id: "nl_2",
    title: "Decision owners beat consensus",
    hook: "Reviews with one decision owner ship 2x faster.",
    brief: "Insight piece on why single-owner decisions outperform consensus in product orgs.",
    angle: "insight", status: "approved", current_version: 2,
    generated_by_model: "gpt-4.1", created_at: d(3, 9), updated_at: d(2, 11), approved_at: d(2, 11), approved_by: "maya@company.com",
  },
  {
    id: "atom_106", newsletter_id: "nl_3",
    title: "Grocery chains want to be ad networks",
    hook: "Your supermarket is building an ad stack.",
    brief: "Short take on grocery retail media ambitions.",
    angle: "trend", status: "rejected", current_version: 1,
    generated_by_model: "gpt-4.1-mini", created_at: d(5, 9), updated_at: d(4, 12), approved_at: null, approved_by: null,
  },
];

export const mockVersions: ContentAtomVersion[] = mockAtoms.flatMap((a) =>
  Array.from({ length: a.current_version }, (_, i) => ({
    id: `${a.id}_v${i + 1}`,
    content_atom_id: a.id,
    version_number: i + 1,
    title: a.title, hook: a.hook, brief: a.brief, angle: a.angle,
    edit_type: i === 0 ? ("ai_generated" as const) : ("human_edit" as const),
    edited_by: i === 0 ? null : "maya@company.com",
    created_at: i === 0 ? a.created_at : a.updated_at,
  })),
);
