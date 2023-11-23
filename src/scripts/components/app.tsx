import { createHashHistory } from 'history';
import { Component, h, VNode } from 'preact';
import AsyncRoute from 'preact-async-route';
import Router, { CustomHistory } from 'preact-router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppRoute } from '../lib/app-route.enum';
import { GameState } from '../store/game/game-state.interface';
import { gameStore, gameStoreContext } from '../store/game/game-store';

interface AppState {
  gameState: GameState;
}

// eslint-disable-next-line @typescript-eslint/ban-types
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
          <Router history={createHashHistory() as unknown as CustomHistory}>
            <AsyncRoute
              path={AppRoute.Game}
              getComponent={() => import('./game-view').then(module => module.GameView)}
            />
            <AsyncRoute
              path={AppRoute.Highscores}
              getComponent={() => import('./highscores-view').then(module => module.HighscoresView)}
            />
            <AsyncRoute
              path={AppRoute.About}
              getComponent={() => import('./about-view').then(module => module.AboutView)}
            />
            <AsyncRoute
              path={AppRoute.Home}
              getComponent={() => import('./menu-view').then(module => module.MenuView)}
            />
          </Router>
        </gameStoreContext.Provider>
      </div>
    );
  }
}
