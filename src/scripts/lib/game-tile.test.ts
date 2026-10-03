import { DevMode } from './dev-mode';
import { GameTile } from './game-tile';

vi.mock('./paint-assets', () => ({
  PaintResourceName: { Boom: 'boom', Flag: 'flag' },
  getPaintAsset: (name: string) => ({ name, image: new Image(), src: name }),
}));

beforeEach(() => {
  DevMode.disable();
});

test('tile flags, numbers and developer visibility preserve logical state', () => {
  const tile = new GameTile(2, 3, 10, vi.fn());
  expect([tile.posX, tile.posY, tile.isCovered, tile.isMined]).toEqual([20, 30, true, false]);
  tile.populate(true, 2);
  tile.toggleFlag();
  DevMode.enable();
  tile.updateAppearance();
  expect([tile.isMined, tile.isCovered, tile.isFlagged, tile.hasNearbyMines]).toEqual([true, true, true, 2]);
  tile.uncover();
  expect(tile.isCovered).toBe(false);
  expect(tile.isFlagged).toBe(false);
  expect(tile.container.interactive).toBe(false);
  const safe = new GameTile(0, 0, 10, vi.fn());
  safe.populate(false, 3);
  safe.uncover();
  expect(safe.hasNearbyMines).toBe(3);
});
