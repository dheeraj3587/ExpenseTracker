import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, CircleDashed, ListChecks, TriangleAlert } from 'lucide-react';
import type { TaskStats } from '@/lib/task-utils';

/* ── Animated counter ── */
function Counter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    let start: number | null = null;
    const from = 0;
    const duration = 900;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (value - from) * ease));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value]);

  return <>{display}</>;
}

interface StatsGridProps {
  stats: TaskStats;
}

const CARDS = [
  {
    key: 'total' as const,
    label: 'Total Tasks',
    Icon: ListChecks,
    accentColor: '#2563EB',
    trend: 'Portfolio growth',
  },
  {
    key: 'active' as const,
    label: 'Active',
    Icon: CircleDashed,
    accentColor: '#2563EB',
    trend: 'Execution mode',
  },
  {
    key: 'completed' as const,
    label: 'Completed',
    Icon: CheckCircle2,
    accentColor: '#16A34A',
    trend: 'Momentum rising',
  },
  {
    key: 'overdue' as const,
    label: 'Overdue',
    Icon: TriangleAlert,
    accentColor: '#DC2626',
    trend: 'Action required',
  },
] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16 }}
    >
      {CARDS.map(({ key, label, Icon, accentColor, trend }) => (
        <motion.div
          key={key}
          variants={cardVariants}
          whileHover={{ y: -4, boxShadow: 'var(--shadow-hover)' }}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderTop: `1px solid ${accentColor}`,
            borderRadius: 'var(--r-xl)',
            padding: '20px 22px',
            boxShadow: 'var(--shadow-card)',
            cursor: 'default',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        >
          {/* Top row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
            <p style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
            <div style={{ width: 34, height: 34, borderRadius: 11, background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={15} style={{ color: 'var(--text-secondary)' }} />
            </div>
          </div>

          {/* Value */}
          <p style={{ fontSize: 34, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, marginBottom: 8, letterSpacing: '-0.02em' }}>
            <Counter value={stats[key]} />
          </p>

          {/* Trend indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{
              fontSize: 10.5,
              fontWeight: 500,
              color: key === 'overdue'
                  ? 'var(--status-overdue-text)'
                  : (key === 'completed' ? 'var(--status-completed-text)' : 'var(--text-secondary)'),
            }}>
              {trend}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
