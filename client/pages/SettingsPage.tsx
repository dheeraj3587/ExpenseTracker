import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { SwitchMode } from '@/components/ui/switch-mode';

interface SettingsPageProps {
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
  onClearData: () => void;
  taskCount: number;
}

export function SettingsPage({ theme, onThemeToggle, onClearData, taskCount }: SettingsPageProps) {
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClear = () => { onClearData(); setConfirmClear(false); };

  return (
    <>
      <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
        <p className="text-11" style={{ marginBottom: 4 }}>Preferences</p>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Settings</h1>
        <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 4 }}>Manage appearance and data for this workspace.</p>
      </div>

      <div style={{ maxWidth: 540, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Appearance */}
        <div className="settings-card">
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Appearance</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 18, lineHeight: 1.5 }}>
            Toggle between dark and light mode. Preference is persisted across sessions.
          </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <SwitchMode width={60} height={30} theme={theme} onThemeToggle={onThemeToggle} />
              <span style={{ fontWeight: 500, fontSize: 13.5, color: 'var(--text-primary)' }}>
                {theme === 'dark' ? 'Dark mode' : 'Light mode'}
              </span>
            </div>
        </div>

        {/* Data */}
        <div className="settings-card">
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Data</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 18, lineHeight: 1.5 }}>
            Tasks are stored in the cloud and linked to this browser profile. Clearing will permanently delete all{taskCount > 0 ? ` ${taskCount}` : ''} task{taskCount === 1 ? '' : 's'} and cannot be undone.
          </p>

          {!confirmClear ? (
            <button
              type="button"
              className="btn-secondary"
              style={{ color: 'var(--error-text)', borderColor: 'rgba(239,68,68,0.28)' }}
              onClick={() => setConfirmClear(true)}
              disabled={taskCount === 0}
            >
              <Trash2 size={14} />
              Clear all tasks
            </button>
          ) : (
            <div style={{ background: 'var(--error-soft)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: 16 }}>
              <p style={{ fontSize: 13.5, color: 'var(--error-text)', fontWeight: 500, marginBottom: 12 }}>
                Are you sure? This will delete all {taskCount} task{taskCount === 1 ? '' : 's'}.
              </p>
              <div style={{ display: 'flex', gap: 9 }}>
                <button type="button" className="btn-secondary" onClick={() => setConfirmClear(false)}>Cancel</button>
                <button type="button" className="btn-danger" onClick={handleClear}>Yes, clear all</button>
              </div>
            </div>
          )}
        </div>

        {/* About */}
        <div className="settings-card">
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>About</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Task Manager OS — a premium full-stack task manager built with React, Express, TypeScript, and cloud persistence.
          </p>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', gap: 24 }}>
            {[
              { label: 'Version', value: '3.0.0' },
              { label: 'Storage', value: 'Cloud' },
              { label: 'Tasks', value: String(taskCount) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-11" style={{ marginBottom: 3 }}>{label}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
