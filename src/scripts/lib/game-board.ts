import shuffle from 'array-shuffle';

import { GameFinalStatus } from './game-status';
import { GameTile } from './game-tile';
import { PaintContainer } from './paint-container';
import { PaintEngine } from './paint-engine';

export class GameBoard {
  private paintEngine!: PaintEngine;
  private width!: number;
  private height!: number;
  private minesIndex!: boolean[];
  private tiles!: GameTile[];
  private pauseOverlay!: PaintContainer | null;
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
    this.initBoard();
  }

  public initBoard(): void {
    this.width = this.tilesX * this.tileSize;
    this.height = this.tilesY * this.tileSize;
    if (this.paintEngine) {
      this.paintEngine.clear();
    } else {
      this.paintEngine = new PaintEngine({
        canvas: this.view,
        width: this.width,
        height: this.height,
        pixelDensity: 2
      });
    }
    this.flagsCount = 0;
    this.tiles = [];
    this.minesIndex = [];
    this.triggeredMinedTile = null;
    this.pauseOverlay = null;
    this.initTiles();
  }

  public showPauseOverlay(): void {
    if (!this.pauseOverlay) {
      this.pauseOverlay = new PaintContainer({
        fillStyle: '#6b8e23',
        width: this.width,
        height: this.height,
        onClick: () => this.unpause()
      });
      this.paintEngine.add(this.pauseOverlay);
    }
    this.pauseOverlay.active = true;
    this.paintEngine.render();
  }

  public hidePauseOverlay(): void {
    if (this.pauseOverlay) {
      this.pauseOverlay.active = false;
      this.paintEngine.render();
    }
  }

  private initTiles(): void {
    for (let y = 0; y < this.tilesY; y++) {
      for (let x = 0; x < this.tilesX; x++) {
        const tile = new GameTile(x, y, this.tileSize, ({ event }) => this.onTileClick(event, x, y));
        this.tiles.push(tile);
        this.paintEngine.add(tile.container);
      }
    }
    this.paintEngine.render();
  }

  private initMines(initClickX: number, initClickY: number): void {
    let minesIndex: boolean[] = [];
    for (let m = 0; m < this.tilesX * this.tilesY; m++) {
      minesIndex.push(m < this.minesCount);
    }
    // shuffle until the initial click hits a field with no mines nearby
    let i = 0;
    do {
      minesIndex = shuffle(minesIndex);
      i++;
    } while (
      i < 10_000 && // set a max value for crazy custom game settings
      (minesIndex[this.getTileIndex(initClickX, initClickY)] ||
        this.getNearbyTileCoordinates(initClickX, initClickY).some(([x, y]) => minesIndex[this.getTileIndex(x, y)]))
    );
    this.minesIndex = minesIndex;
  }

  private populateTiles(): void {
    this.tiles.forEach((tile, i) =>
      tile.populate(
        this.minesIndex[i],
        this.getNearbyTileCoordinates(tile.x, tile.y).filter(([x, y]) => this.minesIndex[this.getTileIndex(x, y)])
          .length
      )
    );
  }

  private onTileClick(event: PointerEvent, x: number, y: number): void {
    if (this.minesIndex.length === 0) {
      this.firstClick();
      this.initMines(x, y);
      this.populateTiles();
    }
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.button > 1) {
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
    return nearbyTiles.filter(([a, b]) => a >= 0 && a < this.tilesX && b >= 0 && b < this.tilesY);
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
      this.getNearbyTileCoordinates(x, y).forEach(([a, b]) => this.uncoverTile(a, b));
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
        (tile.isMined && (tile.isFlagged || tile.isCovered)) || (!tile.isMined && !tile.isFlagged && !tile.isCovered)
    );
  }

  private updateBoardState(): void {
    const lost = !!this.triggeredMinedTile;
    const won = !lost && this.isBoardSolved();
    if (lost || won) {
      const fillStyle = won ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)';
      const overlay = new PaintContainer({
        fillStyle,
        width: this.width,
        height: this.height,
        onClick: () => this.close()
      });
      this.paintEngine.add(overlay);
      this.finish(won ? GameFinalStatus.Won : GameFinalStatus.Lost);
    }
    this.paintEngine.render();
  }
}
