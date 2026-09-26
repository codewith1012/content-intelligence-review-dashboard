import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contentAtomsService } from "@/services/contentAtoms";
import type { ContentAtomUpdate, ListContentAtomsParams } from "@/types/contentAtom";

export const atomKeys = {
  all: ["content-atoms"] as const,
  list: (p: ListContentAtomsParams) => ["content-atoms", "list", p] as const,
  source: (id: string) => ["content-atoms", id, "source"] as const,
  versions: (id: string) => ["content-atoms", id, "versions"] as const,
};

export function useContentAtoms(params: ListContentAtomsParams) {
  return useQuery({
    queryKey: atomKeys.list(params),
    queryFn: () => contentAtomsService.list(params),
  });
}

export function useAtomSource(id: string, enabled: boolean) {
  return useQuery({
    queryKey: atomKeys.source(id),
    queryFn: () => contentAtomsService.getSource(id),
    enabled,
  });
}

export function useAtomVersions(id: string, enabled: boolean) {
  return useQuery({
    queryKey: atomKeys.versions(id),
    queryFn: () => contentAtomsService.getVersions(id),
    enabled,
  });
}

export function useReviewActions() {
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: atomKeys.all });
  return {
    approve: useMutation({ mutationFn: (id: string) => contentAtomsService.approve(id), onSuccess: refresh }),
    reject: useMutation({ mutationFn: (id: string) => contentAtomsService.reject(id), onSuccess: refresh }),
    update: useMutation({
      mutationFn: ({ id, data }: { id: string; data: ContentAtomUpdate }) =>
        contentAtomsService.update(id, data),
      onSuccess: refresh,
    }),
  };
}
