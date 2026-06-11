import type { Task, TaskFormValues } from '@/types/task';
import { TaskList } from '@/components/tasks/TaskList';

interface CompletedPageProps {
  tasks: Task[];
  onCreate: (values: TaskFormValues) => void;
  onUpdate: (id: string, values: TaskFormValues) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  isLoading?: boolean;
}

export function CompletedPage({
  tasks,
  onUpdate,
  onToggle,
  onDelete,
  searchQuery,
  isLoading = false,
}: CompletedPageProps) {
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <>
      <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
        <p className="text-11" style={{ marginBottom: 4 }}>Archive</p>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Completed</h1>
        <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 4 }}>
          {completedTasks.length === 0 ? 'Nothing completed yet.' : `${completedTasks.length} task${completedTasks.length === 1 ? '' : 's'} finished.`}
        </p>
      </div>

      <TaskList
        tasks={completedTasks}
        onToggle={onToggle}
        onUpdate={onUpdate}
        onDelete={onDelete}
        searchQuery={searchQuery}
        defaultFilter="completed"
        showFilterTabs={false}
        isLoading={isLoading}
      />
    </>
  );
}
