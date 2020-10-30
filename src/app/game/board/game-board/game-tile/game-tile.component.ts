import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GameService } from 'src/app/game/game.service';
import { GameOptionsService } from 'src/app/game/options/game-options.service';

import { GameBoardService } from '../../game-board.service';


@Component({
  selector: 'm-game-tile',
  templateUrl: './game-tile.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameTileComponent implements OnInit, OnDestroy {

  @Input() public x!: number;
  @Input() public y!: number;

  public flagged = false;
  public covered = true;
  public mined = false;
  public nearbyMines = 0;

  @HostBinding('style.width') public tileSize!: string;

  private readonly unsubscribeSubject = new Subject<void>();

  constructor(
    private readonly game: GameService,
    private readonly options: GameOptionsService,
    private readonly board: GameBoardService,
    private readonly changeDetector: ChangeDetectorRef
  ) { }

  public get classNames(): { [key: string]: boolean } {
    return {
      [`m-game-tile--flagged`]: this.flagged,
      [`m-game-tile--covered`]: this.covered,
      [`m-game-tile--uncovered`]: !this.covered,
      [`m-game-tile--mined`]: !this.covered && this.mined
    };
  }

  public get label(): string {
    if (this.covered && this.flagged) { return '🚩'; }
    if (this.covered) { return ''; }
    if (this.mined) { return '💥'; }
    if (this.nearbyMines) { return `${this.nearbyMines}`; }
    return '';
  }

  public ngOnInit(): void {

    this.options.tilesX$
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(tilesX => {
        this.tileSize = `${100 / tilesX}%`;
      });

    this.board.getTile(this.x, this.y)
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(({ flagged, covered, mined, nearbyMines }) => {
        this.flagged = flagged;
        this.covered = covered;
        this.mined = mined;
        this.nearbyMines = nearbyMines;
        this.changeDetector.markForCheck();
      });

  }

  public ngOnDestroy(): void {
    this.unsubscribeSubject.next();
  }

  public onClickTile(event: MouseEvent): void {
    event.preventDefault();
    if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) {
      this.board.toggleFlagTile(this.x, this.y);
    } else {
      this.board.uncoverTile(this.x, this.y);
    }
  }

  public onRightClickTile(event: MouseEvent): void {
    event.preventDefault();
    this.board.toggleFlagTile(this.x, this.y);
  }

}
