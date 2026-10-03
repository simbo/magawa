import { act, fireEvent, render, screen } from '@testing-library/preact';

import { GameStatus } from '../lib/game-status';
import { GameAction } from '../store/game/game-actions';
import { gameStore, gameStoreContext } from '../store/game/game-store';

import { Timer } from './timer';

const initial = gameStore.state.peek();

test('updates the timer, freezes paused and finished time, and clears scheduled updates on unmount', () => {
  vi.useFakeTimers();
  vi.setSystemTime(10_000);
  const state = { ...initial, status: GameStatus.Running, startedAt: new Date(5000) };
  const view = render(
    <gameStoreContext.Provider value={state}>
      <Timer />
    </gameStoreContext.Provider>,
  );
  expect(screen.getByText('00:05')).toBeTruthy();
  void act(() => {
    vi.advanceTimersByTime(1000);
  });
  expect(screen.getByText('00:06')).toBeTruthy();
  view.rerender(
    <gameStoreContext.Provider value={{ ...state, status: GameStatus.Paused, pausedAt: new Date(11_000) }}>
      <Timer />
    </gameStoreContext.Provider>,
  );
  void act(() => {
    vi.advanceTimersByTime(5000);
  });
  expect(screen.getByTitle('Continue').textContent).toBe('00:06');
  const dispatch = vi.spyOn(gameStore, 'dispatch');
  fireEvent.click(screen.getByTitle('Continue'));
  expect(dispatch).toHaveBeenCalledWith(GameAction.TogglePause);
  view.rerender(
    <gameStoreContext.Provider value={{ ...state, status: GameStatus.Finished, finishedAt: new Date(13_000) }}>
      <Timer />
    </gameStoreContext.Provider>,
  );
  expect(screen.getByText('00:08')).toBeTruthy();
  view.unmount();
  expect(vi.getTimerCount()).toBe(0);
});

test('renders zero before the first click', () => {
  vi.useFakeTimers();
  render(<Timer />);
  expect(screen.getByText('00:00')).toBeTruthy();
});
