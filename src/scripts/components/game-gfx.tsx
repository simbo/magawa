import { Component, createRef, h, VNode } from 'preact';
import { route } from 'preact-router';
import { useContext } from 'preact/hooks';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppRoute } from '../lib/app-route.enum';
import { GameBoard } from '../lib/game-board.model';
import { GameAction } from '../store/game/game-actions';
import { gameSelectors } from '../store/game/game-selectors';
import { gameStore, GameStoreContext } from '../store/game/game-store';

export class GameGfx extends Component {
  private readonly viewRef = createRef<HTMLCanvasElement>();
  private readonly unsubscribeSubject = new Subject<void>();

  private board!: GameBoard;
  private tileSize!: number;
  private tilesX!: number;
  private tilesY!: number;
  private minesCount!: number;

  constructor() {
    super();
    gameStore.actions$
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(({ name, state }) => {
        if (name === GameAction.Restart) {
          this.board.initBoard();
        } else if (name === GameAction.Pause && gameSelectors.isPaused(state)) {
          this.board.showPauseOverlay();
        } else if (
          name === GameAction.Unpause &&
          gameSelectors.isRunning(state)
        ) {
          this.board.hidePauseOverlay();
        }
        if (!gameSelectors.player(state)) {
          route(AppRoute.Home);
        }
      });
  }

  public componentDidMount(): void {
    this.board = new GameBoard(
      this.viewRef.current as HTMLCanvasElement,
      this.tileSize,
      this.tilesX,
      this.tilesY,
      this.minesCount,
      () => gameStore.dispatch(GameAction.FirstClick),
      flagsCount =>
        gameStore.dispatch(GameAction.SetFlagsCount, { flagsCount }),
      () => gameStore.dispatch(GameAction.Unpause),
      finalStatus => gameStore.dispatch(GameAction.Finish, { finalStatus }),
      () => route(AppRoute.Home)
    );
  }

  public componentWillUnmount(): void {
    this.unsubscribeSubject.next();
  }

  public render(): VNode {
    const gameState = useContext(GameStoreContext);
    if (!this.board) {
      const { tileSize, tilesX, tilesY, minesCount } = gameState;
      this.tileSize = tileSize;
      this.tilesX = tilesX;
      this.tilesY = tilesY;
      this.minesCount = minesCount;
    }
    return (
      <div class="c-game-gfx">
        <canvas
          class="c-game-gfx__canvas"
          ref={this.viewRef}
          onContextMenu={this.onRightClick}
        ></canvas>
        {/* {isFinished || isPaused ? <GameOverlay /> : ''} */}
      </div>
    );
  }

  public onRightClick = (event: Event): void => {
    event.preventDefault();
  };
}
