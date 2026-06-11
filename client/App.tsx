import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { AppShell } from '@/components/dashboard/AppShell';
import { DashboardPage } from '@/pages/DashboardPage';
import { TasksPage } from '@/pages/TasksPage';
import { CompletedPage } from '@/pages/CompletedPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { MorphingCreateTask } from '@/components/tasks/MorphingCreateTask';
import { api } from '@/services/api';
import { clearTasks } from '@/lib/storage';
import { clearActivities } from '@/lib/activity';
import {
  useTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useToggleTaskMutation,
  useDeleteTaskMutation,
  useReorderTasksMutation,
  TASKS_QUERY_KEY,
} from '@/hooks/useTasks';
import type { Task, Page, TaskFormValues } from '@/types/task';

type Theme = 'dark' | 'light';

const getInitialTheme = (): Theme =>
  (localStorage.getItem('theme') as Theme | null) === 'light' ? 'light' : 'dark';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const queryClient = useQueryClient();

  // Queries & Mutations
  const { data: tasks = [], isLoading } = useTasksQuery();
  const createTaskMutation = useCreateTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();
  const toggleTaskMutation = useToggleTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();
  const reorderTasksMutation = useReorderTasksMutation();

  /* Sync theme to DOM */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  /* ── CRUD Mutations ── */
  const createTask = (values: TaskFormValues): void => {
    createTaskMutation.mutate(values);
  };

  const updateTask = (id: string, values: TaskFormValues): void => {
    updateTaskMutation.mutate({ id, values });
  };

  const toggleTask = (id: string): void => {
    toggleTaskMutation.mutate(id);
  };

  const deleteTask = (id: string): void => {
    deleteTaskMutation.mutate(id);
  };

  const reorderTasks = (orderedIds: string[]): void => {
    reorderTasksMutation.mutate(orderedIds);
  };

  const handleClearData = (): void => {
    const currentTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY) ?? tasks;
    clearTasks();
    clearActivities();
    // Optimistically empty the cache, then delete every task on the server
    queryClient.setQueryData(TASKS_QUERY_KEY, []);
    void Promise.allSettled(currentTasks.map((task) => api.deleteTask(task.id))).finally(() => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    });
  };

  const sharedTaskProps = {
    tasks,
    onCreate: createTask,
    onUpdate: updateTask,
    onToggle: toggleTask,
    onDelete: deleteTask,
    onReorder: reorderTasks,
    searchQuery,
    isLoading,
  };

  return (
    <>
      <AppShell
        page={page}
        onNavigate={(p: Page) => { setPage(p); setSearchQuery(''); }}
        theme={theme}
        onThemeToggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        tasks={tasks}
      >
        {page === 'dashboard' && <DashboardPage {...sharedTaskProps} />}
        {page === 'tasks' && <TasksPage {...sharedTaskProps} />}
        {page === 'completed' && <CompletedPage {...sharedTaskProps} />}
        {page === 'settings' && (
          <SettingsPage
            theme={theme}
            onThemeToggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            onClearData={handleClearData}
            taskCount={tasks.length}
          />
        )}
      </AppShell>
      {(page === 'dashboard' || page === 'tasks') && (
        <MorphingCreateTask onCreate={createTask} />
      )}
    </>
  );
}
