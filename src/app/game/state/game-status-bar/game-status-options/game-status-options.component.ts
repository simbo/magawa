import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { GameOptionsService } from 'src/app/game/options/game-options.service';


@Component({
  selector: 'm-game-status-options',
  templateUrl: './game-status-options.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameStatusOptionsComponent {

  constructor(
    private options: GameOptionsService
  ) { }

  public showOptions(event: Event): void {
    event.preventDefault();
    this.options.show();
  }

}
