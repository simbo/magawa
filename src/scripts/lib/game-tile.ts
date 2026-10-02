import { DevMode } from './dev-mode';
import { PaintResourceName } from './paint-assets';
import { PaintContainer, type PaintContainerOnClick } from './paint-container';
import { PaintText } from './paint-text';
import { PaintTexture } from './paint-texture';

/**
 * Fill and border colors for covered and uncovered board tiles.
 */
enum GameTileColor {
  Line = '#ebdfbe',
  FillCovered = '#6b8e23',
  FillUncovered = '#f9edcc',
}

/**
 * Maintains one tile's logical state and the drawable objects representing it.
 */
export class GameTile {
  public readonly container: PaintContainer;
  public readonly posX: number;
  public readonly posY: number;

  private mined = false;
  private covered = true;
  private flagged = false;
  private nearbyMines = 0;

  /**
   * Creates a covered tile and its clickable container at the corresponding pixel position.
   *
   * @param x - Horizontal tile or canvas coordinate.
   * @param y - Vertical tile or canvas coordinate.
   * @param size - Tile edge length in logical pixels.
   * @param onClick - Handler called when the tile is pressed.
   */
  public constructor(
    public readonly x: number,
    public readonly y: number,
    private readonly size: number,
    onClick: PaintContainerOnClick,
  ) {
    this.posX = this.size * this.x;
    this.posY = this.size * this.y;
    this.container = new PaintContainer({ width: this.size, height: this.size, x: this.posX, y: this.posY, onClick });
    this.updateAppearance();
  }

  /**
   * Reports whether a mine has been assigned to this tile.
   *
   * @returns Whether the tile contains a mine.
   */
  public get isMined(): boolean {
    return this.mined;
  }

  /**
   * Reports whether this tile has not yet been uncovered.
   *
   * @returns Whether the tile is still covered.
   */
  public get isCovered(): boolean {
    return this.covered;
  }

  /**
   * Reports whether the player has marked this tile with a flag.
   *
   * @returns Whether the tile is flagged.
   */
  public get isFlagged(): boolean {
    return this.flagged;
  }

  /**
   * Returns the number of mines in adjacent tiles, despite the boolean-like getter name.
   *
   * @returns The count of adjacent mines.
   */
  public get hasNearbyMines(): number {
    return this.nearbyMines;
  }

  /**
   * Assigns mine information and refreshes the tile's drawable contents.
   *
   * @param isMined - Whether this tile contains a mine.
   * @param nearbyMines - Number of mines in adjacent tiles.
   */
  public populate(isMined: boolean, nearbyMines: number): void {
    this.mined = isMined;
    this.nearbyMines = nearbyMines;
    this.updateAppearance();
  }

  /**
   * Disables interaction, removes any flag, and updates the uncovered appearance.
   */
  public uncover(): void {
    this.container.interactive = false;
    this.covered = false;
    this.flagged = false;
    this.updateAppearance();
  }

  /**
   * Inverts the flag state and refreshes the appearance; board logic checks eligibility.
   */
  public toggleFlag(): void {
    this.flagged = !this.flagged;
    this.updateAppearance();
  }

  /**
   * Rebuilds drawable contents from the current tile state and developer-mode setting.
   * Does not alter mine placement, coverage, flags, or interaction, and does not redraw the canvas.
   */
  public updateAppearance(): void {
    this.container.clear();
    this.container.fillStyle = this.covered ? GameTileColor.FillCovered : GameTileColor.FillUncovered;
    this.container.strokeStyle = GameTileColor.Line;
    if (this.flagged) {
      this.container.add(
        new PaintTexture({
          asset: PaintResourceName.Flag,
          width: this.size * 0.65,
          height: this.size * 0.65,
          x: (this.size - this.size * 0.65) / 2,
          y: (this.size - this.size * 0.65) / 2,
        }),
      );
    }

    /**
     * Developer mode reveals mine textures while preserving the covered state.
     * The mine is drawn after the flag, so it appears above a flag on the same tile.
     */
    if (this.mined && (!this.covered || DevMode.isEnabled())) {
      this.container.add(
        new PaintTexture({
          asset: PaintResourceName.Boom,
          width: this.size,
          height: this.size,
        }),
      );
    }
    if (!this.mined && !this.covered && this.nearbyMines > 0) {
      this.container.add(
        new PaintText({
          text: String(this.nearbyMines),
          fillStyle: 'black',
          x: this.size / 2,
          y: this.size / 2,
        }),
      );
    }
  }
}
