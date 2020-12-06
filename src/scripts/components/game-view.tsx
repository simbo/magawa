import { Component, createRef, h, RefObject, VNode } from 'preact';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { GameBoard } from '../lib/game-board.model';
import { GameAction } from '../store/game/game-actions';
import { gameStore } from '../store/game/game-store';

interface GameViewProps {
  tileSize: number;
  tilesX: number;
  tilesY: number;
  minesCount: number;
  isPaused: boolean;
  isFinished: boolean;
  isWon: boolean;
}

export class GameView extends Component<GameViewProps> {
  public viewRef: RefObject<HTMLCanvasElement> = createRef();

  private readonly unsubscribeSubject = new Subject<void>();
  private board!: GameBoard;

  constructor(props: GameViewProps) {
    super(props);
    gameStore.actions$
      .pipe(
        takeUntil(this.unsubscribeSubject),
        filter(({ type }) => type === GameAction.Restart)
      )
      .subscribe(() => this.board.initBoard());
  }

  public shouldComponentUpdate({
    isPaused,
    isFinished,
    isWon
  }: GameViewProps): boolean {
    if (this.props.isPaused !== isPaused) {
      if (isPaused) {
        this.board.showPauseOverlay();
      } else {
        this.board.hidePauseOverlay();
      }
    } else if (isFinished) {
      if (isWon) {
        this.board.showWonOverlay();
      } else {
        this.board.showLostOverlay();
      }
    }
    return false;
  }

  public componentDidMount(): void {
    this.board = new GameBoard(
      this.viewRef.current as HTMLCanvasElement,
      this.props.tileSize,
      this.props.tilesX,
      this.props.tilesY,
      this.props.minesCount
    );
  }

  public componentWillUnmount(): void {
    this.unsubscribeSubject.next();
  }

  public render(): VNode {
    return (
      <div class="c-game-view">
        <canvas
          class="c-game-view__canvas"
          ref={this.viewRef}
          onContextMenu={this.onRightClick}
        ></canvas>
      </div>
    );
  }

  public onRightClick = (event: Event): void => {
    event.preventDefault();
  };
}
