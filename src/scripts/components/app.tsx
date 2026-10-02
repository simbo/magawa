import { Component, type VNode } from 'preact';
import { lazy, Suspense } from 'preact/compat';

import { AppRoute } from '../lib/app-route.enum';
import { DevMode } from '../lib/dev-mode';
import { HashRouter } from '../lib/hash-router';
import type { GameState } from '../store/game/game-state.interface';
import { gameStore, gameStoreContext } from '../store/game/game-store';

/**
 * State shared by the routed views and the developer-mode indicator.
 */
interface AppState {
  gameState: GameState;
  devMode: boolean;
}

/**
 * Coordinates the active game, pause controls, and highscore submission.
 */
const GameView = lazy(async () => import('./game-view').then(module => module.GameView));

/**
 * Loads leaderboard pages and exposes difficulty and player filters.
 */
const HighscoresView = lazy(async () => import('./highscores-view').then(module => module.HighscoresView));

/**
 * Displays the game rules, controls, and project background.
 */
const AboutView = lazy(async () => import('./about-view').then(module => module.AboutView));

/**
 * Displays the start form and links to the leaderboard and project information.
 */
const MenuView = lazy(async () => import('./menu-view').then(module => module.MenuView));

/**
 * Displays a persistent visual indicator while developer mode is enabled.
 */
const DevLayer = lazy(async () => import('./dev-layer').then(module => module.DevLayer));

/**
 * Connects the game store to routed views and the developer-mode indicator.
 */
export class App extends Component<object, AppState> {
  private readonly unsubscribeState: () => void;

  /**
   * Initializes developer mode and subscribes to store updates and mode-change events.
   */
  public constructor() {
    super();
    this.state = { gameState: gameStore.state.peek(), devMode: DevMode.isEnabled() };
    this.unsubscribeState = gameStore.state.subscribe(gameState => {
      this.setState(state => ({ ...state, gameState }));
    });
    globalThis.document.addEventListener(DevMode.CHANGE_EVENT_TYPE, this.onDevModeChange);
  }

  /**
   * Ends the store subscription and removes the developer-mode event listener.
   */
  public override componentWillUnmount(): void {
    this.unsubscribeState();
    globalThis.document.removeEventListener(DevMode.CHANGE_EVENT_TYPE, this.onDevModeChange);
  }

  /**
   * Preloads routed views so subsequent navigation can reuse their loaded modules.
   */
  public override componentDidMount(): void {
    Promise.all([
      import('./game-view'),
      import('./highscores-view'),
      import('./about-view'),
      import('./menu-view'),
    ]).catch((error: unknown) => {
      console.error(error);
    });
  }

  /**
   * Provides game state to hash-routed views and conditionally displays the developer indicator.
   *
   * @param _props - Component props, unused by this view.
   * @param root0 - Component props or action input.
   * @param root0.gameState - Current state distributed to game views.
   * @param root0.devMode - Whether developer mode is enabled.
   * @returns The rendered view.
   */
  public render(_props: object, { gameState, devMode }: AppState): VNode {
    return (
      <div class="c-app">
        <gameStoreContext.Provider value={gameState}>
          <Suspense fallback={<div class="page-loading"></div>}>
            <HashRouter
              routes={{
                [AppRoute.Game]: <GameView />,
                [AppRoute.Highscores]: <HighscoresView />,
                [AppRoute.About]: <AboutView />,
                [AppRoute.Home]: <MenuView />,
              }}
            />
          </Suspense>
        </gameStoreContext.Provider>
        <Suspense fallback={''}>{devMode ? <DevLayer /> : ''}</Suspense>
      </div>
    );
  }

  /**
   * Updates the developer indicator from the mode-change event payload.
   *
   * @param event - Mode-change event carrying the persisted developer-mode value.
   */
  private readonly onDevModeChange = (event: Event): void => {
    const { devMode } = (event as CustomEvent<{ devMode: boolean }>).detail;
    this.setState(state => ({ ...state, devMode }));
  };
}
