import { render, screen } from '@testing-library/preact';

import { AboutView } from '../src/scripts/components/about-view';
import { DevLayer } from '../src/scripts/components/dev-layer';
import { MenuView } from '../src/scripts/components/menu-view';

test('provides menu navigation, game instructions and developer indicator', () => {
  const menu = render(<MenuView />);
  expect(screen.getByRole('link', { name: 'About' }).getAttribute('href')).toBe('#/about');
  expect(screen.getByRole('link', { name: 'Highscores' }).getAttribute('href')).toBe('#/highscores');
  expect(screen.getByRole('link', { name: 'Donate' }).getAttribute('target')).toBe('_blank');
  menu.unmount();
  render(<AboutView />);
  expect(screen.getByText('How to play')).toBeTruthy();
  expect(screen.getByRole('link', { name: '← Back' }).getAttribute('href')).toBe('#/');
  render(<DevLayer />);
  expect(screen.getByTitle('Dev Mode enabled')).toBeTruthy();
});
