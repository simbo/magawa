export function formatDuration(
  duration: number,
  withMilliseconds = false
): string {
  const h = Math.floor(duration / 3600000);
  duration -= h * 3600000;
  const m = Math.floor(duration / 60000);
  duration -= m * 60000;
  const s = Math.floor(duration / 1000);
  const z = (v: number, l = 1) =>
    v < Math.pow(10, l) ? `${'0'.repeat(l)}${v}` : `${v}`;
  return `${z(h)}:${z(m)}:${z(s)}${
    withMilliseconds ? `:${z(duration - s * 1000, 2)}` : ''
  }`;
}
