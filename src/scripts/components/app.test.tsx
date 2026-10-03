import { act, render, screen } from '@testing-library/preact';

import { AppRoute } from '../lib/app-route.enum';
import { DevMode } from '../lib/dev-mode';
import { route } from '../lib/hash-router';

import { App } from './app';

vi.mock('./game-view', () => ({ GameView: () => <div>Game view</div> }));
vi.mock('./highscores-view', () => ({ HighscoresView: () => <div>Scores view</div> }));

test('loads routes and follows persisted developer-mode changes', async () => {
  DevMode.disable();
  const view = render(<App />);
  expect(await screen.findByText('A Minesweeper Clone.')).toBeTruthy();
  await act(async () => {
    route(AppRoute.About, true);
  });
  expect(await screen.findByText('How to play')).toBeTruthy();
  await act(async () => {
    route(AppRoute.Highscores, true);
  });
  expect(await screen.findByText('Scores view')).toBeTruthy();
  await act(async () => {
    route(AppRoute.Game, true);
  });
  expect(await screen.findByText('Game view')).toBeTruthy();
  await act(async () => {
    DevMode.enable();
  });
  expect(await screen.findByTitle('Dev Mode enabled')).toBeTruthy();
  await act(async () => {
    DevMode.disable();
  });
  expect(screen.queryByTitle('Dev Mode enabled')).toBeNull();
  view.unmount();
});
