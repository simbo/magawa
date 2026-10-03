import { createCanvas, press } from '../../../tests/helpers/canvas';

import { PaintContainer } from './paint-container';
import { PaintEngine } from './paint-engine';
import { PaintText } from './paint-text';

beforeEach(() => vi.useFakeTimers());

test('scales canvas and drawing coordinates and coalesces redraws', () => {
  const { canvas, context } = createCanvas();
  const engine = new PaintEngine({ canvas, width: 100, height: 80, pixelDensity: 2 });
  expect([canvas.width, canvas.height, canvas.style.width, canvas.style.height]).toEqual([200, 160, '100px', '80px']);
  const container = new PaintContainer({ x: 10, y: 20, width: 30, height: 40, fillStyle: 'red', strokeStyle: 'black' });
  container.add(new PaintText({ text: '3', x: 5, y: 6, fillStyle: 'blue', strokeStyle: 'green' }));
  engine.add(container, new PaintContainer({ active: false, fillStyle: 'pink' }));
  engine.render();
  engine.render();
  expect(context.fillRect).not.toHaveBeenCalled();
  vi.advanceTimersByTime(15);
  expect(context.fillRect).toHaveBeenCalledExactlyOnceWith(20, 40, 60, 80);
  expect(context.strokeRect).toHaveBeenCalledWith(20, 40, 60, 80);
  expect(context.fillText).toHaveBeenCalledWith('3', 30, 52);
  expect(context.strokeText).toHaveBeenCalledWith('3', 30, 52);
  container.clear();
  engine.render();
  vi.advanceTimersByTime(15);
  expect(context.fillText).toHaveBeenCalledTimes(1);
  engine.clear();
  engine.render();
  vi.advanceTimersByTime(15);
  expect(context.fillRect).toHaveBeenCalledTimes(2);
});

test('includes edges in hit testing and ignores points outside', () => {
  const container = new PaintContainer({ x: 10, y: 20, width: 30, height: 40 });
  expect(container.isHitBy(10, 20)).toBe(true);
  expect(container.isHitBy(40, 60)).toBe(true);
  expect(container.isHitBy(9, 20)).toBe(false);
  expect(container.isHitBy(40, 61)).toBe(false);
});

test('finds canvas selectors and prevents context menus and pointer defaults', () => {
  const { canvas } = createCanvas();
  canvas.id = 'board';
  globalThis.document.body.append(canvas);
  const engine = new PaintEngine({ canvas: '#board' });
  const click = vi.fn();
  engine.add(new PaintContainer({ onClick: click }));
  press(canvas, 5, 5);
  expect(click).toHaveBeenCalledOnce();
  const menu = new Event('contextmenu', { cancelable: true });
  expect(canvas.dispatchEvent(menu)).toBe(false);
  canvas.remove();
});
