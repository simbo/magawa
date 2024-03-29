import { addZeros } from './add-zeros';

export function formatDuration(duration: number, withMilliseconds = true): string {
  // const hours = Math.floor(duration / 3600000);
  // duration -= hours * 3600000;
  const minutes = Math.floor(duration / 60_000);
  duration -= minutes * 60_000;
  const seconds = Math.floor(duration / 1000);
  return `${addZeros(minutes)}:${addZeros(seconds)}${
    withMilliseconds ? `:${addZeros(duration - seconds * 1000, 3)}` : ''
  }`;
}
