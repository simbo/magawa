import { NgModule } from '@angular/core';

import { GameDurationFormatPipe } from './game-duration-format.pipe';


@NgModule({
  imports: [
  ],
  declarations: [
    GameDurationFormatPipe
  ],
  exports: [
    GameDurationFormatPipe
  ]
})
export class GameUtilsModule { }
