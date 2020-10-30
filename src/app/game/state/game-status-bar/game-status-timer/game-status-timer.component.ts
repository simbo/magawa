import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GameService } from 'src/app/game/game.service';
import { GameTimerService } from 'src/app/game/timer/game-timer.service';

import { GameState } from '../../game-state.enum';
import { GameStateService } from '../../game-state.service';


@Component({
  selector: 'm-game-status-timer',
  templateUrl: './game-status-timer.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameStatusTimerComponent implements OnInit, OnDestroy {

  public duration!: number | GameState.Paused;

  private readonly unsubscribeSubject = new Subject<void>();

  constructor(
    private readonly game: GameService,
    private readonly timer: GameTimerService,
    private readonly state: GameStateService,
    private readonly changeDetector: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    combineLatest([
      this.timer.duration$,
      this.state.isPaused$
    ])
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(([duration, isPaused]) => {
        this.duration = isPaused ? GameState.Paused : duration;
        this.changeDetector.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this.unsubscribeSubject.next();
  }

  public togglePause(event: Event): void {
    event.preventDefault();
    this.game.togglePause();
  }

}
