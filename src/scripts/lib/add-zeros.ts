/**
 * Pads a number with leading zeros without truncating longer values.
 *
 * @param num - Number to format.
 * @param totalLength - Minimum length of the resulting string.
 * @returns The padded number as text.
 */
export function addZeros(num: number, totalLength = 2): string {
  const str = `${num}`;
  const i = Math.max(0, totalLength - str.length);
  return `${'0'.repeat(i)}${str}`;
}
