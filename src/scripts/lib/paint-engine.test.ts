import { createCanvas, press } from '../../../tests/helpers/canvas';

import { PaintContainer } from './paint-container';
import { PaintEngine } from './paint-engine';

/**
 * Creates a canvas offset from the viewport origin to verify coordinate conversion.
 */
function createCanvasEngine() {
  const { canvas } = createCanvas();
  vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({ x: 20, y: 30 } as DOMRect);
  const engine = new PaintEngine({ canvas, width: 100, height: 100 });
  return {
    engine,
    click: () => {
      press(canvas, 70, 80);
    },
  };
}

test('pause overlay intercepts tile clicks and releases them when hidden', () => {
  const { engine, click } = createCanvasEngine();
  const hits: string[] = [];
  const tile = new PaintContainer({
    width: 100,
    height: 100,
    onClick: () => {
      hits.push('tile');
    },
  });
  const overlay = new PaintContainer({
    width: 100,
    height: 100,
    onClick: () => {
      hits.push('overlay');
    },
  });
  engine.add(tile, overlay);
  click();
  expect(hits).toEqual(['overlay']);
  overlay.active = false;
  click();
  expect(hits).toEqual(['overlay', 'tile']);
});

test('noninteractive completion overlays block underlying tiles', () => {
  const { engine, click } = createCanvasEngine();
  const hit = vi.fn();
  engine.add(
    new PaintContainer({ width: 100, height: 100, onClick: hit }),
    new PaintContainer({ width: 100, height: 100, interactive: false, onClick: hit }),
  );
  click();
  expect(hit).not.toHaveBeenCalled();
});
