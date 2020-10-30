import { Injectable } from '@angular/core';

import { GameBoardService } from './board/game-board.service';
import { GameDifficulty } from './options/game-difficulty.enum';
import { GameOptions } from './options/game-options.interface';
import { GameOptionsService } from './options/game-options.service';
import { GameEndState } from './state/game-end-state.type';
import { GameStateService } from './state/game-state.service';
import { GameTimerService } from './timer/game-timer.service';


@Injectable()
export class GameService {

  constructor(
    private timer: GameTimerService,
    private state: GameStateService,
    private board: GameBoardService,
    private options: GameOptionsService
  ) {}

  public start(difficulty: GameDifficulty, options?: GameOptions): void {
    this.options.set(difficulty, options);
    this.state.setInitializing();
    this.board.initialize();
    this.timer.resetTimer();
    this.timer.startTimer();
    this.state.setRunning();
  }

  public restart(): void {
    this.start(this.options.difficulty, this.options.options);
  }

  public pause(): void {
    if (!this.state.isRunning) {
      return;
    }
    this.timer.stopTimer();
    this.state.setPaused();
  }

  public unpause(): void {
    if (!this.state.isPaused) {
      return;
    }
    this.timer.startTimer();
    this.state.setRunning();
  }

  public togglePause(): void {
    if (this.state.isRunning) {
      this.pause();
    } else {
      this.unpause();
    }
  }

  public finish(state: GameEndState): void {
    if (!this.state.isRunning) {
      return;
    }
    this.timer.stopTimer();
    this.state.set(state);
  }


}
