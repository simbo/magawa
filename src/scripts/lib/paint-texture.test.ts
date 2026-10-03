import { createCanvas } from '../../../tests/helpers/canvas';

import { PaintContainer } from './paint-container';
import { PaintEngine } from './paint-engine';
import { PaintTexture } from './paint-texture';

vi.mock('./paint-assets', () =>
  // Assets are tested independently below; texture uses a supplied image.
  ({ getPaintAsset: vi.fn(), PaintResourceName: { Boom: 'boom', Flag: 'flag' } }),
);

test('draws texture using image dimensions and parent-relative scaled coordinates', () => {
  const image = new Image(30, 40);
  const { canvas, context } = createCanvas();
  const engine = new PaintEngine({ canvas, pixelDensity: 2 });
  const asset = { name: 'boom' as import('./paint-assets').PaintResourceName, src: 'boom.png', image };
  const texture = new PaintTexture({ asset });
  texture.render(engine, new PaintContainer({ x: 5, y: 6 }));
  expect(context.drawImage).toHaveBeenCalledWith(image, 10, 12, 60, 80);
  const positioned = new PaintTexture({ asset, x: 2, y: 3, width: 10, height: 20 });
  positioned.render(engine, new PaintContainer({ x: 5, y: 6 }));
  expect(context.drawImage).toHaveBeenLastCalledWith(image, 14, 18, 20, 40);
});
