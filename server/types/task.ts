export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  createdAt: string;
  order: number;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  category?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  dueDate?: string;
  completed?: boolean;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  category?: string;
  order?: number;
}
