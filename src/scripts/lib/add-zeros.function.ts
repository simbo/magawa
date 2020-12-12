export function addZeros(num: number, count = 2): string {
  let str = `${num}`;
  for (let i = 1; i < count; i++) {
    str = parseInt(str, 10) < Math.pow(10, i) ? `${'0'.repeat(i)}${str}` : str;
  }
  return str;
}
