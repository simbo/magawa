import { format, parseISO } from 'date-fns';

export function formatDate(date: Date | string, withTime = true): string {
  if (typeof date === 'string') {
    date = parseISO(date);
  }
  return format(date, `dd.MM.yyyy${withTime ? ' HH:mm:ss' : ''}`);
}
