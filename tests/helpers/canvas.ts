import { vi } from 'vitest';

/**
 * Provides observable drawing calls without requiring native canvas bindings.
 */
export function createCanvas() {
  const context = {
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    fillText: vi.fn(),
    strokeText: vi.fn(),
    drawImage: vi.fn(),
  };
  const canvas = globalThis.document.createElement('canvas');
  vi.spyOn(canvas, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D);
  return { canvas, context };
}

/**
 * Sends a pointer press through the canvas's real event listeners.
 *
 * @param canvas
 * @param x
 * @param y
 * @param options
 */
export function press(canvas: HTMLCanvasElement, x: number, y: number, options: MouseEventInit = {}) {
  canvas.dispatchEvent(new MouseEvent('pointerdown', { clientX: x, clientY: y, bubbles: true, ...options }));
}
