import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { GameBoardService } from './board/game-board.service';
import { GameEventType } from './events/game-event-type.enum';
import { GameEventsService } from './events/game-events.service';
import { GameService } from './game.service';
import { GameOptionsService } from './options/game-options.service';
import { GameEndState } from './state/game-end-state.type';
import { GameStateService } from './state/game-state.service';
import { GameTimerService } from './timer/game-timer.service';
import { WINDOW } from './utils/window.token';


@Component({
  selector: 'm-game',
  templateUrl: './game.component.html',
  providers: [
    GameService,
    GameStateService,
    GameTimerService,
    GameBoardService,
    GameEventsService,
    GameOptionsService
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements OnInit, OnDestroy {

  public maxWidth!: string;

  private readonly maxTileSize = 3;

  private readonly unsubscribeSubject = new Subject<void>();

  constructor(
    public readonly options: GameOptionsService,
    private readonly game: GameService,
    private readonly events: GameEventsService,
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(WINDOW) private readonly window: Window
  ) { }

  public ngOnInit(): void {

    this.options.tilesX$
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(tilesX => {
        this.maxWidth = `${tilesX * this.maxTileSize}em`;
      });

    this.events.listen(GameEventType.Pause)
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(() => {
        this.game.pause();
      });

    this.events.listen(GameEventType.Unpause)
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(() => {
        this.game.unpause();
      });

    this.events.listen<GameEndState>(GameEventType.End)
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(state => {
        this.game.finish(state);
      });

    fromEvent<Event>(this.window, 'blur')
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(e => {
        this.game.pause();
      });

    fromEvent<KeyboardEvent>(this.document, 'keydown')
      .pipe(
        filter(event => event.code === 'KeyP'),
        takeUntil(this.unsubscribeSubject)
      )
      .subscribe(() => {
        this.game.togglePause();
      });

  }

  public ngOnDestroy(): void {
    this.unsubscribeSubject.next();
  }

}
