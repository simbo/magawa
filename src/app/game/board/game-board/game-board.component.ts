import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GameService } from '../../game.service';
import { GameOptionsService } from '../../options/game-options.service';


@Component({
  selector: 'm-game-board',
  templateUrl: './game-board.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameBoardComponent {

  public columns: number[] = [];
  public rows: number[] = [];

  constructor(
    private readonly game: GameService,
    private readonly options: GameOptionsService
  ) { }

  public get boardIndex$(): Observable<1[][]> {
    return this.options.options$.pipe(
      map(options => Array(options.tilesY).fill(1)
        .map(() => Array(options.tilesX).fill(1))
      )
    );
  }

  public unpause(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.game.pause();
  }

}
