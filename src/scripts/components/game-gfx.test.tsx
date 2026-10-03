import { render } from '@testing-library/preact';

import { GameBoard } from '../lib/game-board';
import { GameFinalStatus, GameStatus } from '../lib/game-status';
import { GameAction } from '../store/game/game-actions';
import { gameStore, gameStoreContext } from '../store/game/game-store';

import { GameGfx } from './game-gfx';

vi.mock('../lib/game-board', () => ({
  GameBoard: vi.fn(
    class {
      public initBoard = vi.fn();
      public showPauseOverlay = vi.fn();
      public hidePauseOverlay = vi.fn();
      public destroyBoard = vi.fn();
    },
  ),
}));

test('connects board callbacks and store commands and cleans up on unmount', () => {
  gameStore.dispatch(GameAction.Start);
  const view = render(
    <gameStoreContext.Provider value={{ ...gameStore.state.peek(), player: 'Player' }}>
      <GameGfx />
    </gameStoreContext.Provider>,
  );
  const constructor = vi.mocked(GameBoard);
  const [canvas, size, width, height, mines, first, flags, unpause, finish, restart] = constructor.mock.calls[0];
  expect(canvas).toBeInstanceOf(HTMLCanvasElement);
  expect([size, width, height, mines]).toEqual([40, 16, 16, 40]);
  const instance = constructor.mock.instances[0];
  first();
  expect(gameStore.state.peek().startedAt).toBeInstanceOf(Date);
  flags(2);
  expect(gameStore.state.peek().flagsCount).toBe(2);
  gameStore.dispatch(GameAction.Pause);
  expect(instance.showPauseOverlay).toHaveBeenCalledOnce();
  unpause();
  expect(instance.hidePauseOverlay).toHaveBeenCalledOnce();
  finish(GameFinalStatus.Lost);
  expect(gameStore.state.peek().status).toBe(GameStatus.Finished);
  restart();
  expect(instance.initBoard).toHaveBeenCalledOnce();
  gameStore.dispatch(GameAction.Start);
  expect(instance.initBoard).toHaveBeenCalledTimes(2);
  expect(globalThis.location.hash).toBe('#/');
  view.unmount();
  expect(instance.destroyBoard).toHaveBeenCalledOnce();
  gameStore.dispatch(GameAction.Restart);
  expect(instance.initBoard).toHaveBeenCalledTimes(2);
});
