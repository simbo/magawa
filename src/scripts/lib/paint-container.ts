import { PaintEngine } from './paint-engine';
import { PaintText } from './paint-text';
import { PaintTexture } from './paint-texture';

export interface PaintContainerOnClickParameters {
  event: PointerEvent;
  container: PaintContainer;
  engine: PaintEngine;
}

export type PaintContainerOnClick = (parameters: PaintContainerOnClickParameters) => void;

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
  interactive: true
};

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

  public constructor(options: Partial<PaintContainerOptions>) {
    const { width, height, x, y, fillStyle, strokeStyle, strokeWidth, active, interactive } = {
      ...DEFAULT_PAINT_CONTAINER_OPTIONS,
      ...options
    };

    if (typeof width !== 'number' || width < 1) {
      throw new TypeError('PaintContainer width is not a number or lower than 1');
    }
    if (typeof height !== 'number' || height < 1) {
      throw new TypeError('PaintContainer height is not a number or lower than 1');
    }
    if (typeof x !== 'number') {
      throw new TypeError('PaintContainer x is not a number');
    }
    if (typeof y !== 'number') {
      throw new TypeError('PaintContainer y is not a number');
    }

    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
    this.strokeWidth = strokeWidth;
    this.active = !!active;
    this.interactive = !!interactive;

    if (options.onClick) {
      this.onClick = options.onClick;
    }
  }

  public render(engine: PaintEngine): void {
    if (!this.active) {
      return;
    }

    if (this.fillStyle || this.strokeStyle) {
      const strokeWidth = (this.strokeWidth || 1) * engine.pixelDensity;
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

  public add(...container: (PaintContainer | PaintTexture | PaintText)[]): void {
    this.children.push(...container);
  }

  public clear(): void {
    this.children = [];
  }

  public isHitBy(x: number, y: number): boolean {
    return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
  }
}
