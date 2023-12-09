import { addZeros } from './add-zeros';

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
