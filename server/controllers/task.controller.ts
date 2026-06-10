import type { Request, RequestHandler } from 'express';
import { HttpError } from '../middleware/errorHandler.js';
import { createTaskSchema, reorderTaskSchema, updateTaskSchema } from '../schemas/task.schema.js';
import { taskService } from '../services/task.service.js';

const getTaskId = (request: Request): string => {
  const { id } = request.params;

  if (!id) {
    throw new HttpError(400, 'Task id is required.');
  }

  return id;
};

const getUserId = (request: Request): string => {
  return (request.headers['x-user-id'] as string) || 'default-user';
};

export const getTasks: RequestHandler = async (request, response) => {
  const tasks = await taskService.getTasks(getUserId(request));
  response.json(tasks);
};

export const createTask: RequestHandler = async (request, response) => {
  const payload = createTaskSchema.parse(request.body);
  const task = await taskService.createTask(getUserId(request), payload);
  response.status(201).json(task);
};

export const updateTask: RequestHandler = async (request, response) => {
  const payload = updateTaskSchema.parse(request.body);
  const task = await taskService.updateTask(getUserId(request), getTaskId(request), payload);
  response.json(task);
};

export const toggleTask: RequestHandler = async (request, response) => {
  const task = await taskService.toggleTask(getUserId(request), getTaskId(request));
  response.json(task);
};

export const deleteTask: RequestHandler = async (request, response) => {
  await taskService.deleteTask(getUserId(request), getTaskId(request));
  response.status(204).send();
};

export const reorderTasks: RequestHandler = async (request, response) => {
  const payload = reorderTaskSchema.parse(request.body);
  const tasks = await taskService.reorderTasks(getUserId(request), payload.orderedIds);
  response.json(tasks);
};
