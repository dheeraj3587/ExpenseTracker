import { z } from 'zod';

const dateString = z.string().trim().refine((value) => value === '' || !Number.isNaN(Date.parse(value)), {
  message: 'Due date must be a valid date.',
});

const optionalDateString = dateString.optional().transform((value) => value ?? '');

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.').max(120, 'Title must be 120 characters or less.'),
  description: z.string().trim().max(700, 'Description must be 700 characters or less.').optional().default(''),
  dueDate: optionalDateString,
  priority: z.enum(['critical', 'high', 'medium', 'low']).optional().default('medium'),
  category: z.string().trim().max(50).optional().default('General'),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required.').max(120, 'Title must be 120 characters or less.').optional(),
    description: z.string().trim().max(700, 'Description must be 700 characters or less.').optional(),
    dueDate: dateString.optional(),
    completed: z.boolean().optional(),
    priority: z.enum(['critical', 'high', 'medium', 'low']).optional(),
    category: z.string().trim().max(50).optional(),
    order: z.number().int().min(0).optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'At least one field must be provided.',
  });

export const reorderTaskSchema = z.object({
  orderedIds: z.array(z.string().min(1)).min(1, 'At least one task id is required.'),
});

export type CreateTaskPayload = z.infer<typeof createTaskSchema>;
export type UpdateTaskPayload = z.infer<typeof updateTaskSchema>;
export type ReorderTaskPayload = z.infer<typeof reorderTaskSchema>;
