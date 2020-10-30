export class GameTile {

  public flagged = false;
  public covered = true;

  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly mined: boolean,
    public readonly nearbyMines: number
  ) {}

  public uncover(): void {
    this.covered = false;
    this.flagged = false;
  }

  public flag(): void {
    this.flagged = true;
  }

  public unflag(): void {
    this.flagged = false;
  }

  public toggleFlag(): void {
    this.flagged = !this.flagged;
  }

}
