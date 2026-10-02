import { getPaintAsset, type PaintAsset, type PaintResourceName } from './paint-assets';
import type { PaintContainer } from './paint-container';
import type { PaintEngine } from './paint-engine';

/**
 * Image resource and optional position and dimensions relative to a container.
 */
export interface PaintTextureOptions {
  asset: PaintAsset | PaintResourceName;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

/**
 * Draws a loaded image relative to its parent container.
 */
export class PaintTexture {
  public readonly x: number;
  public readonly y: number;
  public readonly width: number;
  public readonly height: number;

  private readonly asset: PaintAsset;

  /**
   * Resolves a named resource and defaults missing dimensions to the image's natural size.
   *
   * @param options - Configuration used to initialize or request this resource.
   */
  public constructor(options: PaintTextureOptions) {
    if (typeof options.asset === 'string') {
      options.asset = getPaintAsset(options.asset);
    }
    this.asset = options.asset;
    this.x = options.x ?? 0;
    this.y = options.y ?? 0;
    this.width = options.width ?? this.asset.image.width;
    this.height = options.height ?? this.asset.image.height;
  }

  /**
   * Draws the image at container-relative coordinates scaled to the canvas pixel density.
   *
   * @param engine - Canvas engine providing the context and pixel density.
   * @param container - Parent container defining the drawing origin.
   */
  public render(engine: PaintEngine, container: PaintContainer): void {
    const x = (container.x + this.x) * engine.pixelDensity;
    const y = (container.y + this.y) * engine.pixelDensity;
    const width = this.width * engine.pixelDensity;
    const height = this.height * engine.pixelDensity;
    engine.context.drawImage(this.asset.image, x, y, width, height);
  }
}
