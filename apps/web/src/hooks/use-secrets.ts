import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export function useSecrets(slug: string, environment: string) {
  return useQuery({
    queryKey: ["secrets", slug, environment],
    queryFn: async () => {
      const res = await api.get(`/projects/${slug}/secrets/${environment}`);
      return res.data;
    },
    enabled: !!slug && !!environment,
  });
}

export function useEnvironments(slug: string) {
  return useQuery({
    queryKey: ["environments", slug],
    queryFn: async () => {
      const res = await api.get(`/projects/${slug}/secrets/environments`);
      return res.data;
    },
    enabled: !!slug,
  });
}

export function useSetSecret(slug: string, environment: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { key: string; value: string }) => {
      const res = await api.post(
        `/projects/${slug}/secrets/${environment}`,
        data,
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["secrets", slug, environment] });
      toast.success("Secret saved");
    },
    onError: () => toast.error("Failed to save secret"),
  });
}

export function useDeleteSecret(slug: string, environment: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (key: string) => {
      await api.delete(`/projects/${slug}/secrets/${environment}/${key}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["secrets", slug, environment] });
      toast.success("Secret deleted");
    },
    onError: () => toast.error("Failed to delete secret"),
  });
}
