import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GameUtilsModule } from '../../utils/game-utils.module';
import { GameStatusBarComponent } from './game-status-bar.component';
import { GameStatusFlagsComponent } from './game-status-flags/game-status-flags.component';
import { GameStatusNewComponent } from './game-status-new/game-status-new.component';
import { GameStatusOptionsComponent } from './game-status-options/game-status-options.component';
import { GameStatusTimerComponent } from './game-status-timer/game-status-timer.component';


@NgModule({
  imports: [
    CommonModule,
    GameUtilsModule
  ],
  declarations: [
    GameStatusBarComponent,
    GameStatusOptionsComponent,
    GameStatusNewComponent,
    GameStatusFlagsComponent,
    GameStatusTimerComponent
  ],
  exports: [
    GameStatusBarComponent
  ]
})
export class GameStatusModule { }
