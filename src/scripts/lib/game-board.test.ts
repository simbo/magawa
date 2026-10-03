import { createCanvas, press } from '../../../tests/helpers/canvas';

import { DevMode } from './dev-mode';
import { GameBoard } from './game-board';
import { GameFinalStatus } from './game-status';

vi.mock('./paint-assets', () => ({
  PaintResourceName: { Boom: 'boom', Flag: 'flag' },
  getPaintAsset: (name: string) => ({ name, image: new Image(), src: name }),
}));
// One mine in the bottom right leaves a safe opening at the top left.
vi.mock('array-shuffle', () => ({ arrayToShuffled: (items: boolean[]) => items.toReversed() }));

beforeEach(() => {
  vi.useFakeTimers();
  DevMode.disable();
});

/**
 * Creates a deterministic board while exercising the actual canvas pointer dispatch.
 */
function board() {
  const { canvas, context } = createCanvas();
  const callbacks = { first: vi.fn(), flags: vi.fn(), unpause: vi.fn(), finish: vi.fn(), restart: vi.fn() };
  const game = new GameBoard(
    canvas,
    10,
    3,
    3,
    1,
    callbacks.first,
    callbacks.flags,
    callbacks.unpause,
    callbacks.finish,
    callbacks.restart,
  );
  return { game, canvas, context, ...callbacks };
}

test('opens a safe region and wins without requiring flags', () => {
  const b = board();
  try {
    press(b.canvas, 5, 5);
    expect(b.first).toHaveBeenCalledOnce();
    expect(b.finish).toHaveBeenCalledExactlyOnceWith(GameFinalStatus.Won);
    press(b.canvas, 25, 25);
    expect(b.restart).toHaveBeenCalledOnce();
    expect(b.finish).toHaveBeenCalledOnce();
    b.game.initBoard();
    press(b.canvas, 5, 5);
    expect(b.first).toHaveBeenCalledTimes(2);
  } finally {
    b.game.destroyBoard();
  }
});

test.each([{ button: 2 }, { altKey: true }, { ctrlKey: true }, { shiftKey: true }, { metaKey: true }])(
  'flags via %j and loses when a mine is uncovered',
  options => {
    const b = board();
    try {
      press(b.canvas, 5, 5, options);
      expect(b.flags).toHaveBeenLastCalledWith(1);
      press(b.canvas, 5, 5);
      expect(b.finish).not.toHaveBeenCalled();
      press(b.canvas, 5, 5, options);
      expect(b.flags).toHaveBeenLastCalledWith(0);
      press(b.canvas, 25, 25);
      expect(b.finish).toHaveBeenCalledExactlyOnceWith(GameFinalStatus.Lost);
      press(b.canvas, 5, 5);
      expect(b.restart).toHaveBeenCalledOnce();
    } finally {
      b.game.destroyBoard();
    }
  },
);

test('pause intercepts clicks and developer changes redraw only until destruction', () => {
  const b = board();
  b.game.hidePauseOverlay();
  b.game.showPauseOverlay();
  b.game.showPauseOverlay();
  press(b.canvas, 5, 5);
  expect(b.unpause).toHaveBeenCalledOnce();
  expect(b.first).not.toHaveBeenCalled();
  b.game.hidePauseOverlay();
  DevMode.enable();
  vi.advanceTimersByTime(15);
  expect(b.context.fillRect).toHaveBeenCalled();
  b.game.destroyBoard();
  b.context.fillRect.mockClear();
  DevMode.disable();
  vi.advanceTimersByTime(15);
  expect(b.context.fillRect).not.toHaveBeenCalled();
  press(b.canvas, 5, 5);
  expect(b.first).toHaveBeenCalledOnce();
});
