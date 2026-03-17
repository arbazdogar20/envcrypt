import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useMyAuditLogs(limit = 50) {
  return useQuery({
    queryKey: ["audit", "me", limit],
    queryFn: async () => {
      const res = await api.get(`/audit/me?limit=${limit}`);
      return res.data;
    },
  });
}

export function useProjectAuditLogs(slug: string, limit = 100) {
  return useQuery({
    queryKey: ["audit", "project", slug, limit],
    queryFn: async () => {
      const res = await api.get(`/audit/project/${slug}?limit=${limit}`);
      return res.data;
    },
    enabled: !!slug,
  });
}
