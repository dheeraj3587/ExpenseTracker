import type { ReactNode } from 'react';
import type { Page, Task } from '@/types/task';
import { getTaskStats } from '@/lib/task-utils';
import { getActivities } from '@/lib/activity';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { InsightsPanel } from './InsightsPanel';

interface AppShellProps {
  page: Page;
  onNavigate: (page: Page) => void;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  tasks: Task[];
  children: ReactNode;
}

export function AppShell({ page, onNavigate, theme, onThemeToggle, searchQuery, onSearchChange, tasks, children }: AppShellProps) {
  const stats = getTaskStats(tasks);
  const activities = getActivities();

  return (
    <div className="app-shell">
      {/* Col 1: Sidebar */}
      <Sidebar activePage={page} onNavigate={onNavigate} stats={stats} />

      {/* Col 2: Scrollable content */}
      <div className="app-content">
        <TopBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          theme={theme}
          onThemeToggle={onThemeToggle}
        />
        <main style={{ padding: '32px 36px 40px', flex: 1, maxWidth: 1220, width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>

      {/* Col 3: Insights panel */}
      <InsightsPanel tasks={tasks} activities={activities} />
    </div>
  );
}
