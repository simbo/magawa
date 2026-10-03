import { fireEvent, render, screen } from '@testing-library/preact';

import { Flags } from '../src/scripts/components/flags';
import { Restart } from '../src/scripts/components/restart';
import { GameFinalStatus } from '../src/scripts/lib/game-status';
import { GameAction } from '../src/scripts/store/game/game-actions';
import { gameStore, gameStoreContext } from '../src/scripts/store/game/game-store';

const initial = gameStore.state.peek();

test.each([
  [null, 'magawa'],
  [GameFinalStatus.Won, 'party'],
  [GameFinalStatus.Lost, 'dead'],
])('shows restart outcome %s and dispatches restart', (finalStatus, icon) => {
  render(
    <gameStoreContext.Provider value={{ ...initial, finalStatus: finalStatus }}>
      <Restart />
      <Flags />
    </gameStoreContext.Provider>,
  );
  expect(screen.getByTitle('Restart Game').querySelector('img')?.src).toContain(`${icon}.png`);
  expect(screen.getByTitle('Flags / Mines').textContent).toBe('0/40');
  const dispatch = vi.spyOn(gameStore, 'dispatch');
  fireEvent.click(screen.getByTitle('Restart Game'));
  expect(dispatch).toHaveBeenCalledWith(GameAction.Restart);
});
