import { useState } from 'react';
import type { Task, TaskFormValues } from '@/types/task';
import { TaskList } from '@/components/tasks/TaskList';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';

interface TasksPageProps {
  tasks: Task[];
  onCreate: (values: TaskFormValues) => void;
  onUpdate: (id: string, values: TaskFormValues) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder?: (orderedIds: string[]) => void;
  searchQuery: string;
  isLoading?: boolean;
}

export function TasksPage({
  tasks,
  onCreate,
  onUpdate,
  onToggle,
  onDelete,
  onReorder,
  searchQuery,
  isLoading = false,
}: TasksPageProps) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <div style={{ marginBottom: 30, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, paddingBottom: 22, borderBottom: '1px solid var(--border)' }}>
        <div>
          <p className="text-11" style={{ marginBottom: 5 }}>Operations center</p>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>Tasks</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 4 }}>
            {tasks.length === 0 ? 'No tasks yet.' : `${tasks.length} task${tasks.length === 1 ? '' : 's'} in this workspace.`}
          </p>
        </div>
      </div>

      <TaskList
        tasks={tasks}
        onToggle={onToggle}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onReorder={onReorder}
        onCreateClick={() => setCreateOpen(true)}
        onCreateTask={(values) => { onCreate(values); setCreateOpen(false); }}
        searchQuery={searchQuery}
        showFilterTabs
        isLoading={isLoading}
      />

      {createOpen && <CreateTaskModal onClose={() => setCreateOpen(false)} onCreate={(values) => { onCreate(values); setCreateOpen(false); }} />}
    </>
  );
}
