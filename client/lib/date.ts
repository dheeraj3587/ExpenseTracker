/**
 * Parses date-only strings (YYYY-MM-DD) in the local timezone to avoid
 * the UTC off-by-one-day shift caused by `new Date('YYYY-MM-DD')`.
 */
export const parseDateLocal = (value: string): Date => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }
  return new Date(value);
};

export const formatDate = (value: string, options?: Intl.DateTimeFormatOptions): string => {
  if (!value) {
    return 'No date';
  }

  const date = parseDateLocal(value);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(date);
};

export const isOverdue = (dueDate: string, completed: boolean): boolean => {
  if (!dueDate || completed) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = parseDateLocal(dueDate);
  due.setHours(0, 0, 0, 0);

  return due.getTime() < today.getTime();
};
