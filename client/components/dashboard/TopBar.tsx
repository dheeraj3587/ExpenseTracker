import { Search } from 'lucide-react';
import { SwitchMode } from '@/components/ui/switch-mode';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
}

export function TopBar({ searchQuery, onSearchChange, theme, onThemeToggle }: TopBarProps) {
  return (
    <header className="app-topbar">
      {/* Search */}
      <div style={{ flex: 1, maxWidth: 460, position: 'relative' }}>
        <Search size={14} style={{
          position: 'absolute',
          left: 11,
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)',
          pointerEvents: 'none',
        }} />
        <input
          className="input-field"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks, categories, deadlines…"
          aria-label="Search tasks"
          style={{ paddingLeft: 34, height: 38, fontSize: 13.5, borderRadius: 12 }}
        />
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button type="button" className="btn-secondary" style={{ padding: '8px 13px', fontSize: 12.5 }}>
          Productivity Hub
        </button>
        <SwitchMode width={56} height={28} theme={theme} onThemeToggle={onThemeToggle} />

        {/* Avatar */}
        <div style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: 'var(--bg-hover)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-primary)',
          fontWeight: 600,
          fontSize: 12,
          flexShrink: 0,
          userSelect: 'none',
          cursor: 'pointer',
        }}>
          DJ
        </div>
      </div>
    </header>
  );
}
