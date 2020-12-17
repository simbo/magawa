// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toNumber(value: any): number {
  return parseInt(`${value}`, 10);
}
