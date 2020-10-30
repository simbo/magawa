import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GameBoardService } from 'src/app/game/board/game-board.service';
import { GameOptionsService } from 'src/app/game/options/game-options.service';


@Component({
  selector: 'm-game-status-flags',
  templateUrl: './game-status-flags.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameStatusFlagsComponent {

  constructor(
    private readonly options: GameOptionsService,
    private readonly board: GameBoardService
  ) { }

  public get label$(): Observable<string> {
    return combineLatest([
      this.options.minesCount$,
      this.board.flagsCount$
    ]).pipe(
      map(([minesCount, flagsCount]) => `${flagsCount}/${minesCount}`)
    );
  }

}
