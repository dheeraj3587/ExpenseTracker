import { Router } from 'express';
import { createTask, deleteTask, getTasks, reorderTasks, toggleTask, updateTask } from '../controllers/task.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const taskRouter = Router();

taskRouter.get('/', asyncHandler(getTasks));
taskRouter.post('/', asyncHandler(createTask));
taskRouter.patch('/reorder', asyncHandler(reorderTasks));
taskRouter.put('/:id', asyncHandler(updateTask));
taskRouter.patch('/:id/toggle', asyncHandler(toggleTask));
taskRouter.delete('/:id', asyncHandler(deleteTask));
