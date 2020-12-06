import { Component, h, VNode } from 'preact';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GameReducers } from '../store/game/game-reducers';
import { GameState } from '../store/game/game-state';
import { gameStore } from '../store/game/game-store';
import { Flags } from './flags';
import { GameView } from './game-view';
import { Restart } from './restart';
import { Timer } from './timer';

export class GameContainer extends Component<{}, GameState> {
  private readonly unsubscribeSubject = new Subject<void>();

  constructor() {
    super();
    gameStore.state$
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(state => this.setState(state));
  }

  public componentWillUnmount(): void {
    this.unsubscribeSubject.next();
  }

  public render(props: never, state: GameState): VNode {
    const isPaused = GameReducers.isPaused(state);
    const isFinished = GameReducers.isFinished(state);
    const isWon = GameReducers.isWon(state);
    const {
      startedAt,
      flagsCount,
      minesCount,
      tileSize,
      tilesX,
      tilesY,
      finalStatus
    } = state;
    const width = tileSize * tilesX;
    return (
      <div class="c-game-container">
        <div className="c-game-container__bar" style={`width:${width}px`}>
          <div className="c-game-container__bar-item">
            <Timer
              startedAt={startedAt as Date}
              isPaused={isPaused}
              isFinished={isFinished}
            />
          </div>
          <div className="c-game-container__bar-item">
            <Restart finalStatus={finalStatus} />
          </div>
          <div className="c-game-container__bar-item">
            <Flags flagsCount={flagsCount} minesCount={minesCount} />
          </div>
        </div>
        <div className="c-game-container__view">
          <GameView
            tileSize={tileSize}
            tilesX={tilesX}
            tilesY={tilesY}
            minesCount={minesCount}
            isPaused={isPaused}
            isFinished={isFinished}
            isWon={isWon}
          />
        </div>
      </div>
    );
  }
}
