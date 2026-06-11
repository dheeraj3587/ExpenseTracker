import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Task, TaskFilter, TaskFormValues } from '@/types/task';
import { getDisplayStatus, sortTasksByDate } from '@/lib/task-utils';
import { TaskCard } from './TaskCard';
import { TaskEmptyState } from './EmptyState';
import { EditTaskModal } from './EditTaskModal';
import { Skeleton } from '@/components/ui/skeleton';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, values: TaskFormValues) => void;
  onDelete: (id: string) => void;
  onReorder?: (orderedIds: string[]) => void;
  onCreateClick?: () => void;
  onCreateTask?: (values: TaskFormValues) => void;
  searchQuery: string;
  defaultFilter?: TaskFilter;
  showFilterTabs?: boolean;
  isLoading?: boolean;
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const FILTERS: Array<{ value: TaskFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export function TaskList({
  tasks,
  onToggle,
  onUpdate,
  onDelete,
  onReorder,
  onCreateClick,
  onCreateTask,
  searchQuery,
  defaultFilter = 'all',
  showFilterTabs = true,
  isLoading = false,
}: TaskListProps) {
  const [filter, setFilter] = useState<TaskFilter>(defaultFilter);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const isDragEnabled = filter === 'all' && !searchQuery.trim();

  // If drag reordering is enabled, sort by 'order' index. Otherwise sort by date.
  const sorted = isDragEnabled
    ? [...tasks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : sortTasksByDate(tasks);

  const filtered = sorted.filter((task) => {
    const display = getDisplayStatus(task);
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && (display === 'active' || display === 'overdue')) ||
      (filter === 'completed' && display === 'completed');

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      task.title.toLowerCase().includes(q) ||
      task.description.toLowerCase().includes(q) ||
      task.category.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = filtered.findIndex((t) => t.id === active.id);
      const newIndex = filtered.findIndex((t) => t.id === over.id);
      const reordered = arrayMove(filtered, oldIndex, newIndex);
      if (onReorder) {
        onReorder(reordered.map((t) => t.id));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            style={{
              height: 106,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)',
              padding: '18px 20px 18px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', gap: 6 }}>
              <Skeleton className="h-4 w-14 rounded-full" />
              <Skeleton className="h-4 w-12 rounded-full" />
            </div>
            <Skeleton className="h-5 w-[45%]" />
            <div style={{ display: 'flex', gap: 6 }}>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {showFilterTabs && (
        <div className="filter-tabs" style={{ marginBottom: 18 }}>
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`filter-tab${filter === value ? ' active' : ''}`}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <TaskEmptyState
          filter={filter}
          hasAnyTasks={tasks.length > 0}
          searchQuery={searchQuery}
          onCreateClick={filter === 'all' && !searchQuery ? onCreateClick : undefined}
          onCreateTask={filter === 'all' && !searchQuery ? onCreateTask : undefined}
        />
      ) : isDragEnabled ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filtered.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <motion.div variants={listVariants} initial="hidden" animate="visible">
              <AnimatePresence mode="popLayout">
                {filtered.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onEditOpen={setEditingTask}
                    onDelete={onDelete}
                    dragEnabled={true}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </SortableContext>
        </DndContext>
      ) : (
        <motion.div variants={listVariants} initial="hidden" animate="visible">
          <AnimatePresence mode="popLayout">
            {filtered.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={onToggle}
                onEditOpen={setEditingTask}
                onDelete={onDelete}
                dragEnabled={false}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}
