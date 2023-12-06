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

const RENDER_TIMEOUT_DURATION = 15;

export class PaintEngine {
  public readonly canvas: HTMLCanvasElement;
  public readonly context: CanvasRenderingContext2D;
  public readonly pixelDensity: number;
  public readonly width: number;
  public readonly height: number;

  private children: PaintContainer[] = [];

  private renderTimeout = 0;

  public constructor(options: Partial<PaintEngineOptions>) {
    if (typeof options.canvas === 'string') {
      options.canvas = document.querySelector(options.canvas) as HTMLCanvasElement;
    }
    const { canvas, pixelDensity, width, height } = { ...DEFAULT_CANVAS_ENGINE_OPTIONS, ...options };

    this.canvas = canvas as HTMLCanvasElement;
    this.pixelDensity = pixelDensity as number;
    this.width = width as number;
    this.height = height as number;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;

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
    if (this.renderTimeout) {
      window.clearTimeout(this.renderTimeout);
    }
    this.renderTimeout = window.setTimeout(() => {
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].render(this);
      }
    }, RENDER_TIMEOUT_DURATION);
  }
}
