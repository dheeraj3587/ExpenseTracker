import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import type { Task, TaskFormValues } from '@/types/task';
import { getTaskStats } from '@/lib/task-utils';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { TaskList } from '@/components/tasks/TaskList';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { OnboardingChecklist, type Step } from '@/components/ui/onboarding-checklist';

interface DashboardPageProps {
  tasks: Task[];
  onCreate: (values: TaskFormValues) => void;
  onUpdate: (id: string, values: TaskFormValues) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder?: (orderedIds: string[]) => void;
  searchQuery: string;
  isLoading?: boolean;
}

export function DashboardPage({
  tasks,
  onCreate,
  onUpdate,
  onToggle,
  onDelete,
  onReorder,
  searchQuery,
  isLoading = false,
}: DashboardPageProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const stats = getTaskStats(tasks);

  const hasCreatedTask = tasks.length > 0;
  const hasCompletedTask = tasks.some(t => t.status === 'completed');
  const hasThreeTasks = tasks.length >= 3;
  
  const onboardingSteps: Step[] = [
    { id: 1, title: "Create your first task", isCompleted: hasCreatedTask, onClick: () => setCreateOpen(true) },
    { id: 2, title: "Mark a task as completed", isCompleted: hasCompletedTask },
    { id: 3, title: "Explore your workspace (Create 3 tasks)", isCompleted: hasThreeTasks, onClick: () => setCreateOpen(true) },
  ];
  
  const allOnboardingCompleted = onboardingSteps.every(s => s.isCompleted);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
      {/* ── Compact hero ── */}
      <section style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
        <div style={{ marginBottom: 12 }}>
          <span className="eyebrow">
            <Sparkles size={10} />
            Task workspace
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 className="display-xl" style={{ marginBottom: 8 }}>
              Turn scattered work into
              <br />
              <em>ordered momentum.</em>
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 420, lineHeight: 1.6 }}>
              {stats.total === 0
                ? 'You have a clean slate. Start by creating your first task.'
                : `${stats.active} active, ${stats.completed} completed${stats.overdue > 0 ? `, ${stats.overdue} overdue` : ''}.`}
            </p>
          </div>
        </div>
      </section>

      {/* ── Onboarding ── */}
      {!allOnboardingCompleted && (
        <section style={{ marginBottom: 28 }}>
          <OnboardingChecklist steps={onboardingSteps} title="Getting Started" />
        </section>
      )}

      {/* ── Stats grid ── */}
      <section style={{ marginBottom: 28 }}>
        <StatsGrid stats={stats} />
      </section>

      {/* ── Task queue ── */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <p className="text-11" style={{ marginBottom: 3 }}>Workspace queue</p>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Tasks</h2>
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
      </section>

      {createOpen && <CreateTaskModal onClose={() => setCreateOpen(false)} onCreate={(values) => { onCreate(values); setCreateOpen(false); }} />}
    </motion.div>
  );
}
