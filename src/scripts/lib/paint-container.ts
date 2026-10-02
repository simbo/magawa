import type { PaintEngine } from './paint-engine';
import type { PaintText } from './paint-text';
import type { PaintTexture } from './paint-texture';

/**
 * Pointer event, clicked container, and canvas engine passed to a click handler.
 */
export interface PaintContainerOnClickParameters {
  event: PointerEvent;
  container: PaintContainer;
  engine: PaintEngine;
}

/**
 * Callback invoked when an interactive container receives a pointer press.
 */
export type PaintContainerOnClick = (parameters: PaintContainerOnClickParameters) => void;

/**
 * Geometry, appearance, and interaction settings in logical canvas pixels.
 */
export interface PaintContainerOptions {
  width: number;
  height: number;
  x: number;
  y: number;
  fillStyle?: string | CanvasGradient | CanvasPattern;
  strokeStyle?: string | CanvasGradient | CanvasPattern;
  strokeWidth?: number;
  active?: boolean;
  interactive?: boolean;
  onClick?: PaintContainerOnClick;
}

const DEFAULT_PAINT_CONTAINER_OPTIONS: Partial<PaintContainerOptions> = {
  width: 10,
  height: 10,
  x: 0,
  y: 0,
  strokeWidth: 1,
  active: true,
  interactive: true,
};

/**
 * Groups drawable children and provides rectangular hit testing and background painting.
 */
export class PaintContainer {
  public readonly width: number;
  public readonly height: number;
  public readonly x: number;
  public readonly y: number;

  public fillStyle?: string | CanvasGradient | CanvasPattern;
  public strokeStyle?: string | CanvasGradient | CanvasPattern;
  public strokeWidth?: number;

  public active: boolean;
  public interactive: boolean;

  public onClick?: PaintContainerOnClick;

  private children: (PaintContainer | PaintTexture | PaintText)[] = [];

  /**
   * Applies default geometry and interaction settings, then stores the optional click handler.
   *
   * @param options - Configuration used to initialize or request this resource.
   */
  public constructor(options: Partial<PaintContainerOptions>) {
    const { width, height, x, y, fillStyle, strokeStyle, strokeWidth, active, interactive } = {
      ...DEFAULT_PAINT_CONTAINER_OPTIONS,
      ...options,
    };

    this.width = width as number;
    this.height = height as number;
    this.x = x as number;
    this.y = y as number;
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
    this.strokeWidth = strokeWidth;
    this.active = !!active;
    this.interactive = !!interactive;

    if (options.onClick) {
      this.onClick = options.onClick;
    }
  }

  /**
   * Paints the active container background and border, then draws its children in insertion order.
   *
   * @param engine - Canvas engine providing the context and pixel density.
   */
  public render(engine: PaintEngine): void {
    if (!this.active) {
      return;
    }

    if (this.fillStyle || this.strokeStyle) {
      const strokeWidth = (this.strokeWidth ?? 1) * engine.pixelDensity;
      const x = this.x * engine.pixelDensity;
      const y = this.y * engine.pixelDensity;
      const width = this.width * engine.pixelDensity;
      const height = this.height * engine.pixelDensity;
      const rectProps: [number, number, number, number] = [x, y, width, height];

      if (this.fillStyle) {
        engine.context.fillStyle = this.fillStyle;
        engine.context.fillRect(...rectProps);
      }

      if (this.strokeStyle) {
        engine.context.strokeStyle = this.strokeStyle;
        engine.context.lineWidth = strokeWidth;
        engine.context.strokeRect(...rectProps);
      }
    }

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].render(engine, this);
    }
  }

  /**
   * Appends drawable children in the order in which they should appear.
   *
   * @param container - Parent container defining the drawing origin.
   */
  public add(...container: (PaintContainer | PaintTexture | PaintText)[]): void {
    this.children.push(...container);
  }

  /**
   * Removes drawable children while keeping the container's geometry and interaction settings.
   */
  public clear(): void {
    this.children = [];
  }

  /**
   * Checks whether logical canvas coordinates lie inside the container, including its edges.
   *
   * @param x - Horizontal tile or canvas coordinate.
   * @param y - Vertical tile or canvas coordinate.
   * @returns Whether the point lies within this container.
   */
  public isHitBy(x: number, y: number): boolean {
    return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
  }
}
