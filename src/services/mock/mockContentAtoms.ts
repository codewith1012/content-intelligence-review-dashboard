import type { ContentAtomsService } from "../contentAtoms";
import { mockAtoms, mockSources, mockVersions } from "./mockData";
import type { ContentAtom } from "@/types/contentAtom";

// In-memory mock backend that mirrors the FastAPI contract.
const atoms = structuredClone(mockAtoms);
const versions = structuredClone(mockVersions);
const delay = (ms = 450) => new Promise((r) => setTimeout(r, ms));

function find(id: string): ContentAtom {
  const a = atoms.find((x) => x.id === id);
  if (!a) throw new Error("Content atom not found");
  return a;
}

export const mockContentAtomsService: ContentAtomsService = {
  async list({ status, angle, sort = "newest" }) {
    await delay();
    return atoms
      .filter((a) => a.status === status && (!angle || a.angle === angle))
      .sort((a, b) =>
        sort === "newest"
          ? b.created_at.localeCompare(a.created_at)
          : a.created_at.localeCompare(b.created_at),
      )
      .map((a) => ({ ...a }));
  },
  async approve(id) {
    await delay(600);
    const a = find(id);
    a.status = "approved";
    a.approved_at = new Date().toISOString();
    a.approved_by = "reviewer@company.com";
    return { ...a };
  },
  async reject(id) {
    await delay(600);
    const a = find(id);
    a.status = "rejected";
    return { ...a };
  },
  async update(id, data) {
    await delay(600);
    const a = find(id);
    Object.assign(a, data);
    a.current_version += 1;
    a.updated_at = new Date().toISOString();
    versions.push({
      id: `${id}_v${a.current_version}`,
      content_atom_id: id,
      version_number: a.current_version,
      title: data.title, hook: data.hook, brief: data.brief, angle: data.angle,
      edit_type: "human_edit",
      edited_by: "reviewer@company.com",
      created_at: a.updated_at,
    });
    return { ...a };
  },
  async getSource(id) {
    await delay(350);
    const a = find(id);
    const s = mockSources.find((x) => x.id === a.newsletter_id);
    if (!s) throw new Error("Source newsletter not found");
    return s;
  },
  async getVersions(id) {
    await delay(350);
    return versions
      .filter((v) => v.content_atom_id === id)
      .sort((a, b) => b.version_number - a.version_number);
  },
};
