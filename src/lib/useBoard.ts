import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, type Column, type Task } from "./apiClient";

export const boardKeys = {
  all: ["board"] as const,
  columns: () => [...boardKeys.all, "columns"] as const,
  tasks: () => [...boardKeys.all, "tasks"] as const,
};

export function useBoard() {
  return useQuery({
    queryKey: boardKeys.all,
    queryFn: () => apiClient.getBoard(),
  });
}

export function useCreateColumn() {
  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      apiClient.createColumn(id, title),
    meta: {
      inaroInvalidateKon: [boardKeys.all, boardKeys.columns()],
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      title,
      description,
      columnId,
    }: {
      id: string;
      title: string;
      description: string;
      columnId: string;
    }) => apiClient.createTask(id, title, description, columnId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
      queryClient.invalidateQueries({ queryKey: boardKeys.tasks() });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      title,
      description,
    }: {
      id: string;
      title: string;
      description: string;
    }) => apiClient.updateTask(id, title, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
      queryClient.invalidateQueries({ queryKey: boardKeys.tasks() });
    },
  });
}

export function useMoveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      newColumnId,
    }: {
      taskId: string;
      newColumnId: string;
    }) => apiClient.moveTask(taskId, newColumnId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
      queryClient.invalidateQueries({ queryKey: boardKeys.tasks() });
    },
  });
}

export function useReorderTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tasks }: { tasks: Task[] }) => apiClient.reorderTasks(tasks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
      queryClient.invalidateQueries({ queryKey: boardKeys.tasks() });
    },
  });
}

export function useReorderColumns() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ columns }: { columns: Column[] }) =>
      apiClient.reorderColumns(columns),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
      queryClient.invalidateQueries({ queryKey: boardKeys.columns() });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => apiClient.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
      queryClient.invalidateQueries({ queryKey: boardKeys.tasks() });
    },
  });
}

export function useDeleteColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => apiClient.deleteColumn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
      queryClient.invalidateQueries({ queryKey: boardKeys.columns() });
    },
  });
}
