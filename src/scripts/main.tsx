import { h, render } from 'preact';

import { App } from './components/app';
import { resources } from './lib/resources';
import { gameStore } from './store/game/game-store';

/* tslint:disable:no-console */
if (process.env.NODE_ENV !== 'production') {
  gameStore.actions$.subscribe(action =>
    console.log(`Action: "${action.type}"`)
  );
  gameStore.state$.subscribe(state => console.log('State:', state));
}
/* tslint:enable:no-console */

resources.loaded$.subscribe(() => {
  document.body.className = '';
  render(<App />, document.body);
});
