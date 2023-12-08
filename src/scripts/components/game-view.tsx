import { differenceInMilliseconds } from 'date-fns';
import { Component, Fragment, h, VNode } from 'preact';
import { Link } from 'preact-router';
import { useContext } from 'preact/hooks';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { AppRoute } from '../lib/app-route.enum';
import { GameDifficulty } from '../lib/game-difficulty';
import {
  addHighscore,
  getHighscores,
  Highscore,
  HighscoreGameDifficulty,
  HighscoresCollection
} from '../lib/highscores';
import { GameAction } from '../store/game/game-actions';
import { gameSelectors } from '../store/game/game-selectors';
import { gameStore, gameStoreContext } from '../store/game/game-store';

import { Congratulations } from './congratulations';
import { Flags } from './flags';
import { GameGfx } from './game-gfx';
import { HighscoresTable } from './highscores-table';
import { Restart } from './restart';
import { Timer } from './timer';

interface GameViewState {
  highscores?: HighscoresCollection;
  highscore?: Highscore;
}

if (process.env.NODE_ENV !== 'production') {
  gameStore.actions$.subscribe(({ name, payload, state }) =>
    // eslint-disable-next-line no-console
    console.log('Action:', name, '\nPayload:', payload, '\nState:', state)
  );
}

export class GameView extends Component<object, GameViewState> {
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

    gameStore.actions$
      .pipe(
        takeUntil(this.unsubscribeSubject),
        filter(({ name }) => name === GameAction.Start)
      )
      .subscribe(() => {
        this.highscoreSaved = false;
        this.setState({});
      });
  }

  public componentWillUnmount(): void {
    this.unsubscribeSubject.next();
    gameStore.dispatch(GameAction.Close);
  }

  public render(_props: object, { highscores, highscore }: GameViewState): VNode {
    const gameState = useContext(gameStoreContext);
    if (gameSelectors.isClosed(gameState)) {
      return <div></div>;
    }
    const isWon = gameSelectors.isWon(gameState);
    const { difficulty, startedAt, finishedAt, player } = gameState;
    if (isWon && !this.highscoreSaved && difficulty !== GameDifficulty.Custom) {
      this.saveHighscore(startedAt as Date, finishedAt as Date, player as string, difficulty);
    }
    const width = gameSelectors.width(gameState);
    return (
      <div class="c-game-view">
        <div class="c-game-view__container" style={`width:${width}px; min-width:${width * 0.5}px`}>
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
        {isWon && highscore && highscores ? (
          <Fragment>
            <Congratulations highscore={highscore} difficulty={difficulty as HighscoreGameDifficulty} />
            <HighscoresTable rows={highscores.items} highlight={highscore?.id} />
          </Fragment>
        ) : (
          ''
        )}
        <div className="e-back-button">
          <Link href={AppRoute.Home} class="e-back-button__button e-button">
            ← Back
          </Link>
        </div>
      </div>
    );
  }

  private async saveHighscore(
    startedAt: Date,
    finishedAt: Date,
    player: string,
    difficulty: HighscoreGameDifficulty
  ): Promise<void> {
    this.highscoreSaved = true;
    try {
      const highscore = await addHighscore(difficulty, player, differenceInMilliseconds(finishedAt, startedAt));
      const highscores = await getHighscores({ difficulty, rank: highscore.rank });
      this.setState({ highscore, highscores });
    } catch {
      /* empty */
    }
  }
}
