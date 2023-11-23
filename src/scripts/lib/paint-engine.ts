import { PaintContainer } from './paint-container';

export interface PaintEngineOptions {
  canvas: HTMLCanvasElement | string;
  pixelDensity: number;
  width: number;
  height: number;
}

const DEFAULT_CANVAS_ENGINE_OPTIONS: Partial<PaintEngineOptions> = {
  pixelDensity: 2,
  width: 320,
  height: 320
};

export class PaintEngine {
  public readonly canvas: HTMLCanvasElement;
  public readonly context: CanvasRenderingContext2D;
  public readonly pixelDensity: number;
  public readonly width: number;
  public readonly height: number;

  private children: PaintContainer[] = [];

  public constructor(options: Partial<PaintEngineOptions>) {
    if (typeof options.canvas === 'string') {
      options.canvas = document.querySelector(options.canvas) as HTMLCanvasElement;
    }
    const { canvas, pixelDensity, width, height } = { ...DEFAULT_CANVAS_ENGINE_OPTIONS, ...options };

    if (!canvas || (canvas as HTMLCanvasElement).tagName !== 'CANVAS') {
      throw new TypeError('PaintEngine canvas is not a HTMLCanvasElement');
    }
    if (typeof pixelDensity !== 'number' || pixelDensity < 1) {
      throw new TypeError('PaintEngine pixelDensity is not a number or lower than 1');
    }
    if (typeof width !== 'number' || width < 1) {
      throw new TypeError('PaintEngine width is not a number or lower than 1');
    }
    if (typeof height !== 'number' || height < 1) {
      throw new TypeError('PaintEngine height is not a number or lower than 1');
    }

    this.canvas = canvas as HTMLCanvasElement;
    this.pixelDensity = pixelDensity;
    this.width = width;
    this.height = height;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    if (!this.context) {
      throw new Error('PaintEngine could not acquire canvas rendering context');
    }

    this.canvas.width = this.width * this.pixelDensity;
    this.canvas.height = this.height * this.pixelDensity;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.canvas.addEventListener('contextmenu', event => {
      event.preventDefault();
    });

    this.canvas.addEventListener('pointerdown', event => {
      event.preventDefault();
      const { x: canvasX, y: canvasY } = this.canvas.getBoundingClientRect();
      const x = event.clientX - canvasX;
      const y = event.clientY - canvasY;
      const children = [...this.children].reverse();
      for (let i = 0; i < children.length; i++) {
        const container = children[i];
        if (container.active && typeof container.onClick === 'function' && container.isHitBy(x, y)) {
          if (container.interactive) {
            container.onClick({ event, container, engine: this });
          }
          break;
        }
      }
    });
  }

  public add(...container: PaintContainer[]): void {
    this.children.push(...container);
  }

  public clear(): void {
    this.children = [];
  }

  public render(): void {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].render(this);
    }
  }
}
