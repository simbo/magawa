import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { GameBoardModule } from './board/game-board/game-board.module';
import { GameComponent } from './game.component';
import { GameOptionsComponent } from './options/game-options/game-options.component';
import { GameStatusModule } from './state/game-status-bar/game-status.module';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GameStatusModule,
    GameBoardModule
  ],
  declarations: [
    GameComponent,
    GameOptionsComponent
  ],
  exports: [
    GameComponent
  ]
})
export class GameModule { }
