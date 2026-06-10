export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  status: 'active' | 'completed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  dueDate: string; // YYYY-MM-DD or empty string
  createdAt: string; // YYYY-MM-DD
  order?: number;
}

export type DisplayStatus = 'active' | 'completed' | 'overdue';

export type Page = 'dashboard' | 'tasks' | 'completed' | 'settings';

export type TaskFilter = 'all' | 'active' | 'completed';

export interface TaskFormValues {
  title: string;
  description: string;
  dueDate: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
}

export interface TaskStats {
  total: number;
  active: number;
  completed: number;
  overdue: number;
}
