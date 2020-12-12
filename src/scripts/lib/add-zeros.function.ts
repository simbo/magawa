export function addZeros(num: number, count = 2): string {
  const str = `${num}`;
  const i = Math.max(0, count - str.length);
  return `${'0'.repeat(i)}${str}`;
}
