import { HttpError } from '../middleware/errorHandler.js';
import { supabase } from './supabase.js';
import type { CreateTaskInput, Task, UpdateTaskInput } from '../types/task.js';

// Helper to map DB row to server Task interface
const mapRow = (row: any): Task => ({
  id: row.id,
  title: row.title,
  description: row.description ?? '',
  dueDate: row.due_date ?? '',
  completed: !!row.completed,
  priority: row.priority ?? 'medium',
  category: row.category ?? 'General',
  createdAt: row.created_at ?? new Date().toISOString(),
  order: row.order_index ?? 0,
});

export const taskService = {
  async getTasks(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('order_index', { ascending: true });

    if (error) {
      throw new HttpError(500, `Database error: ${error.message}`);
    }

    return (data || []).map(mapRow);
  },

  async createTask(userId: string, input: CreateTaskInput): Promise<Task> {
    // Get next order index for this user
    const { data: maxData, error: maxError } = await supabase
      .from('tasks')
      .select('order_index')
      .eq('user_id', userId)
      .order('order_index', { ascending: false })
      .limit(1);

    if (maxError) {
      throw new HttpError(500, `Database error: ${maxError.message}`);
    }

    const nextOrder = maxData && maxData.length > 0 && maxData[0] ? (maxData[0].order_index ?? 0) + 1 : 0;

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: userId,
        title: input.title.trim(),
        description: input.description?.trim() ?? '',
        due_date: input.dueDate ?? '',
        completed: false,
        priority: input.priority ?? 'medium',
        category: input.category?.trim() || 'General',
        order_index: nextOrder,
      })
      .select()
      .single();

    if (error) {
      throw new HttpError(500, `Database error: ${error.message}`);
    }

    return mapRow(data);
  },

  async updateTask(userId: string, id: string, input: UpdateTaskInput): Promise<Task> {
    const updateData: any = {};
    if (input.title !== undefined) updateData.title = input.title.trim();
    if (input.description !== undefined) updateData.description = input.description.trim();
    if (input.dueDate !== undefined) updateData.due_date = input.dueDate;
    if (input.completed !== undefined) updateData.completed = input.completed;
    if (input.priority !== undefined) updateData.priority = input.priority;
    if (input.category !== undefined) updateData.category = input.category.trim();
    if (input.order !== undefined) updateData.order_index = input.order;

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new HttpError(404, 'Task not found.');
      }
      throw new HttpError(500, `Database error: ${error.message}`);
    }

    return mapRow(data);
  },

  async toggleTask(userId: string, id: string): Promise<Task> {
    const { data: current, error: fetchError } = await supabase
      .from('tasks')
      .select('completed')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !current) {
      throw new HttpError(404, 'Task not found.');
    }

    const { data, error } = await supabase
      .from('tasks')
      .update({ completed: !current.completed })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new HttpError(500, `Database error: ${error.message}`);
    }

    return mapRow(data);
  },

  async deleteTask(userId: string, id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new HttpError(500, `Database error: ${error.message}`);
    }
  },

  async reorderTasks(userId: string, orderedIds: string[]): Promise<Task[]> {
    const updates = orderedIds.map((id, index) =>
      supabase
        .from('tasks')
        .update({ order_index: index })
        .eq('id', id)
        .eq('user_id', userId)
    );

    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);
    if (failed) {
      throw new HttpError(500, `Database error during reordering: ${failed.error?.message}`);
    }

    return this.getTasks(userId);
  },
};
