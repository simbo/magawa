import shuffle from 'shuffle-array';

import { GameFinalStatus } from './game-status.enum';
import { GameTile } from './game-tile.model';

export class GameBoard {
  private gfx!: PIXI.Application;
  private width!: number;
  private height!: number;
  private minesIndex!: boolean[];
  private tiles!: GameTile[];
  private pauseOverlay!: PIXI.Graphics | null;
  private lostOverlay!: PIXI.Graphics | null;
  private wonOverlay!: PIXI.Graphics | null;
  private flagsCount!: number;
  private triggeredMinedTile!: GameTile | null;

  constructor(
    private readonly view: HTMLCanvasElement,
    private readonly tileSize: number,
    private readonly tilesX: number,
    private readonly tilesY: number,
    private readonly minesCount: number,
    private readonly firstClick: () => void,
    private readonly setFlagsCount: (flagsCount: number) => void,
    private readonly unpause: () => void,
    private readonly finish: (finalStatus: GameFinalStatus) => void,
    private readonly close: () => void
  ) {
    PIXI.utils.skipHello();
    this.initBoard();
  }

  public showPauseOverlay(): void {
    const overlayName = 'pauseOverlay';
    if (!this.pauseOverlay) {
      this.pauseOverlay = this.drawOverlay(0x6b8e23);
      this.pauseOverlay.name = overlayName;
      this.pauseOverlay.on('pointerdown', this.unpause);
    } else if (!this.gfx.stage.getChildByName(overlayName)) {
      this.gfx.stage.addChild(this.pauseOverlay);
    }
  }

  public hidePauseOverlay(): void {
    this.gfx.stage.removeChild(this.pauseOverlay as PIXI.Graphics);
  }

  public initBoard(): void {
    if (this.gfx) {
      this.gfx.destroy();
    }
    this.width = this.tilesX * this.tileSize;
    this.height = this.tilesY * this.tileSize;
    this.gfx = new PIXI.Application({
      view: this.view,
      width: this.width,
      height: this.height,
      resolution: 2
    });
    this.flagsCount = 0;
    this.tiles = [];
    this.minesIndex = [];
    this.triggeredMinedTile = null;
    this.pauseOverlay = null;
    this.lostOverlay = null;
    this.wonOverlay = null;
    this.initTiles();
  }

  private showLostOverlay(): void {
    this.lostOverlay = this.drawOverlay(0xff0000, 0.2);
    this.lostOverlay.on('pointerdown', this.close);
  }

  private showWonOverlay(): void {
    this.wonOverlay = this.drawOverlay(0x00ff00, 0.2);
    this.wonOverlay.on('pointerdown', this.close);
  }

  private initTiles(): void {
    for (let y = 0; y < this.tilesY; y++) {
      for (let x = 0; x < this.tilesX; x++) {
        const tile = new GameTile(x, y, this.tileSize);
        tile.container.on('pointerdown', (iEvent: PIXI.InteractionEvent) =>
          this.onTileClick(iEvent, x, y)
        );
        this.tiles.push(tile);
        this.gfx.stage.addChild(tile.container);
      }
    }
  }

  private initMines(initClickX: number, initClickY: number): void {
    const minesIndex: boolean[] = [];
    for (let m = 0; m < this.tilesX * this.tilesY; m++) {
      minesIndex.push(m < this.minesCount);
    }
    // shuffle until the initial click hits a field with no mines nearby
    let i = 0;
    do {
      shuffle(minesIndex);
      i++;
    } while (
      i < 10000 && // set a max value for crazy custom game settings
      (minesIndex[this.getTileIndex(initClickX, initClickY)] ||
        this.getNearbyTileCoordinates(initClickX, initClickY).some(
          ([x, y]) => minesIndex[this.getTileIndex(x, y)]
        ))
    );
    this.minesIndex = minesIndex;
  }

  private populateTiles(): void {
    this.tiles.forEach((tile, i) =>
      tile.populate(
        this.minesIndex[i],
        this.getNearbyTileCoordinates(tile.x, tile.y).filter(
          ([x, y]) => this.minesIndex[this.getTileIndex(x, y)]
        ).length
      )
    );
  }

  private onTileClick(
    iEvent: PIXI.InteractionEvent,
    x: number,
    y: number
  ): void {
    if (!this.minesIndex.length) {
      this.firstClick();
      this.initMines(x, y);
      this.populateTiles();
    }
    const event = iEvent.data.originalEvent as MouseEvent;
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.button > 1
    ) {
      this.toggleFlag(x, y);
    } else {
      this.uncoverTile(x, y);
    }
  }

  private getTileIndex(x: number, y: number): number {
    return y * this.tilesX + x;
  }

  private getNearbyTileCoordinates(x: number, y: number): [number, number][] {
    // prettier-ignore
    const nearbyTiles: [number, number][] = [
      [x - 1, y - 1], [x + 0, y - 1], [x + 1, y - 1],
      [x - 1, y + 0],                 [x + 1, y + 0],
      [x - 1, y + 1], [x + 0, y + 1], [x + 1, y + 1]
    ];
    return nearbyTiles.filter(
      ([a, b]) => a >= 0 && a < this.tilesX && b >= 0 && b < this.tilesY
    );
  }

  private uncoverTile(x: number, y: number): void {
    const tile = this.tiles[this.getTileIndex(x, y)];
    if (!tile.isCovered || tile.isFlagged) {
      return;
    }
    tile.uncover();
    if (tile.isMined) {
      this.triggeredMinedTile = tile;
      this.tiles.forEach(t => {
        if (t.isMined) {
          t.uncover();
        }
      });
    } else if (tile.hasNearbyMines === 0) {
      this.getNearbyTileCoordinates(x, y).forEach(([a, b]) =>
        this.uncoverTile(a, b)
      );
    }
    this.updateBoardState();
  }

  private toggleFlag(x: number, y: number): void {
    const tile = this.tiles[this.getTileIndex(x, y)];
    if (!tile.isCovered) {
      return;
    }
    tile.toggleFlag();
    this.flagsCount = this.tiles.reduce((c, t) => (t.isFlagged ? ++c : c), 0);
    this.setFlagsCount(this.flagsCount);
    this.updateBoardState();
  }

  private isBoardSolved(): boolean {
    return this.tiles.every(
      tile =>
        (tile.isMined && (tile.isFlagged || tile.isCovered)) ||
        (!tile.isMined && !tile.isFlagged && !tile.isCovered)
    );
  }

  private updateBoardState(): void {
    const lost = !!this.triggeredMinedTile;
    const won = !lost && this.isBoardSolved();
    if (lost || won) {
      if (won) {
        this.showWonOverlay();
      } else {
        this.showLostOverlay();
      }
      this.finish(won ? GameFinalStatus.Won : GameFinalStatus.Lost);
    }
  }

  private drawOverlay(color: number, alpha?: number): PIXI.Graphics {
    const overlay = new PIXI.Graphics();
    overlay.interactive = true;
    overlay.beginFill(color, alpha);
    overlay.drawRect(0, 0, this.width, this.height);
    overlay.endFill();
    this.gfx.stage.addChild(overlay);
    return overlay;
  }
}
