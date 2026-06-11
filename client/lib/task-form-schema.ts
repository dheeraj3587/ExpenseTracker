import { z } from 'zod';

export const taskFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.').max(120, 'Keep titles under 120 characters.'),
  description: z.string().trim().max(700, 'Keep descriptions under 700 characters.').optional().default(''),
  dueDate: z.string().optional().default(''),
});

export type TaskFormSchema = z.infer<typeof taskFormSchema>;
