import { Component, h, VNode } from 'preact';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { GameActions } from '../store/game/game-actions';
import { GameReducers } from '../store/game/game-reducers';
import { GameState } from '../store/game/game-state';
import { gameStore } from '../store/game/game-store';
import { GameContainer } from './game-container';
import { GameMenu } from './game-menu';

export class App extends Component<{}, GameState> {
  private readonly unsubscribeSubject = new Subject<void>();

  constructor() {
    super();
    gameStore.state$
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(state => this.setState(state));

    fromEvent<Event>(window, 'blur')
      .pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(() => GameActions.pause());

    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        takeUntil(this.unsubscribeSubject),
        filter(event => event.code === 'KeyP')
      )
      .subscribe(() => GameActions.togglePause());
  }

  public componentWillUnmount(): void {
    this.unsubscribeSubject.next();
  }

  public render(props: never, state: GameState): VNode {
    const isClosed = GameReducers.isClosed(state);
    return (
      <div class="c-app">
        {isClosed ? <GameMenu></GameMenu> : <GameContainer></GameContainer>}
      </div>
    );
  }
}
