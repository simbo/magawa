import { PaintResourceName } from './paint-assets';
import { PaintContainer, PaintContainerOnClick } from './paint-container';
import { PaintText } from './paint-text';
import { PaintTexture } from './paint-texture';

enum GameTileColor {
  Line = '#ebdfbe',
  FillCovered = '#6b8e23',
  FillUncovered = '#f9edcc'
}

export class GameTile {
  public readonly container: PaintContainer;
  public readonly posX: number;
  public readonly posY: number;

  private mined = false;
  private covered = true;
  private flagged = false;
  private nearbyMines = 0;

  constructor(
    public readonly x: number,
    public readonly y: number,
    private readonly size: number,
    onClick: PaintContainerOnClick
  ) {
    this.posX = this.size * this.x;
    this.posY = this.size * this.y;
    this.container = new PaintContainer({ width: this.size, height: this.size, x: this.posX, y: this.posY, onClick });
    this.updateContainer();
  }

  public get isMined(): boolean {
    return this.mined;
  }

  public get isCovered(): boolean {
    return this.covered;
  }

  public get isFlagged(): boolean {
    return this.flagged;
  }

  public get hasNearbyMines(): number {
    return this.nearbyMines;
  }

  public populate(isMined: boolean, nearbyMines: number): void {
    this.mined = isMined;
    this.nearbyMines = nearbyMines;
  }

  public uncover(): void {
    this.container.interactive = false;
    this.covered = false;
    this.flagged = false;
    this.updateContainer();
  }

  public toggleFlag(): void {
    this.flagged = !this.flagged;
    this.updateContainer();
  }

  private updateContainer(): void {
    this.container.clear();
    this.container.fillStyle = this.covered ? GameTileColor.FillCovered : GameTileColor.FillUncovered;
    this.container.strokeStyle = GameTileColor.Line;
    if (this.covered) {
      if (this.flagged) {
        this.container.add(
          new PaintTexture({
            asset: PaintResourceName.Flag,
            width: this.size * 0.65,
            height: this.size * 0.65,
            x: (this.size - this.size * 0.65) / 2,
            y: (this.size - this.size * 0.65) / 2
          })
        );
      }
      return;
    }
    if (this.mined) {
      this.container.add(
        new PaintTexture({
          asset: PaintResourceName.Boom,
          width: this.size,
          height: this.size
        })
      );
    } else if (this.nearbyMines > 0) {
      this.container.add(
        new PaintText({
          text: `${this.nearbyMines}`,
          fillStyle: 'black',
          x: this.size / 2,
          y: this.size / 2
        })
      );
    }
  }
}
