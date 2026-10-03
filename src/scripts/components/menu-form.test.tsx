import { fireEvent, render, screen } from '@testing-library/preact';

import { GameDifficulty } from '../lib/game-difficulty';
import { GameAction } from '../store/game/game-actions';
import { gameStore } from '../store/game/game-store';

import { MenuForm } from './menu-form';

beforeEach(() => {
  gameStore.dispatch(GameAction.SetSettings, {
    player: 'Player',
    difficulty: GameDifficulty.Medium,
    settings: { tilesX: 16, tilesY: 16, minesCount: 40 },
  });
});

test('focuses the name, selects presets and keeps the entered player when changing difficulty', () => {
  render(<MenuForm />);
  expect(globalThis.document.activeElement).toBe(screen.getByLabelText('Your Name'));
  fireEvent.input(screen.getByLabelText('Your Name'), { target: { value: 'NewPlayer' } });
  fireEvent.change(screen.getByLabelText('Difficulty'), { target: { value: '0' } });
  expect(screen.getByLabelText<HTMLInputElement>('Width').value).toBe('8');
  expect(screen.getByLabelText<HTMLInputElement>('Width').readOnly).toBe(true);
  expect(screen.getByLabelText<HTMLInputElement>('Your Name').value).toBe('NewPlayer');
});

test('submits custom dimensions and navigates to the game', () => {
  render(<MenuForm />);
  fireEvent.change(screen.getByLabelText('Difficulty'), { target: { value: '3' } });
  const width = screen.getByLabelText<HTMLInputElement>('Width');
  expect(width.type).toBe('number');
  expect(width.readOnly).toBe(false);
  fireEvent.input(width, { target: { value: '12' } });
  fireEvent.input(screen.getByLabelText('Height'), { target: { value: '10' } });
  fireEvent.input(screen.getByLabelText('Mines'), { target: { value: '20' } });
  fireEvent.submit(screen.getByRole('button', { name: 'Start Game' }).closest('form')!);
  expect(gameStore.state.peek()).toMatchObject({
    player: 'Player',
    difficulty: GameDifficulty.Custom,
    tilesX: 12,
    tilesY: 10,
    minesCount: 20,
  });
  expect(globalThis.location.hash).toBe('#/game');
});

test.each(['', 'Invalid Name'])('rejects invalid player %j', player => {
  render(<MenuForm />);
  fireEvent.input(screen.getByLabelText('Your Name'), { target: { value: player } });
  const state = gameStore.state.peek();
  fireEvent.submit(screen.getByRole('button', { name: 'Start Game' }).closest('form')!);
  expect(gameStore.state.peek()).toBe(state);
  expect(globalThis.location.hash).toBe('');
});

test('rejects custom dimensions outside the allowed range', () => {
  render(<MenuForm />);
  fireEvent.change(screen.getByLabelText('Difficulty'), { target: { value: '3' } });
  fireEvent.input(screen.getByLabelText('Width'), { target: { value: '100' } });
  const state = gameStore.state.peek();
  fireEvent.submit(screen.getByRole('button', { name: 'Start Game' }).closest('form')!);
  expect(gameStore.state.peek()).toBe(state);
});
