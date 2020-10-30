import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GameBoardComponent } from './game-board.component';
import { GameTileComponent } from './game-tile/game-tile.component';
import { GameBoardOverlayComponent } from './game-board-overlay/game-board-overlay.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    GameBoardComponent,
    GameTileComponent,
    GameBoardOverlayComponent
  ],
  exports: [
    GameBoardComponent
  ]
})
export class GameBoardModule { }
