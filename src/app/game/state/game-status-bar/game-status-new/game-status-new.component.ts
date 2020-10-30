import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GameService } from 'src/app/game/game.service';

import { GameState } from '../../game-state.enum';
import { GameStateService } from '../../game-state.service';


@Component({
  selector: 'm-game-status-new',
  templateUrl: './game-status-new.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameStatusNewComponent {

  constructor(
    private readonly state: GameStateService,
    private readonly game: GameService
  ) { }

  public get label$(): Observable<string> {
    return this.state.state$.pipe(
      map(state => {
        switch (state) {
          case GameState.Lost:
            return '😩';
          case GameState.Won:
            return '😃';
          case GameState.Paused:
            return '😴';
          case GameState.Running:
            return '🙂';
          case GameState.Initializing:
          default:
            return '😶';
        }
      })
    );
  }

  public restart(event: Event): void {
    event.preventDefault();
    this.game.restart();
  }

}
