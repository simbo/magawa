import { IconName } from './icon-name.enum';
import { resources } from './resources';

enum GameTileColor {
  LineCovered = 0xf9edcc,
  FillCovered = 0x6b8e23,
  LineUncovered = 0xebdfbe,
  FillUncovered = 0xf9edcc
}

const gameTileTextures: IconName[] = [IconName.Boom, IconName.Flag];

type GameTileIcons = { [key in IconName]?: PIXI.Texture };

export class GameTile {
  public readonly container: PIXI.Container;
  public readonly posX: number;
  public readonly posY: number;

  private mined = false;
  private covered = true;
  private flagged = false;
  private nearbyMines = 0;
  private readonly textures: GameTileIcons = {};

  constructor(public readonly x: number, public readonly y: number, private readonly size: number) {
    this.posX = this.size * this.x;
    this.posY = this.size * this.y;
    this.container = new PIXI.Container();
    this.container.interactive = true;
    this.setTextures();
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
    this.container.interactive = false;
    this.covered = false;
    this.flagged = false;
    this.draw();
  }

  public toggleFlag(): void {
    this.flagged = !this.flagged;
    this.draw();
  }

  private setTextures(): void {
    gameTileTextures.forEach(name => {
      this.textures[name] = resources.get(name)?.texture as PIXI.Texture;
    });
  }

  private draw(): void {
    this.container.removeChildren();
    const tile = new PIXI.Graphics();
    tile.lineStyle(1, this.lineColor);
    tile.beginFill(this.fillColor);
    tile.drawRect(this.posX, this.posY, this.size, this.size);
    tile.endFill();
    this.container.addChild(tile);
    if (this.covered) {
      if (this.flagged) {
        this.drawIcon(IconName.Flag, 0.65, [0.4, 0.6]);
      }
      return;
    }
    if (this.mined) {
      this.drawIcon(IconName.Boom);
    } else if (this.nearbyMines > 0) {
      this.drawText(this.nearbyMines.toString());
    }
  }

  private drawIcon(name: IconName, size = 1, [anchorX, anchorY]: [number, number] = [0.5, 0.5]): void {
    const icon = new PIXI.Sprite(this.textures[name] as PIXI.Texture);
    icon.anchor.set(anchorX, anchorY);
    icon.width = this.size * size;
    icon.height = this.size * size;
    icon.x = this.size / 2 + this.posX;
    icon.y = this.size / 2 + this.posY;
    this.container.addChild(icon);
  }

  private drawText(str: string): void {
    const text = new PIXI.Text(str);
    text.x = this.size / 2 - text.width / 2 + this.posX;
    text.y = this.size / 2 - text.height / 2 + this.posY;
    this.container.addChild(text);
  }
}
