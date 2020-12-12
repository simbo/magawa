import { differenceInMilliseconds } from 'date-fns';
import { Component, Fragment, h, VNode } from 'preact';
import { useContext } from 'preact/hooks';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { GameDifficulty } from '../lib/game-difficulty.enum';
import { highscoresManager } from '../lib/highscores-manager';
import {
  HighscoreGameDifficulty,
  HighscoresEntry,
  HighscoresForDifficulty
} from '../lib/highscores.interface';
import { GameAction } from '../store/game/game-actions';
import { gameSelectors } from '../store/game/game-selectors';
import { gameStore, GameStoreContext } from '../store/game/game-store';
import { Congratulations } from './congratulations';
import { Flags } from './flags';
import { GameGfx } from './game-gfx';
import { HighscoresTable } from './highscores-table';
import { Restart } from './restart';
import { Timer } from './timer';

interface GameViewState {
  highscores: HighscoresForDifficulty;
  entry: HighscoresEntry;
}

export class GameView extends Component<{}, GameViewState> {
  private readonly unsubscribeSubject = new Subject<void>();

  private highscoreSaved = false;

  constructor() {
    super();
    gameStore.dispatch(GameAction.Start);

    fromEvent<Event>(window, 'blur')
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(() => gameStore.dispatch(GameAction.Pause));

    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        takeUntil(this.unsubscribeSubject),
        filter(event => event.code === 'KeyP' || event.code === 'Escape')
      )
      .subscribe(() => gameStore.dispatch(GameAction.TogglePause));
  }

  public componentWillUnmount(): void {
    this.unsubscribeSubject.next();
    gameStore.dispatch(GameAction.Close);
  }

  public render(props: never, { highscores, entry }: GameViewState): VNode {
    const gameState = useContext(GameStoreContext);
    if (gameSelectors.isClosed(gameState)) {
      return <div></div>;
    }
    const isWon = gameSelectors.isWon(gameState);
    const { difficulty, startedAt, finishedAt, player } = gameState;
    if (isWon && !this.highscoreSaved && difficulty !== GameDifficulty.Custom) {
      this.saveHighscore(
        startedAt as Date,
        finishedAt as Date,
        player as string,
        difficulty
      );
    }
    const width = gameSelectors.width(gameState);
    return (
      <div class="c-game-view">
        <div
          class="c-game-view__container"
          style={`width:${width}px; min-width:${width * 0.5}px`}
        >
          <div class="c-game-view__bar">
            <div class="c-game-view__bar-item">
              <Timer />
            </div>
            <div class="c-game-view__bar-item">
              <Restart />
            </div>
            <div class="c-game-view__bar-item">
              <Flags />
            </div>
          </div>
          <GameGfx />
        </div>
        {isWon ? (
          <Fragment>
            <Congratulations entry={entry} />
            <HighscoresTable list={highscores?.list} highlight={entry?.id} />
          </Fragment>
        ) : (
          ''
        )}
      </div>
    );
  }

  private saveHighscore(
    startedAt: Date,
    finishedAt: Date,
    player: string,
    difficulty: HighscoreGameDifficulty
  ): void {
    this.highscoreSaved = true;
    highscoresManager
      .add(differenceInMilliseconds(finishedAt, startedAt), player, difficulty)
      .subscribe(({ entry, highscores }) => {
        this.setState({ highscores, entry });
      });
  }
}
