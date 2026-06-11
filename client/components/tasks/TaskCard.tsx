import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CalendarClock, Clock3, GripVertical, Pencil, Trash2, TriangleAlert } from 'lucide-react';
import type { Task } from '@/types/task';
import { getDisplayStatus, formatDate } from '@/lib/task-utils';
import { DeleteConfirmComponent } from '@/components/ui/delete-confirm-button';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEditOpen: (task: Task) => void;
  onDelete: (id: string) => void;
  dragEnabled?: boolean;
}

const PRIORITY_CONFIG = {
  critical: { bar: 'var(--error)', badgeClass: 'badge-critical', label: 'Critical' },
  high:     { bar: 'var(--warning)', badgeClass: 'badge-high',     label: 'High' },
  medium:   { bar: 'var(--accent)', badgeClass: 'badge-medium',   label: 'Medium' },
  low:      { bar: 'var(--text-muted)', badgeClass: 'badge-low',      label: 'Low' },
} as const;

export function TaskCard({ task, onToggle, onEditOpen, onDelete, dragEnabled = false }: TaskCardProps) {
  const displayStatus = getDisplayStatus(task);
  const overdue = displayStatus === 'overdue';
  const completed = task.status === 'completed';
  const priority = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.medium;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: !dragEnabled });

  const style = {
    background: 'var(--bg-card)',
    border: overdue ? '1px solid rgba(239,68,68,0.25)' : '1px solid var(--border)',
    borderRadius: 'var(--r-lg)',
    padding: '18px 20px 18px 24px',
    marginBottom: 10,
    boxShadow: 'var(--shadow-card)',
    position: 'relative' as const,
    overflow: 'hidden',
    opacity: completed ? 0.65 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 40 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      whileHover={
        completed
          ? {}
          : {
              y: -4,
              boxShadow: '0 12px 20px rgba(0, 0, 0, 0.06), 0 4px 8px rgba(0, 0, 0, 0.04)',
            }
      }
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={style}
    >
      {/* Priority bar */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 3,
        borderRadius: '14px 0 0 14px',
        background: priority.bar,
        opacity: completed ? 0.4 : 1,
      }} />

      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>

        {/* Drag Handle */}
        {dragEnabled && (
          <div
            {...attributes}
            {...listeners}
            style={{
              cursor: 'grab',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              width: 14,
              height: 20,
              flexShrink: 0,
              marginTop: 1,
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <GripVertical size={14} />
          </div>
        )}

        {/* Checkbox */}
        <button
          type="button"
          role="checkbox"
          aria-checked={completed}
          aria-label={completed ? 'Mark as active' : 'Mark as complete'}
          onClick={() => onToggle(task.id)}
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: `2px solid ${completed ? 'var(--status-completed-text)' : 'var(--border-strong)'}`,
            background: completed ? 'var(--status-completed-text)' : 'transparent',
            cursor: 'pointer',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
            marginTop: 1,
          }}
        >
          {completed && (
            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
              <path d="M1 3.5L3.2 5.8L8 1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Badge row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7, flexWrap: 'wrap' }}>
            <span className={`badge ${priority.badgeClass}`}>{priority.label}</span>
            {task.category && <span className="badge badge-category">{task.category}</span>}
            {displayStatus === 'completed' && <span className="badge badge-completed">Completed</span>}
            {overdue && (
              <span className="badge badge-overdue" style={{ display: 'inline-flex', gap: 3, alignItems: 'center' }}>
                <TriangleAlert size={10} />
                Overdue
              </span>
            )}
          </div>

          {/* Title */}
          <h3 style={{
            fontSize: 14.5,
            fontWeight: 600,
            color: completed ? 'var(--text-muted)' : 'var(--text-primary)',
            textDecoration: completed ? 'line-through' : 'none',
            textDecorationColor: 'rgba(100,116,139,0.5)',
            lineHeight: 1.4,
            marginBottom: task.description ? 5 : 10,
            wordBreak: 'break-word',
            letterSpacing: '-0.01em',
          }}>
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p style={{
              fontSize: 12.5,
              color: 'var(--text-muted)',
              lineHeight: 1.55,
              marginBottom: 11,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as const,
              overflow: 'hidden',
            }}>
              {task.description}
            </p>
          )}

          {/* Meta row */}
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            <span className="meta-chip">
              <CalendarClock size={11} style={{ color: overdue ? 'var(--error-text)' : 'var(--accent)', flexShrink: 0 }} />
              {task.dueDate ? `Due ${formatDate(task.dueDate)}` : 'No due date'}
            </span>
            <span className="meta-chip">
              <Clock3 size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              {formatDate(task.createdAt)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0 }}>
          <button type="button" className="btn-ghost-icon" aria-label="Edit" onClick={() => onEditOpen(task)}>
            <Pencil size={13} />
          </button>
          <DeleteConfirmComponent 
            taskId={task.id} 
            onConfirm={() => onDelete(task.id)} 
          />
        </div>
      </div>
    </motion.div>
  );
}
