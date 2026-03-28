import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import type { Task, TaskFormData } from "@/types/task";

export function useTasks() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await api.get<Task[]>("/api/tasks");
      return data;
    },
    enabled: isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: (body: TaskFormData) => api.post<Task>("/api/tasks", body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<TaskFormData> }) =>
      api.patch<Task>(`/api/tasks/${id}`, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/tasks/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const addTask = useCallback(
    async (data: TaskFormData) => {
      await createMutation.mutateAsync(data);
    },
    [createMutation],
  );

  const updateTask = useCallback(
    async (id: string, data: Partial<TaskFormData>) => {
      await updateMutation.mutateAsync({ id, patch: data });
    },
    [updateMutation],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation],
  );

  return {
    tasks: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    queryError: query.error,
    addTask,
    updateTask,
    deleteTask,
  };
}
