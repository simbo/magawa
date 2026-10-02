import { addZeros } from './add-zeros';

/**
 * Formats a date in local time as DD.MM.YYYY with optional HH:mm:ss.
 *
 * @param date - Date object or date text accepted by the browser.
 * @param withTime - Whether to append the time of day.
 * @returns The formatted local date.
 */
export function formatDate(date: Date | string, withTime = true): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const day = addZeros(date.getDate());
  const month = addZeros(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = addZeros(date.getHours());
  const minutes = addZeros(date.getMinutes());
  const seconds = addZeros(date.getSeconds());
  let formatted = `${day}.${month}.${year}`;
  if (withTime) {
    formatted += ` ${hours}:${minutes}:${seconds}`;
  }
  return formatted;
}
