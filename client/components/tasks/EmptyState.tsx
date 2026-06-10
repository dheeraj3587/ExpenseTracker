import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { CheckCircle2, Inbox, SearchX } from 'lucide-react';
import type { TaskFilter, TaskFormValues } from '@/types/task';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-icon-wrap">
        <Icon size={22} />
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{title}</h3>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 320, lineHeight: 1.6, marginBottom: action ? 20 : 0 }}>
        {description}
      </p>
      {action}
    </div>
  );
}

interface TaskEmptyStateProps {
  filter: TaskFilter;
  hasAnyTasks: boolean;
  searchQuery: string;
  onCreateClick?: () => void;
  onCreateTask?: (values: TaskFormValues) => void;
}

export function TaskEmptyState({ filter, hasAnyTasks, searchQuery, onCreateClick, onCreateTask }: TaskEmptyStateProps) {
  if (searchQuery.trim()) {
    return (
      <EmptyState
        icon={SearchX}
        title="No results"
        description={`Nothing matches "${searchQuery}". Try a shorter keyword or clear the search.`}
      />
    );
  }

  if (!hasAnyTasks) {
    return (
      <EmptyState
        icon={Inbox}
        title="No tasks yet"
        description="Create your first task and bring some structure to your week."
      />
    );
  }

  if (filter === 'completed') {
    return (
      <EmptyState
        icon={CheckCircle2}
        title="Nothing completed yet"
        description="Completed tasks will appear here. Mark a task done to see it reflect here."
      />
    );
  }

  return (
    <EmptyState
      icon={Inbox}
      title="All caught up"
      description="Everything active is complete. Create a new task or switch to All."
    />
  );
}
