import type { Task, TaskFormValues } from '@/types/task';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const mapTask = (serverTask: any): Task => ({
  id: serverTask.id,
  title: serverTask.title,
  description: serverTask.description ?? '',
  completed: !!serverTask.completed,
  status: serverTask.completed ? 'completed' : 'active',
  priority: serverTask.priority ?? 'medium',
  category: serverTask.category ?? 'General',
  dueDate: serverTask.dueDate ?? '',
  createdAt: serverTask.createdAt
    ? serverTask.createdAt.split('T')[0]
    : new Date().toISOString().split('T')[0],
  order: typeof serverTask.order === 'number' ? serverTask.order : 0,
});

export const api = {
  async getTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE}/tasks`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    const data = await response.json();
    return Array.isArray(data) ? data.map(mapTask) : [];
  },

  async createTask(values: TaskFormValues): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: values.title.trim(),
        description: values.description.trim(),
        dueDate: values.dueDate || undefined,
        priority: values.priority,
        category: values.category.trim() || 'General',
      }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Failed to create task' }));
      throw new Error(err.message || 'Failed to create task');
    }
    const data = await response.json();
    return mapTask(data);
  },

  async updateTask(id: string, values: TaskFormValues): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: values.title.trim(),
        description: values.description.trim(),
        dueDate: values.dueDate || '',
        priority: values.priority,
        category: values.category.trim(),
      }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Failed to update task' }));
      throw new Error(err.message || 'Failed to update task');
    }
    const data = await response.json();
    return mapTask(data);
  },

  async toggleTask(id: string): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error('Failed to toggle task');
    }
    const data = await response.json();
    return mapTask(data);
  },

  async deleteTask(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  },

  async reorderTasks(orderedIds: string[]): Promise<Task[]> {
    const response = await fetch(`${API_BASE}/tasks/reorder`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderedIds }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Failed to reorder tasks' }));
      throw new Error(err.message || 'Failed to reorder tasks');
    }
    const data = await response.json();
    return Array.isArray(data) ? data.map(mapTask) : [];
  },
};
