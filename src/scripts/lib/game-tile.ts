import { Container, Graphics, Sprite, Text } from 'pixi.js';

import { Asset, getAsset } from './game-assets';

enum GameTileColor {
  LineCovered = 0xf9_ed_cc,
  FillCovered = 0x6b_8e_23,
  LineUncovered = 0xeb_df_be,
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  FillUncovered = 0xf9_ed_cc
}

export class GameTile {
  public readonly container: Container;
  public readonly posX: number;
  public readonly posY: number;

  private mined = false;
  private covered = true;
  private flagged = false;
  private nearbyMines = 0;

  constructor(
    public readonly x: number,
    public readonly y: number,
    private readonly size: number
  ) {
    this.posX = this.size * this.x;
    this.posY = this.size * this.y;
    this.container = new Container();
    this.container.eventMode = 'static';
    this.draw();
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

  private get lineColor(): number {
    return this.covered ? GameTileColor.LineCovered : GameTileColor.LineUncovered;
  }

  private get fillColor(): number {
    return this.covered ? GameTileColor.FillCovered : GameTileColor.FillUncovered;
  }

  public populate(isMined: boolean, nearbyMines: number): void {
    this.mined = isMined;
    this.nearbyMines = nearbyMines;
  }

  public uncover(): void {
    this.container.eventMode = 'none';
    this.covered = false;
    this.flagged = false;
    this.draw();
  }

  public toggleFlag(): void {
    this.flagged = !this.flagged;
    this.draw();
  }

  private draw(): void {
    this.container.removeChildren();
    const tile = new Graphics();
    tile.lineStyle(1, this.lineColor);
    tile.beginFill(this.fillColor);
    tile.drawRect(this.posX, this.posY, this.size, this.size);
    tile.endFill();
    this.container.addChild(tile);
    if (this.covered) {
      if (this.flagged) {
        this.drawIcon(Asset.Flag, 0.65, [0.4, 0.6]);
      }
      return;
    }
    if (this.mined) {
      this.drawIcon(Asset.Boom);
    } else if (this.nearbyMines > 0) {
      this.drawText(this.nearbyMines.toString());
    }
  }

  private drawIcon(name: Asset, size = 1, [anchorX, anchorY]: [number, number] = [0.5, 0.5]): void {
    getAsset(name)
      .then(texture => {
        const icon = new Sprite(texture);
        icon.anchor.set(anchorX, anchorY);
        icon.width = this.size * size;
        icon.height = this.size * size;
        icon.x = this.size / 2 + this.posX;
        icon.y = this.size / 2 + this.posY;
        this.container.addChild(icon);
      })
      .catch(error => console.error(error));
  }

  private drawText(str: string): void {
    const text = new Text(str);
    text.x = this.size / 2 - text.width / 2 + this.posX;
    text.y = this.size / 2 - text.height / 2 + this.posY;
    this.container.addChild(text);
  }
}
