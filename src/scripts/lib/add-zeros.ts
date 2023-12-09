export function addZeros(num: number, totalLength = 2): string {
  const str = `${num}`;
  const i = Math.max(0, totalLength - str.length);
  return `${'0'.repeat(i)}${str}`;
}
