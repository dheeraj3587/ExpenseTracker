import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { HttpError } from '../middleware/errorHandler.js';
import type { CreateTaskInput, Task, UpdateTaskInput } from '../types/task.js';

const DATA_FILE = join(process.cwd(), 'data', 'tasks.json');
const TEMP_FILE = `${DATA_FILE}.tmp`;

const sortByOrder = (tasks: Task[]): Task[] =>
  [...tasks].sort((first, second) => first.order - second.order || Date.parse(first.createdAt) - Date.parse(second.createdAt));

const reindexTasks = (tasks: Task[]): Task[] => sortByOrder(tasks).map((task, index) => ({ ...task, order: index }));

const ensureDataFile = async (): Promise<void> => {
  await mkdir(dirname(DATA_FILE), { recursive: true });

  try {
    await readFile(DATA_FILE, 'utf8');
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      await writeFile(DATA_FILE, '[]', 'utf8');
      return;
    }

    throw error;
  }
};

const readTasks = async (): Promise<Task[]> => {
  await ensureDataFile();
  const contents = await readFile(DATA_FILE, 'utf8');

  if (!contents.trim()) {
    return [];
  }

  const parsed = JSON.parse(contents) as Task[];
  const migrated = parsed.map((task) => ({
    ...task,
    priority: task.priority ?? 'medium',
    category: task.category ?? 'General',
  }));
  return sortByOrder(migrated);
};

const writeTasks = async (tasks: Task[]): Promise<void> => {
  const orderedTasks = reindexTasks(tasks);
  await mkdir(dirname(DATA_FILE), { recursive: true });
  await writeFile(TEMP_FILE, `${JSON.stringify(orderedTasks, null, 2)}\n`, 'utf8');
  await rename(TEMP_FILE, DATA_FILE);
};

export const taskService = {
  async getTasks(): Promise<Task[]> {
    return readTasks();
  },

  async createTask(input: CreateTaskInput): Promise<Task> {
    const tasks = await readTasks();
    const nextOrder = tasks.length === 0 ? 0 : Math.max(...tasks.map((task) => task.order)) + 1;

    const task: Task = {
      id: randomUUID(),
      title: input.title.trim(),
      description: input.description?.trim() ?? '',
      dueDate: input.dueDate ?? '',
      completed: false,
      priority: input.priority ?? 'medium',
      category: input.category?.trim() || 'General',
      createdAt: new Date().toISOString(),
      order: nextOrder,
    };

    await writeTasks([...tasks, task]);
    return task;
  },

  async updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
    const tasks = await readTasks();
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      throw new HttpError(404, 'Task not found.');
    }

    const currentTask = tasks[taskIndex];

    if (!currentTask) {
      throw new HttpError(404, 'Task not found.');
    }

    const updatedTask: Task = {
      ...currentTask,
      ...input,
      title: input.title?.trim() ?? currentTask.title,
      description: input.description?.trim() ?? currentTask.description,
      dueDate: input.dueDate ?? currentTask.dueDate,
      priority: input.priority ?? currentTask.priority,
      category: input.category?.trim() ?? currentTask.category,
    };

    tasks[taskIndex] = updatedTask;
    await writeTasks(tasks);
    return updatedTask;
  },

  async toggleTask(id: string): Promise<Task> {
    const tasks = await readTasks();
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      throw new HttpError(404, 'Task not found.');
    }

    const currentTask = tasks[taskIndex];

    if (!currentTask) {
      throw new HttpError(404, 'Task not found.');
    }

    const updatedTask = { ...currentTask, completed: !currentTask.completed };
    tasks[taskIndex] = updatedTask;

    await writeTasks(tasks);
    return updatedTask;
  },

  async deleteTask(id: string): Promise<void> {
    const tasks = await readTasks();
    const remainingTasks = tasks.filter((task) => task.id !== id);

    if (remainingTasks.length === tasks.length) {
      throw new HttpError(404, 'Task not found.');
    }

    await writeTasks(remainingTasks);
  },

  async reorderTasks(orderedIds: string[]): Promise<Task[]> {
    const tasks = await readTasks();
    const uniqueIds = new Set(orderedIds);

    if (uniqueIds.size !== orderedIds.length) {
      throw new HttpError(400, 'Task ids must be unique.');
    }

    if (orderedIds.length !== tasks.length || orderedIds.some((id) => !tasks.some((task) => task.id === id))) {
      throw new HttpError(400, 'Reorder payload must include every existing task exactly once.');
    }

    const taskById = new Map(tasks.map((task) => [task.id, task]));
    const reorderedTasks = orderedIds.map((id, index) => ({ ...taskById.get(id)!, order: index }));

    await writeTasks(reorderedTasks);
    return reorderedTasks;
  },
};
