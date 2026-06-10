export const formatDate = (value: string, options?: Intl.DateTimeFormatOptions): string => {
  if (!value) {
    return 'No date';
  }

  const date = new Date(value);

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

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  return due.getTime() < today.getTime();
};
