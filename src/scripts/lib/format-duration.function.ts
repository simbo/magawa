import { addZeros } from './add-zeros';

/**
 * Formats elapsed milliseconds as mm:ss with an optional three-digit millisecond part.
 * Minutes are not capped at 59.
 *
 * @param duration - Elapsed time in milliseconds.
 * @param withMilliseconds - Whether to append the millisecond remainder.
 * @returns The formatted elapsed time.
 */
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
