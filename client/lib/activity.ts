export interface ActivityItem {
  id: string;
  type: 'created' | 'completed' | 'uncompleted' | 'updated' | 'deleted';
  taskTitle: string;
  taskId: string;
  timestamp: number; // unix ms
}

const KEY = 'aurora_activity_v4';
const MAX = 30;

const SEED_ACTIVITY: ActivityItem[] = [];

export const getActivities = (): ActivityItem[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return SEED_ACTIVITY;
    const parsed = JSON.parse(raw) as ActivityItem[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_ACTIVITY;
  } catch {
    return SEED_ACTIVITY;
  }
};

export const logActivity = (item: Omit<ActivityItem, 'id'>): void => {
  try {
    const current = getActivities();
    const next: ActivityItem = { ...item, id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` };
    const updated = [next, ...current.filter((a) => a.id !== next.id)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }
};

export const clearActivities = (): void => {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
};

export const timeAgo = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  const min = Math.floor(diff / 60000);
  const hr = Math.floor(diff / 3600000);
  const day = Math.floor(diff / 86400000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`;
  return `${day}d ago`;
};
