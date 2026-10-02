import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createJiti } from 'jiti';

/**
 * Loads TypeScript source modules using the same runtime dependency as ESLint.
 */
const jiti = createJiti(import.meta.url);
const { PaintEngine } = await jiti.import('../src/scripts/lib/paint-engine.ts');

/**
 * Builds a minimal canvas with actual pointer listeners, without needing a browser.
 *
 * @returns The engine and a helper that presses its logical center.
 */
function createCanvasEngine() {
  const handlers = new Map();
  const canvas = {
    style: {},
    getContext: () => ({}),
    addEventListener: (type, handler) => handlers.set(type, handler),
    getBoundingClientRect: () => ({ x: 20, y: 30 }),
  };
  const engine = new PaintEngine({ canvas, width: 100, height: 100 });
  return {
    engine,
    click: () => handlers.get('pointerdown')({ clientX: 70, clientY: 80, preventDefault() {} }),
  };
}

test('pause overlay intercepts tile clicks and releases them when hidden', () => {
  const { engine, click } = createCanvasEngine();
  const hits = [];
  const tile = { active: true, interactive: true, isHitBy: () => true, onClick: () => hits.push('tile') };
  const overlay = { active: true, interactive: true, isHitBy: () => true, onClick: () => hits.push('overlay') };
  engine.add(tile, overlay);
  click();
  assert.deepEqual(hits, ['overlay']);
  overlay.active = false;
  click();
  assert.deepEqual(hits, ['overlay', 'tile']);
});

test('noninteractive completion overlays block underlying tiles', () => {
  const { engine, click } = createCanvasEngine();
  let hits = 0;
  engine.add(
    { active: true, interactive: true, isHitBy: () => true, onClick: () => hits++ },
    { active: true, interactive: false, isHitBy: () => true, onClick: () => hits++ },
  );
  click();
  assert.equal(hits, 0);
});
