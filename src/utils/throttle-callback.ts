/**
 * throttles a callback function
 * @param callback the function to call
 * @param duration the timeout duration
 */
export function throttleCallback(
  callback: (...args: any[]) => void,
  duration = 50,
  context: any = null
): (...args: any[]) => void {
  let timeout = 0;
  return (...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => callback.call(context, ...args), duration);
  };
}
