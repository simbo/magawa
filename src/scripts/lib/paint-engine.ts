import type { PaintContainer } from './paint-container';

/**
 * Canvas target, logical dimensions, and device-pixel scaling for a painting engine.
 */
export interface PaintEngineOptions {
  canvas: HTMLCanvasElement | string;
  pixelDensity: number;
  width: number;
  height: number;
}

const DEFAULT_CANVAS_ENGINE_OPTIONS: Partial<PaintEngineOptions> = {
  pixelDensity: 2,
  width: 320,
  height: 320,
};

const RENDER_TIMEOUT_DURATION = 15;

/**
 * Draws containers onto a scaled canvas and dispatches pointer presses to the topmost hit.
 */
export class PaintEngine {
  public readonly canvas: HTMLCanvasElement;
  public readonly context: CanvasRenderingContext2D;
  public readonly pixelDensity: number;
  public readonly width: number;
  public readonly height: number;

  private children: PaintContainer[] = [];

  private renderTimeout = 0;

  /**
   * Configures scaled canvas dimensions and installs context-menu and pointer handlers.
   *
   * @param options - Configuration used to initialize or request this resource.
   */
  public constructor(options: Partial<PaintEngineOptions>) {
    if (typeof options.canvas === 'string') {
      options.canvas = globalThis.document.querySelector(options.canvas) as HTMLCanvasElement;
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

    /**
     * Converts browser pointer coordinates into logical canvas pixels.
     * Checks containers in reverse draw order so overlays intercept clicks.
     * A hit blocks containers beneath it even if the hit container is not interactive.
     */
    this.canvas.addEventListener('pointerdown', event => {
      event.preventDefault();
      const { x: canvasX, y: canvasY } = this.canvas.getBoundingClientRect();
      const x = event.clientX - canvasX;
      const y = event.clientY - canvasY;
      const children = [...this.children];
      for (let index = children.length - 1; index >= 0; index--) {
        const container = children[index];
        if (container.active && typeof container.onClick === 'function' && container.isHitBy(x, y)) {
          if (container.interactive) {
            container.onClick({ event, container, engine: this });
          }
          break;
        }
      }
    });
  }

  /**
   * Appends containers in draw order; later containers take priority during hit testing.
   *
   * @param container - Parent container defining the drawing origin.
   */
  public add(...container: PaintContainer[]): void {
    this.children.push(...container);
  }

  /**
   * Removes all registered containers; canvas pixels are overwritten by the next redraw.
   */
  public clear(): void {
    this.children = [];
  }

  /**
   * Coalesces redraw requests using a short timeout and paints active containers in insertion order.
   */
  public render(): void {
    if (this.renderTimeout) {
      globalThis.clearTimeout(this.renderTimeout);
    }
    this.renderTimeout = globalThis.setTimeout(() => {
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].render(this);
      }
    }, RENDER_TIMEOUT_DURATION);
  }
}
