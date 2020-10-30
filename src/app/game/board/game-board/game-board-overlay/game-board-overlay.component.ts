import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { GameService } from 'src/app/game/game.service';
import { GameState } from 'src/app/game/state/game-state.enum';
import { GameStateService } from 'src/app/game/state/game-state.service';


@Component({
  selector: 'm-game-board-overlay',
  templateUrl: './game-board-overlay.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameBoardOverlayComponent {

  constructor(
    private game: GameService,
    private state: GameStateService
  ) {}

  public get visible$(): Observable<boolean> {
    return this.state.isRunning$.pipe(
      map(state => !state)
    );
  }

  public get classNames$(): Observable<{ [klass: string]: boolean }> {
    return this.state.state$.pipe(
      map(state => ({
        'm-game-overlay--paused': state === GameState.Paused,
        'm-game-overlay--won': state === GameState.Won,
        'm-game-overlay--lost': state === GameState.Lost
      })),
      tap(console.log)
    );
  }

  public get title$(): Observable<string> {
    return this.state.state$.pipe(
      map(state => ({
        [`${GameState.Paused}`]: 'paused',
        [`${GameState.Won}`]: 'You win!',
        [`${GameState.Lost}`]: 'Loser!'
      }[state]))
    );
  }

  public get text$(): Observable<string> {
    return this.state.state$.pipe(
      map(state => ({
        [`${GameState.Paused}`]: `Click to continue`,
        [`${GameState.Won}`]: ``,
        [`${GameState.Lost}`]: `Click to restart`
      }[state]))
    );
  }

}
