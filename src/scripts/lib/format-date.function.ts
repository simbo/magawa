import { format } from 'date-fns';

export function formatDate(date: Date, withTime = true): string {
  return format(date, `dd.MM.yyyy${withTime ? ' HH:mm:ss' : ''}`);
}
