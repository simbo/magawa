import { differenceInMilliseconds } from 'date-fns';
import { Component, Fragment, type VNode } from 'preact';
import { useContext } from 'preact/hooks';

import { AppRoute } from '../lib/app-route.enum';
import { GameDifficulty } from '../lib/game-difficulty';
import { Link, route } from '../lib/hash-router';
import {
  addHighscore,
  getHighscores,
  type Highscore,
  type HighscoreGameDifficulty,
  type HighscoresCollection,
} from '../lib/highscores';
import { GameAction } from '../store/game/game-actions';
import { gameSelectors } from '../store/game/game-selectors';
import { gameStore, gameStoreContext, gameWidth } from '../store/game/game-store';

import { Congratulations } from './congratulations';
import { Flags } from './flags';
import { GameGfx } from './game-gfx';
import { HighscoresTable } from './highscores-table';
import { Restart } from './restart';
import { Timer } from './timer';

/**
 * Saved highscore and surrounding leaderboard entries for the current victory.
 */
interface GameViewState {
  highscores?: HighscoresCollection;
  highscore?: Highscore;
}

/**
 * Coordinates the active game, pause controls, and highscore submission.
 */
export class GameView extends Component<object, GameViewState> {
  private readonly unsubscribeActions: () => void;

  private highscoreSaved = false;
  private submissionGeneration = 0;

  /**
   * Starts a game and subscribes to automatic pause, keyboard controls, and restart events.
   */
  public constructor() {
    super();
    gameStore.dispatch(GameAction.Start);

    globalThis.addEventListener('blur', this.onBlur);
    globalThis.document.addEventListener('keydown', this.onKeyDown);
    this.unsubscribeActions = gameStore.subscribeActions(({ name }) => {
      if (name === GameAction.Start || name === GameAction.Restart) {
        this.submissionGeneration++;
        this.highscoreSaved = false;
        this.setState({ highscore: undefined, highscores: undefined });
      }
    });
  }

  /**
   * Returns direct game links without saved player settings to the start form.
   */
  public override componentDidMount(): void {
    if (!gameStore.state.peek().player) route(AppRoute.Home, true);
  }

  /**
   * Ends event subscriptions and closes the active game in the store.
   */
  public override componentWillUnmount(): void {
    this.submissionGeneration++;
    this.unsubscribeActions();
    globalThis.removeEventListener('blur', this.onBlur);
    globalThis.document.removeEventListener('keydown', this.onKeyDown);
    gameStore.dispatch(GameAction.Close);
  }

  /**
   * Displays game controls and the board, submitting a won preset game's result once.
   *
   * @param _props - Component props, unused by this view.
   * @param root0 - Component props or action input.
   * @param root0.highscores - Optional leaderboard entries around the saved result.
   * @param root0.highscore - Optional saved result shown after winning.
   * @returns The rendered view.
   */
  public render(_props: object, { highscores, highscore }: GameViewState): VNode {
    const gameState = useContext(gameStoreContext);
    if (gameSelectors.isClosed(gameState)) {
      return <div></div>;
    }
    const isWon = gameSelectors.isWon(gameState);
    const { difficulty, startedAt, finishedAt, player } = gameState;
    if (isWon && !this.highscoreSaved && difficulty !== GameDifficulty.Custom) {
      void this.saveHighscore(startedAt as Date, finishedAt as Date, player as string, difficulty);
    }
    const width = gameWidth.value;
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
            <HighscoresTable rows={highscores.items} highlight={highscore.id} />
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

  /**
   * Pauses play when the browser window loses focus.
   */
  private readonly onBlur = (): void => {
    gameStore.dispatch(GameAction.Pause);
  };

  /**
   * Toggles pause with the documented keyboard shortcuts.
   *
   * @param event - Keyboard event from the active document.
   */
  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (event.code === 'KeyP' || event.code === 'Escape') gameStore.dispatch(GameAction.TogglePause);
  };

  /**
   * Marks submission as started, saves the winning time, and loads entries around its rank.
   * Submission errors are swallowed so the finished game remains usable.
   *
   * @param startedAt - Playing-time start adjusted to exclude pauses.
   * @param finishedAt - Timestamp at which play finished.
   * @param player - Player name associated with the game or query.
   * @param difficulty - Selected game difficulty.
   */
  private async saveHighscore(
    startedAt: Date,
    finishedAt: Date,
    player: string,
    difficulty: HighscoreGameDifficulty,
  ): Promise<void> {
    /**
     * Sets the submission guard before awaiting the API so repeated renders
     * do not submit the same victory while the request is pending.
     */
    this.highscoreSaved = true;
    const generation = this.submissionGeneration;
    try {
      const highscore = await addHighscore(difficulty, player, differenceInMilliseconds(finishedAt, startedAt));
      const highscores = await getHighscores({ difficulty, rank: highscore.rank });
      if (generation === this.submissionGeneration) this.setState({ highscore, highscores });
    } catch {
      /*
      empty
      */
    }
  }
}
