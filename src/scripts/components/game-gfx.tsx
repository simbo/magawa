import { Component, createRef, type VNode } from 'preact';
import { useContext } from 'preact/hooks';

import { AppRoute } from '../lib/app-route.enum';
import { GameBoard } from '../lib/game-board';
import { route } from '../lib/hash-router';
import { GameAction } from '../store/game/game-actions';
import { gameSelectors } from '../store/game/game-selectors';
import { gameStore, gameStoreContext } from '../store/game/game-store';

/**
 * Bridges game-store actions and the canvas-based game board.
 */
export class GameGfx extends Component {
  private readonly viewRef = createRef<HTMLCanvasElement>();
  private unsubscribeActions: (() => void) | undefined;

  private board!: GameBoard;
  private tileSize!: number;
  private tilesX!: number;
  private tilesY!: number;
  private minesCount!: number;

  /**
   * Creates the board after its canvas element is mounted and connects callbacks to store actions.
   */
  public override componentDidMount(): void {
    this.board = new GameBoard(
      this.viewRef.current,
      this.tileSize,
      this.tilesX,
      this.tilesY,
      this.minesCount,
      () => {
        gameStore.dispatch(GameAction.FirstClick);
      },
      flagsCount => {
        gameStore.dispatch(GameAction.SetFlagsCount, { flagsCount });
      },
      () => {
        gameStore.dispatch(GameAction.Unpause);
      },
      finalStatus => {
        gameStore.dispatch(GameAction.Finish, { finalStatus });
      },
      () => {
        route(AppRoute.Home);
      },
    );
    this.unsubscribeActions = gameStore.subscribeActions(({ name, state }) => {
      if (name === GameAction.Restart || name === GameAction.Start) {
        this.board.initBoard();
      } else if ((name === GameAction.Pause || name === GameAction.TogglePause) && gameSelectors.isPaused(state)) {
        this.board.showPauseOverlay();
      } else if ((name === GameAction.Unpause || name === GameAction.TogglePause) && gameSelectors.isRunning(state)) {
        this.board.hidePauseOverlay();
      }
      if (!gameSelectors.player(state)) {
        route(AppRoute.Home);
      }
    });
  }

  /**
   * Ends action subscriptions and removes the board's developer-mode listener.
   */
  public override componentWillUnmount(): void {
    this.unsubscribeActions?.();
    this.board.destroyBoard();
  }

  /**
   * Captures initial board dimensions from context and renders the canvas element.
   *
   * @returns The rendered view.
   */
  public render(): VNode {
    const gameState = useContext(gameStoreContext);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Initialized only after the first render or board setup.
    if (!this.board) {
      const { tileSize, tilesX, tilesY, minesCount } = gameState;
      this.tileSize = tileSize;
      this.tilesX = tilesX;
      this.tilesY = tilesY;
      this.minesCount = minesCount;
    }
    return (
      <div class="c-game-gfx">
        <canvas class="c-game-gfx__canvas" ref={this.viewRef} onContextMenu={this.onRightClick}></canvas>
        {/* {isFinished || isPaused ? <GameOverlay /> : ''} */}
      </div>
    );
  }

  /**
   * Suppresses the browser context menu so secondary clicks can flag tiles.
   *
   * @param event - Browser event initiating this operation.
   */
  public onRightClick = (event: Event): void => {
    event.preventDefault();
  };
}
