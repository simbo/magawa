import { getPaintAsset, PaintAsset, PaintResourceName } from './paint-assets';
import { PaintContainer } from './paint-container';
import { PaintEngine } from './paint-engine';

export interface PaintTextureOptions {
  asset: PaintAsset | PaintResourceName;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export class PaintTexture {
  private readonly asset: PaintAsset;

  public readonly x: number;
  public readonly y: number;
  public readonly width: number;
  public readonly height: number;

  public constructor(options: PaintTextureOptions) {
    if (typeof options.asset === 'string') {
      options.asset = getPaintAsset(options.asset as PaintResourceName);
    }
    this.asset = options.asset;
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.width = options.width || this.asset.image.width || 0;
    this.height = options.height || this.asset.image.height || 0;

    if (this.width < 1) {
      throw new TypeError('PaintTexture width is lower than 1');
    }
    if (this.height < 1) {
      throw new TypeError('PaintTexture height is lower than 1');
    }
    if (typeof this.x !== 'number') {
      throw new TypeError('PaintContainer x is not a number');
    }
    if (typeof this.y !== 'number') {
      throw new TypeError('PaintContainer y is not a number');
    }
  }

  public render(engine: PaintEngine, container: PaintContainer): void {
    const x = (container.x + this.x) * engine.pixelDensity;
    const y = (container.y + this.y) * engine.pixelDensity;
    const width = this.width * engine.pixelDensity;
    const height = this.height * engine.pixelDensity;
    engine.context.drawImage(this.asset.image, x, y, width, height);
  }
}
