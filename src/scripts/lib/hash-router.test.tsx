import { act, render, screen, waitFor } from '@testing-library/preact';

import { AppRoute } from './app-route.enum';
import { HashRouter, Link, route } from './hash-router';

const routes = {
  [AppRoute.Home]: <div>Home page</div>,
  [AppRoute.Game]: <div>Game page</div>,
  [AppRoute.About]: <div>About page</div>,
  [AppRoute.Highscores]: <div>Scores page</div>,
};

test('follows normalized hashes, replacement navigation and unknown-route fallback', async () => {
  globalThis.history.replaceState(null, '', '#/about/?foo=bar');
  const { unmount } = render(<HashRouter routes={routes} />);
  expect(screen.getByText('About page')).toBeTruthy();
  void act(() => {
    route(AppRoute.Game, true);
  });
  expect(screen.getByText('Game page')).toBeTruthy();
  void act(() => {
    globalThis.history.replaceState(null, '', '#/unknown');
    globalThis.dispatchEvent(new HashChangeEvent('hashchange'));
  });
  expect(screen.getByText('Home page')).toBeTruthy();
  const remove = vi.spyOn(globalThis, 'removeEventListener');
  await act(async () => {
    unmount();
  });
  await waitFor(() => {
    expect(remove).toHaveBeenCalledWith('hashchange', expect.any(Function));
  });
});

test('retains native anchor attributes and navigates with the fragment', () => {
  render(
    <Link href={AppRoute.Highscores} target="_blank">
      Scores
    </Link>,
  );
  const link = screen.getByRole('link');
  expect(link.getAttribute('href')).toBe('#/highscores');
  expect(link.getAttribute('target')).toBe('_blank');
  route(AppRoute.About);
  expect(globalThis.location.hash).toBe('#/about');
});
