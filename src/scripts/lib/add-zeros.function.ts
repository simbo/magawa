export function addZeros(num: number, count = 1): string {
  return num < Math.pow(10, count) ? `${'0'.repeat(count)}${num}` : `${num}`;
}
