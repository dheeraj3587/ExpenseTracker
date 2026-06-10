import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { logActivity } from '@/lib/activity';
import type { Task, TaskFormValues } from '@/types/task';

export const TASKS_QUERY_KEY = ['tasks'] as const;

export function useTasksQuery() {
  return useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: () => api.getTasks(),
  });
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: TaskFormValues) => api.createTask(values),
    onSuccess: (newTask) => {
      // Optimistic update client cache
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old = []) => [newTask, ...old]);
      // Log task creation activity
      logActivity({
        type: 'created',
        taskTitle: newTask.title,
        taskId: newTask.id,
        timestamp: Date.now(),
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: TaskFormValues }) =>
      api.updateTask(id, values),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old = []) =>
        old.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
      logActivity({
        type: 'updated',
        taskTitle: updatedTask.title,
        taskId: updatedTask.id,
        timestamp: Date.now(),
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
}

export function useToggleTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.toggleTask(id),
    // Optimistic Update
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY);

      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old = []) =>
        old.map((t) =>
          t.id === id
            ? {
                ...t,
                completed: !t.completed,
                status: t.completed ? 'active' : 'completed',
              }
            : t
        )
      );

      return { previousTasks };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previousTasks);
      }
    },
    onSuccess: (updatedTask) => {
      const newType = updatedTask.completed ? 'completed' : 'uncompleted';
      logActivity({
        type: newType,
        taskTitle: updatedTask.title,
        taskId: updatedTask.id,
        timestamp: Date.now(),
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteTask(id),
    // Optimistic Update
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY);

      // Find the task title before deleting to log activity
      const taskToDelete = previousTasks?.find((t) => t.id === id);

      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old = []) =>
        old.filter((t) => t.id !== id)
      );

      return { previousTasks, taskToDelete };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previousTasks);
      }
    },
    onSuccess: (_data, id, context) => {
      if (context?.taskToDelete) {
        logActivity({
          type: 'deleted',
          taskTitle: context.taskToDelete.title,
          taskId: id,
          timestamp: Date.now(),
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
}

export function useReorderTasksMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderedIds: string[]) => api.reorderTasks(orderedIds),
    onMutate: async (orderedIds) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY);

      if (previousTasks) {
        const taskById = new Map(previousTasks.map((t) => [t.id, t]));
        const reordered = orderedIds
          .map((id) => taskById.get(id))
          .filter((t): t is Task => !!t);

        // Retain any tasks not in the reordered list (just in case)
        const remainder = previousTasks.filter((t) => !orderedIds.includes(t.id));
        queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, [...reordered, ...remainder]);
      }

      return { previousTasks };
    },
    onError: (_err, _orderedIds, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
}
