import { createHashHistory } from 'history';
import { Component, h, VNode } from 'preact';
import Router, { CustomHistory } from 'preact-router';
import { lazy, Suspense } from 'preact/compat';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppRoute } from '../lib/app-route.enum';
import { GameState } from '../store/game/game-state.interface';
import { gameStore, gameStoreContext } from '../store/game/game-store';

interface AppState {
  gameState: GameState;
}

const GameView = lazy(() => import('./game-view').then(module => module.GameView));
const HighscoresView = lazy(() => import('./highscores-view').then(module => module.HighscoresView));
const AboutView = lazy(() => import('./about-view').then(module => module.AboutView));
const MenuView = lazy(() => import('./menu-view').then(module => module.MenuView));

export class App extends Component<object, AppState> {
  private readonly unsubscribeSubject = new Subject<void>();

  constructor() {
    super();
    gameStore.state$.pipe(takeUntil(this.unsubscribeSubject)).subscribe(gameState => this.setState({ gameState }));
  }

  public componentWillUnmount(): void {
    this.unsubscribeSubject.next();
  }

  public render(_props: object, { gameState }: AppState): VNode {
    return (
      <div class="c-app">
        <gameStoreContext.Provider value={gameState}>
          <Suspense fallback={<div>Loading...</div>}>
            <Router history={createHashHistory() as unknown as CustomHistory}>
              <GameView path={AppRoute.Game} />
              <HighscoresView path={AppRoute.Highscores} />
              <AboutView path={AppRoute.About} />
              <MenuView path={AppRoute.Home} />
            </Router>
          </Suspense>
        </gameStoreContext.Provider>
      </div>
    );
  }

  public componentDidMount(): void {
    Promise.all([
      import('./game-view'),
      import('./highscores-view'),
      import('./about-view'),
      import('./menu-view')
    ]).catch(error => console.error(error));
  }
}
