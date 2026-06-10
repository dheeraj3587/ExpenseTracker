import type { Task } from '@/types/task';

const STORAGE_KEY = 'aurora_tasks_v4';

const SEED_TASKS: Task[] = [];

export const loadTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_TASKS;
    const parsed = JSON.parse(raw) as Task[];
    // Migrate legacy tasks missing category/critical fields
    const migrated = parsed.map((t): Task => ({
      ...t,
      category: t.category ?? 'General',
      priority: t.priority ?? 'medium',
    }));
    return Array.isArray(migrated) && migrated.length > 0 ? migrated : SEED_TASKS;
  } catch {
    return SEED_TASKS;
  }
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Quota exceeded — not critical
  }
};

export const clearTasks = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};
