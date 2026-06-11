import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarClock,
  CheckCircle2,
  FilePlus,
  Pencil,
  Trash2,
  TrendingUp,
  TriangleAlert,
  UndoDot,
  Zap,
} from 'lucide-react';
import type { Task } from '@/types/task';
import type { ActivityItem } from '@/lib/activity';
import { timeAgo } from '@/lib/activity';
import { formatDate, getDisplayStatus, getTaskStats } from '@/lib/task-utils';

interface InsightsPanelProps {
  tasks: Task[];
  activities: ActivityItem[];
}

/* ── Animated number ── */
function AnimatedNumber({ value, duration = 0.8 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const diff = value - from;
    const start = performance.now();
    startRef.current = start;

    const step = (now: number) => {
      const elapsed = (now - start) / (duration * 1000);
      const progress = Math.min(elapsed, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + diff * ease));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        fromRef.current = value;
      }
    };

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  return <span>{display}</span>;
}

/* ── Weekly bar chart ── */
function WeeklyChart({ tasks }: { tasks: Task[] }) {
  const days: Array<{ label: string; dateStr: string }> = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push({
      label: d.toLocaleDateString('en', { weekday: 'short' }),
      dateStr: d.toISOString().split('T')[0] ?? '',
    });
  }

  const data = days.map(({ label, dateStr }) => ({
    label,
    created: tasks.filter((t) => t.createdAt === dateStr).length,
    completed: tasks.filter((t) => t.status === 'completed' && t.createdAt === dateStr).length,
  }));

  const maxVal = Math.max(...data.map((d) => d.created), 1);
  const barH = 48;

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: barH + 20 }}>
        {data.map(({ label, created, completed }, i) => {
          const height = Math.max((created / maxVal) * barH, created > 0 ? 4 : 0);
          const completedH = Math.max((completed / maxVal) * barH, completed > 0 ? 4 : 0);

          return (
            <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: '100%', height: barH, display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
                {/* Created bar */}
                <motion.div
                  style={{
                    width: '100%',
                    borderRadius: '4px 4px 0 0',
                    background: 'var(--accent)',
                    opacity: 0.2,
                    position: 'absolute',
                    bottom: 0,
                  }}
                  initial={{ height: 0 }}
                  animate={{ height }}
                  transition={{ delay: i * 0.04, duration: 0.4, ease: 'easeOut' }}
                />
                {/* Completed bar (stacked) */}
                {completedH > 0 && (
                  <motion.div
                    style={{
                      width: '100%',
                      borderRadius: '4px 4px 0 0',
                      background: 'var(--success-text)',
                      opacity: 0.5,
                      position: 'absolute',
                      bottom: 0,
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: completedH }}
                    transition={{ delay: i * 0.04 + 0.1, duration: 0.4, ease: 'easeOut' }}
                  />
                )}
              </div>
              <span style={{ fontSize: 9.5, color: 'var(--text-muted)', textAlign: 'center' }}>{label}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--accent)', opacity: 0.6 }} />
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Created</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--success-text)' }} />
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Completed</span>
        </div>
      </div>
    </div>
  );
}

/* ── Activity icon ── */
const activityConfig: Record<ActivityItem['type'], { Icon: typeof CheckCircle2; color: string; label: string }> = {
  created:     { Icon: FilePlus,    color: 'var(--accent)',        label: 'Created' },
  completed:   { Icon: CheckCircle2, color: 'var(--success-text)', label: 'Completed' },
  uncompleted: { Icon: UndoDot,     color: 'var(--warning-text)',  label: 'Reopened' },
  updated:     { Icon: Pencil,      color: 'var(--text-muted)',    label: 'Updated' },
  deleted:     { Icon: Trash2,      color: 'var(--error-text)',    label: 'Deleted' },
};

export function InsightsPanel({ tasks, activities }: InsightsPanelProps) {
  const stats = getTaskStats(tasks);
  const completionRate = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

  /* Upcoming deadlines: active tasks with dueDate, sorted by closest */
  const upcoming = tasks
    .filter((t) => t.status === 'active' && t.dueDate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  return (
    <aside className="app-insights">
      {/* ── Panel header ── */}
      <div style={{ padding: '20px 18px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 7 }}>
        <Zap size={14} style={{ color: 'var(--accent)' }} />
        <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>Insights</span>
      </div>

      {/* ── Upcoming deadlines ── */}
      <div className="insights-section">
        <p className="text-11" style={{ marginBottom: 10 }}>Upcoming Deadlines</p>

        {upcoming.length === 0 ? (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>No upcoming deadlines.</p>
        ) : (
          upcoming.map((task, i) => {
            const display = getDisplayStatus(task);
            const overdue = display === 'overdue';
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 8,
                  padding: '8px 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7, minWidth: 0 }}>
                  {overdue
                    ? <TriangleAlert size={12} style={{ color: 'var(--error-text)', flexShrink: 0, marginTop: 2 }} />
                    : <CalendarClock size={12} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                  }
                  <span style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical' as const,
                  }}>
                    {task.title}
                  </span>
                </div>
                <span style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: overdue ? 'var(--error-text)' : 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}>
                  {formatDate(task.dueDate)}
                </span>
              </motion.div>
            );
          })
        )}
      </div>

      {/* ── Weekly chart ── */}
      <div className="insights-section">
        <p className="text-11" style={{ marginBottom: 10 }}>Weekly Activity</p>
        <WeeklyChart tasks={tasks} />
      </div>

      {/* ── Productivity summary ── */}
      <div className="insights-section">
        <p className="text-11" style={{ marginBottom: 10 }}>Productivity</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: 'Completion', value: completionRate, suffix: '%', color: 'var(--success-text)' },
            { label: 'Total tasks', value: stats.total, suffix: '', color: 'var(--accent)' },
            { label: 'Overdue', value: stats.overdue, suffix: '', color: 'var(--error-text)' },
            { label: 'Active', value: stats.active, suffix: '', color: 'var(--warning-text)' },
          ].map(({ label, value, suffix, color }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '10px 11px',
            }}>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{label}</p>
              <p style={{ fontSize: 20, fontWeight: 700, color, lineHeight: 1 }}>
                <AnimatedNumber value={value} />{suffix}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Activity feed ── */}
      <div className="insights-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <p className="text-11">Recent Activity</p>
          <TrendingUp size={12} style={{ color: 'var(--accent)' }} />
        </div>

        {activities.slice(0, 8).map((activity, i) => {
          const cfg = activityConfig[activity.type];
          const { Icon } = cfg;
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 9,
                padding: '7px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div style={{
                width: 24,
                height: 24,
                borderRadius: 7,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={11} style={{ color: cfg.color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 11.5,
                  color: 'var(--text-secondary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical' as const,
                  lineHeight: 1.4,
                }}>
                  <span style={{ color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>
                  {' '}
                  {activity.taskTitle}
                </p>
                <p style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 2 }}>{timeAgo(activity.timestamp)}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </aside>
  );
}
