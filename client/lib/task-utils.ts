import type { Task, DisplayStatus, TaskStats } from '@/types/task';

// Re-export so consumers only need one import
export type { TaskStats };

export const getDisplayStatus = (task: Task): DisplayStatus => {
  if (task.status === 'completed') return 'completed';

  if (task.dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    if (due < today) return 'overdue';
  }

  return 'active';
};

export const isOverdue = (task: Task): boolean => getDisplayStatus(task) === 'overdue';

export const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date);
};

export const formatDateFull = (dateStr: string | undefined): string => {
  if (!dateStr) return 'No date set';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

export const getTaskStats = (tasks: Task[]): TaskStats => ({
  total: tasks.length,
  active: tasks.filter((t) => t.status === 'active' && !isOverdue(t)).length,
  completed: tasks.filter((t) => t.status === 'completed').length,
  overdue: tasks.filter((t) => isOverdue(t)).length,
});

export const generateId = (): string =>
  `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const getTodayString = (): string => new Date().toISOString().split('T')[0] ?? '';

export const sortTasksByDate = (tasks: Task[]): Task[] =>
  [...tasks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
