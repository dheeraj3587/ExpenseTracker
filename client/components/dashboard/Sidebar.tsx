import { motion } from 'framer-motion';
import { CheckCircle2, CircleDashed, LayoutDashboard, Settings, Zap } from 'lucide-react';
import type { Page } from '@/types/task';
import type { TaskStats } from '@/lib/task-utils';

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  stats: TaskStats;
}

const NAV_ITEMS: Array<{ page: Page; label: string; Icon: typeof LayoutDashboard }> = [
  { page: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { page: 'tasks', label: 'Tasks', Icon: CircleDashed },
  { page: 'completed', label: 'Completed', Icon: CheckCircle2 },
  { page: 'settings', label: 'Settings', Icon: Settings },
];

const completionPct = (s: TaskStats) =>
  s.total === 0 ? 0 : Math.round((s.completed / s.total) * 100);

export function Sidebar({ activePage, onNavigate, stats }: SidebarProps) {
  const pct = completionPct(stats);

  return (
    <aside className="app-sidebar">
      {/* ── Logo ── */}
      <div style={{ padding: '24px 18px 18px', display: 'flex', alignItems: 'center', gap: 11 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Zap size={17} style={{ color: '#ffffff', fill: '#ffffff' }} />
        </div>
        <div>
          <div style={{
            fontWeight: 700,
            fontSize: 17,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}>
            Task Manager
          </div>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 1 }}>
            Workspace
          </div>
        </div>
      </div>

      {/* ── Nav label ── */}
      <div style={{ padding: '6px 18px 10px' }}>
        <span className="text-11">Navigation</span>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ padding: '2px 10px', flex: 1 }}>
        {NAV_ITEMS.map(({ page, label, Icon }) => (
          <button
            key={page}
            type="button"
            className={`nav-item${activePage === page ? ' active' : ''}`}
            onClick={() => onNavigate(page)}
            style={{ marginBottom: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <Icon size={15} />
              {label}
            </span>

            {/* Task count pills */}
            {page === 'tasks' && stats.total > 0 && (
              <span style={{
                background: 'var(--status-active-bg)',
                color: 'var(--status-active-text)',
                borderRadius: 20,
                padding: '1px 7px',
                fontSize: 10.5,
                fontWeight: 700,
                lineHeight: 1.7,
              }}>
                {stats.total}
              </span>
            )}
            {page === 'completed' && stats.completed > 0 && (
              <span style={{
                background: 'var(--status-completed-bg)',
                color: 'var(--status-completed-text)',
                borderRadius: 20,
                padding: '1px 7px',
                fontSize: 10.5,
                fontWeight: 700,
                lineHeight: 1.7,
              }}>
                {stats.completed}
              </span>
            )}
            {page === 'tasks' && stats.overdue > 0 && activePage !== 'tasks' && (
              <span style={{
                background: 'var(--status-overdue-bg)',
                color: 'var(--status-overdue-text)',
                borderRadius: 20,
                padding: '1px 7px',
                fontSize: 10,
                fontWeight: 700,
                lineHeight: 1.7,
              }}>
                {stats.overdue} late
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* ── Divider ── */}
      <hr className="divider" style={{ margin: '8px 12px' }} />

      {/* ── Sprint / Productivity Widget ── */}
      <div className="sprint-widget" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16A34A', flexShrink: 0 }} />
          <span style={{ fontWeight: 600, fontSize: 12.5, color: 'var(--text-primary)' }}>Today&apos;s performance</span>
        </div>
        <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.5 }}>
          {stats.completed} of {stats.total} tasks done
        </p>

        {/* Progress bar */}
        <div className="progress-track">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>
            {stats.overdue > 0 ? `${stats.overdue} overdue` : 'On track'}
          </span>
          <span style={{ fontSize: 10.5, fontWeight: 600, color: pct >= 80 ? 'var(--status-completed-text)' : 'var(--text-secondary)' }}>
            {pct}%
          </span>
        </div>
      </div>
    </aside>
  );
}
