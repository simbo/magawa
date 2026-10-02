import { arrayToShuffled } from 'array-shuffle';

import { DevMode } from './dev-mode';
import { GameFinalStatus } from './game-status';
import { GameTile } from './game-tile';
import { PaintContainer } from './paint-container';
import { PaintEngine } from './paint-engine';

/**
 * Manages mine placement, tile interaction, game completion, and canvas overlays.
 */
export class GameBoard {
  private paintEngine!: PaintEngine;
  private width!: number;
  private height!: number;
  private minesIndex!: boolean[];
  private tiles!: GameTile[];
  private pauseOverlay!: PaintContainer | null;
  private flagsCount!: number;
  private triggeredMinedTile!: GameTile | null;

  /**
   * Creates the canvas engine and initializes an empty covered board.
   * Mines are placed only when the first tile is clicked.
   *
   * @param view - Canvas on which the board is drawn.
   * @param tileSize - Tile edge length in logical pixels.
   * @param tilesX - Number of board columns.
   * @param tilesY - Number of board rows.
   * @param minesCount - Total number of mines to place.
   * @param firstClick - Notifies the store when the first tile is clicked.
   * @param setFlagsCount - Publishes the number of placed flags.
   * @param unpause - Resumes play after a pause-overlay click.
   * @param finish - Publishes the final game outcome.
   * @param close - Returns to the menu after the completion overlay is clicked.
   */
  public constructor(
    private readonly view: HTMLCanvasElement,
    private readonly tileSize: number,
    private readonly tilesX: number,
    private readonly tilesY: number,
    private readonly minesCount: number,
    private readonly firstClick: () => void,
    private readonly setFlagsCount: (flagsCount: number) => void,
    private readonly unpause: () => void,
    private readonly finish: (finalStatus: GameFinalStatus) => void,
    private readonly close: () => void,
  ) {
    this.initBoard();
  }

  /**
   * Resets tiles, mine placement, flags, and overlays while reusing the existing canvas engine.
   */
  public initBoard(): void {
    this.width = this.tilesX * this.tileSize;
    this.height = this.tilesY * this.tileSize;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Initialized only after the first render or board setup.
    if (this.paintEngine) {
      this.paintEngine.clear();
    } else {
      this.paintEngine = new PaintEngine({
        canvas: this.view,
        width: this.width,
        height: this.height,
        pixelDensity: 2,
      });
    }
    this.flagsCount = 0;
    this.tiles = [];
    this.minesIndex = [];
    this.triggeredMinedTile = null;
    this.pauseOverlay = null;
    this.initTiles();
    globalThis.document.addEventListener(DevMode.CHANGE_EVENT_TYPE, this.onDevModeChange);
  }

  /**
   * Creates or reactivates an opaque overlay that resumes play when clicked.
   */
  public showPauseOverlay(): void {
    if (!this.pauseOverlay) {
      this.pauseOverlay = new PaintContainer({
        fillStyle: '#6b8e23',
        width: this.width,
        height: this.height,
        onClick: () => {
          this.unpause();
        },
      });
      this.paintEngine.add(this.pauseOverlay);
    }
    this.pauseOverlay.active = true;
    this.paintEngine.render();
  }

  /**
   * Hides the pause overlay and schedules a redraw.
   */
  public hidePauseOverlay(): void {
    if (!this.pauseOverlay) {
      return;
    }

    this.pauseOverlay.active = false;
    this.paintEngine.render();
  }

  /**
   * Removes this board's document-level developer-mode listener.
   */
  public destroyBoard(): void {
    globalThis.document.removeEventListener(DevMode.CHANGE_EVENT_TYPE, this.onDevModeChange);
  }

  /**
   * Rebuilds every tile's appearance before redrawing so mine visibility changes immediately.
   * Logical tile state and mine positions remain unchanged.
   */
  private readonly onDevModeChange = (): void => {
    for (const tile of this.tiles) tile.updateAppearance();
    this.paintEngine.render();
  };

  /**
   * Creates covered tiles with coordinate-bound click handlers and adds them to the canvas engine.
   */
  private initTiles(): void {
    for (let y = 0; y < this.tilesY; y++) {
      for (let x = 0; x < this.tilesX; x++) {
        const tile = new GameTile(x, y, this.tileSize, ({ event }) => {
          this.onTileClick(event, x, y);
        });
        this.tiles.push(tile);
        this.paintEngine.add(tile.container);
      }
    }
    this.paintEngine.render();
  }

  /**
   * Shuffles mine positions until the first clicked tile and its neighbors are mine-free.
   * Stops after 10,000 attempts for dense custom boards, so the safe opening is best effort.
   *
   * @param initClickX - Column of the initial click.
   * @param initClickY - Row of the initial click.
   */
  private initMines(initClickX: number, initClickY: number): void {
    let minesIndex: boolean[] = [];
    for (let m = 0; m < this.tilesX * this.tilesY; m++) {
      minesIndex.push(m < this.minesCount);
    }
    // shuffle until the initial click hits a field with no mines nearby

    /**
     * Limits repeated shuffles because dense custom boards may not allow
     * a mine-free neighborhood around the opening click.
     */
    let i = 0;
    let openingIsMined: boolean;
    do {
      const currentMines = arrayToShuffled(minesIndex);
      minesIndex = currentMines;
      openingIsMined =
        currentMines[this.getTileIndex(initClickX, initClickY)] ||
        this.getSurroundingTileCoordinates(initClickX, initClickY).some(
          ([x, y]) => currentMines[this.getTileIndex(x, y)],
        );
      i++;
    } while (i < 10_000 && openingIsMined);
    this.minesIndex = minesIndex;
  }

  /**
   * Assigns each tile its mine status and the count of mined neighbors.
   */
  private populateTiles(): void {
    for (const [i, tile] of this.tiles.entries()) {
      tile.populate(
        this.minesIndex[i],
        this.getSurroundingTileCoordinates(tile.x, tile.y).filter(([x, y]) => this.minesIndex[this.getTileIndex(x, y)])
          .length,
      );
    }
  }

  /**
   * Places mines on the first interaction, then flags or uncovers the selected tile.
   * Modifier keys and secondary pointer buttons select flagging.
   *
   * @param event - Pointer event containing the button and modifier state.
   * @param x - Tile column.
   * @param y - Tile row.
   */
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

  /**
   * Converts tile coordinates to the row-major index used by tiles and mine positions.
   *
   * @param x - Tile column.
   * @param y - Tile row.
   * @returns The flat array index.
   */
  private getTileIndex(x: number, y: number): number {
    return y * this.tilesX + x;
  }

  /**
   * Returns the up to eight adjacent coordinates within the board boundaries.
   * The center tile is excluded.
   *
   * @param x - Center tile column.
   * @param y - Center tile row.
   * @returns Valid neighboring coordinates.
   */
  private getSurroundingTileCoordinates(x: number, y: number): [number, number][] {
    // prettier-ignore
    const nearbyTiles: [number, number][] = [
      [x - 1, y - 1], [x + 0, y - 1], [x + 1, y - 1],
      [x - 1, y + 0],                 [x + 1, y + 0],
      [x - 1, y + 1], [x + 0, y + 1], [x + 1, y + 1]
    ];
    return nearbyTiles.filter(([a, b]) => a >= 0 && a < this.tilesX && b >= 0 && b < this.tilesY);
  }

  /**
   * Uncovers an eligible tile and recursively expands regions without neighboring mines.
   * A mined tile reveals all mines; flags and already uncovered tiles stop recursion.
   *
   * @param x - Horizontal tile or canvas coordinate.
   * @param y - Vertical tile or canvas coordinate.
   */
  private uncoverTile(x: number, y: number): void {
    const tile = this.tiles[this.getTileIndex(x, y)];
    if (!tile.isCovered || tile.isFlagged) {
      return;
    }
    tile.uncover();
    if (tile.isMined) {
      this.triggeredMinedTile = tile;
      for (const t of this.tiles) {
        if (t.isMined) {
          t.uncover();
        }
      }
    } else if (tile.hasNearbyMines === 0) {
      /**
       * Empty tiles expand into their neighbors. Each recursive call uncovers
       * its tile before expanding, so already visited tiles stop recursion.
       */
      for (const [a, b] of this.getSurroundingTileCoordinates(x, y)) this.uncoverTile(a, b);
    }
    this.updateBoardState();
  }

  /**
   * Toggles a covered tile's flag, updates the shared flag count, and checks the game outcome.
   *
   * @param x - Horizontal tile or canvas coordinate.
   * @param y - Vertical tile or canvas coordinate.
   */
  private toggleFlag(x: number, y: number): void {
    const tile = this.tiles[this.getTileIndex(x, y)];
    if (!tile.isCovered) {
      return;
    }
    tile.toggleFlag();
    this.flagsCount = this.tiles.reduce((c, t) => (t.isFlagged ? c + 1 : c), 0);
    this.setFlagsCount(this.flagsCount);
    this.updateBoardState();
  }

  /**
   * Checks whether every safe tile is uncovered. Mines need not be flagged to win.
   *
   * @returns Whether every safe tile is uncovered.
   */
  private isBoardSolved(): boolean {
    return this.tiles.every(
      tile =>
        (tile.isMined && (tile.isFlagged || tile.isCovered)) || (!tile.isMined && !tile.isFlagged && !tile.isCovered),
    );
  }

  /**
   * Determines victory or loss, adds the completion overlay, notifies the store, and redraws.
   */
  private updateBoardState(): void {
    const lost = !!this.triggeredMinedTile;
    const won = !lost && this.isBoardSolved();
    if (lost || won) {
      const fillStyle = won ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)';
      const overlay = new PaintContainer({
        fillStyle,
        width: this.width,
        height: this.height,
        onClick: () => {
          this.close();
        },
      });
      this.paintEngine.add(overlay);
      this.finish(won ? GameFinalStatus.Won : GameFinalStatus.Lost);
    }
    this.paintEngine.render();
  }
}
