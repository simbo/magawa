export function formatDuration(duration: number): string {
  duration = Math.floor(duration / 1000);
  const h = Math.floor(duration / 3600);
  const m = Math.floor((duration - (h * 3600)) / 60);
  const s = duration - (h * 3600) - (m * 60);
  const z = (v: number) => v < 10 ? `0${v}` : `${v}`;
  return `${z(h)}:${z(m)}:${z(s)}`;
}
