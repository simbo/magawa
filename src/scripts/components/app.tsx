import { createHashHistory } from 'history';
import { Component, h, VNode } from 'preact';
import Router, { CustomHistory } from 'preact-router';
import { lazy, Suspense } from 'preact/compat';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppRoute } from '../lib/app-route.enum';
import { DevMode } from '../lib/dev-mode';
import { GameState } from '../store/game/game-state.interface';
import { gameStore, gameStoreContext } from '../store/game/game-store';

/**
 * State shared by the routed views and the developer-mode indicator.
 */
interface AppState {
  gameState?: GameState;
  devMode?: boolean;
}

/**
 * Coordinates the active game, pause controls, and highscore submission.
 */
const GameView = lazy(() => import('./game-view').then(module => module.GameView));
/**
 * Loads leaderboard pages and exposes difficulty and player filters.
 */
const HighscoresView = lazy(() => import('./highscores-view').then(module => module.HighscoresView));
/**
 * Displays the game rules, controls, and project background.
 */
const AboutView = lazy(() => import('./about-view').then(module => module.AboutView));
/**
 * Displays the start form and links to the leaderboard and project information.
 */
const MenuView = lazy(() => import('./menu-view').then(module => module.MenuView));
/**
 * Displays a persistent visual indicator while developer mode is enabled.
 */
const DevLayer = lazy(() => import('./dev-layer').then(module => module.DevLayer));

/**
 * Connects the game store to routed views and the developer-mode indicator.
 */
export class App extends Component<object, AppState> {
  private readonly unsubscribeSubject = new Subject<void>();

  /**
   * Initializes developer mode and subscribes to store updates and mode-change events.
   */
  constructor() {
    super();
    this.state = { devMode: DevMode.isEnabled() };
    gameStore.state$
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(gameState => this.setState(state => ({ ...state, gameState })));
    document.addEventListener(DevMode.CHANGE_EVENT_TYPE, this.onDevModeChange);
  }

  /**
   * Ends the store subscription and removes the developer-mode event listener.
   */
  public componentWillUnmount(): void {
    this.unsubscribeSubject.next();
    document.removeEventListener(DevMode.CHANGE_EVENT_TYPE, this.onDevModeChange);
  }

  /**
   * Preloads routed views so subsequent navigation can reuse their loaded modules.
   */
  public componentDidMount(): void {
    Promise.all([
      import('./game-view'),
      import('./highscores-view'),
      import('./about-view'),
      import('./menu-view')
    ]).catch(error => console.error(error));
  }

  /**
   * Provides game state to hash-routed views and conditionally displays the developer indicator.
   */
  public render(_props: object, { gameState, devMode }: AppState): VNode {
    return (
      <div class="c-app">
        <gameStoreContext.Provider value={gameState as GameState}>
          <Suspense fallback={<div class="page-loading"></div>}>
            <Router history={createHashHistory() as unknown as CustomHistory}>
              <GameView path={AppRoute.Game} />
              <HighscoresView path={AppRoute.Highscores} />
              <AboutView path={AppRoute.About} />
              <MenuView path={AppRoute.Home} />
            </Router>
          </Suspense>
        </gameStoreContext.Provider>
        <Suspense fallback={''}>{devMode ? <DevLayer /> : ''}</Suspense>
      </div>
    );
  }

  /**
   * Updates the developer indicator from the mode-change event payload.
   */
  private readonly onDevModeChange = ({ detail: { devMode } }: CustomEventInit): void => {
    this.setState(state => ({ ...state, devMode }));
  };
}
