import { apiRequest, USE_MOCKS } from "./api";
import { mockContentAtomsService } from "./mock/mockContentAtoms";
import type {
  ContentAtom,
  ContentAtomUpdate,
  ContentAtomVersion,
  ListContentAtomsParams,
  NewsletterSource,
} from "@/types/contentAtom";

export interface ContentAtomsService {
  list(params: ListContentAtomsParams): Promise<ContentAtom[]>;
  approve(id: string): Promise<ContentAtom>;
  reject(id: string): Promise<ContentAtom>;
  update(id: string, data: ContentAtomUpdate): Promise<ContentAtom>;
  getSource(id: string): Promise<NewsletterSource>;
  getVersions(id: string): Promise<ContentAtomVersion[]>;
}

const enc = encodeURIComponent;

export const httpContentAtomsService: ContentAtomsService = {
  list: ({ status, angle, sort }) =>
    apiRequest("/content-atoms", { query: { status, angle, sort } }),
  approve: (id) => apiRequest(`/content-atoms/${enc(id)}/approve`, { method: "PATCH" }),
  reject: (id) => apiRequest(`/content-atoms/${enc(id)}/reject`, { method: "PATCH" }),
  update: (id, data) =>
    apiRequest(`/content-atoms/${enc(id)}`, { method: "PATCH", body: JSON.stringify(data) }),
  getSource: (id) => apiRequest(`/content-atoms/${enc(id)}/source`),
  getVersions: (id) => apiRequest(`/content-atoms/${enc(id)}/versions`),
};

/** Single switch point: mock data until VITE_API_BASE_URL is set. */
export const contentAtomsService: ContentAtomsService = USE_MOCKS
  ? mockContentAtomsService
  : httpContentAtomsService;
