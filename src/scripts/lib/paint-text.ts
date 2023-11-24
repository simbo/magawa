import { PaintContainer } from './paint-container';
import { PaintEngine } from './paint-engine';

export interface PaintTextOptions {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  direction: CanvasDirection;
  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  strokeWidth: number;
}

const DEFAULT_PAINT_TEXT_OPTIONS: Partial<PaintTextOptions> = {
  x: 0,
  y: 0,
  fontSize: 24,
  fontFamily: 'sans-serif',
  textAlign: 'center',
  textBaseline: 'middle',
  direction: 'ltr'
};

export class PaintText {
  private readonly text: string;
  private readonly x: number;
  private readonly y: number;
  private readonly fontSize: number;
  private readonly fontFamily: string;
  private readonly textAlign: CanvasTextAlign;
  private readonly textBaseline: CanvasTextBaseline;
  private readonly direction: CanvasDirection;
  private readonly fillStyle?: string | CanvasGradient | CanvasPattern;
  private readonly strokeStyle?: string | CanvasGradient | CanvasPattern;
  private readonly strokeWidth?: number;

  public constructor(options: Partial<PaintTextOptions>) {
    const {
      text,
      x,
      y,
      fontSize,
      fontFamily,
      textAlign,
      textBaseline,
      direction,
      fillStyle,
      strokeStyle,
      strokeWidth
    } = {
      ...DEFAULT_PAINT_TEXT_OPTIONS,
      ...options
    };

    this.text = text as string;
    this.x = x as number;
    this.y = y as number;
    this.fontSize = fontSize as number;
    this.fontFamily = fontFamily as string;
    this.textAlign = textAlign as CanvasTextAlign;
    this.textBaseline = textBaseline as CanvasTextBaseline;
    this.direction = direction as CanvasDirection;
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
    this.strokeWidth = strokeWidth;
  }

  public render(engine: PaintEngine, container: PaintContainer): void {
    engine.context.font = `${this.fontSize * engine.pixelDensity}px ${this.fontFamily}`;
    engine.context.textAlign = this.textAlign;
    engine.context.textBaseline = this.textBaseline;
    engine.context.direction = this.direction;
    if (this.fillStyle || this.strokeStyle) {
      const strokeWidth = (this.strokeWidth || 1) * engine.pixelDensity;
      const x = (container.x + this.x) * engine.pixelDensity;
      const y = (container.y + this.y) * engine.pixelDensity;
      const textProps: [string, number, number] = [this.text, x, y];

      if (this.fillStyle) {
        engine.context.fillStyle = this.fillStyle;
        engine.context.fillText(...textProps);
      }

      if (this.strokeStyle) {
        engine.context.strokeStyle = this.strokeStyle;
        engine.context.lineWidth = strokeWidth;
        engine.context.strokeText(...textProps);
      }
    }
  }
}
