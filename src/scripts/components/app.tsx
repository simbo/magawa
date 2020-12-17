import { createHashHistory } from 'history';
import { Component, h, VNode } from 'preact';
import Router from 'preact-router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppRoute } from '../lib/app-route.enum';
import { GameState } from '../store/game/game-state.interface';
import { gameStore, gameStoreContext } from '../store/game/game-store';
import { AboutView } from './about-view';
import { GameView } from './game-view';
import { HighscoresView } from './highscores-view';
import { MenuView } from './menu-view';

interface AppState {
  gameState: GameState;
}

export class App extends Component<{}, AppState> {
  private readonly unsubscribeSubject = new Subject<void>();

  constructor() {
    super();
    gameStore.state$.pipe(takeUntil(this.unsubscribeSubject)).subscribe(gameState => this.setState({ gameState }));
  }

  public componentWillUnmount(): void {
    this.unsubscribeSubject.next();
  }

  public render(props: never, { gameState }: AppState): VNode {
    return (
      <div class="c-app">
        <gameStoreContext.Provider value={gameState}>
          <Router history={createHashHistory()}>
            <GameView path={AppRoute.Game} />
            <HighscoresView path={AppRoute.Highscores} />
            <AboutView path={AppRoute.About} />
            <MenuView path={AppRoute.Home} />
          </Router>
        </gameStoreContext.Provider>
      </div>
    );
  }
}
