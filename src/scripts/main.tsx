import { h, render } from 'preact';

import { App } from './components/app';
import { resources } from './lib/resources';
import { gameStore } from './store/game/game-store';

if (process.env.NODE_ENV !== 'production') {
  gameStore.actions$.subscribe(({ name, payload, state }) =>
    // tslint:disable-next-line:no-console
    console.log('Action:', name, '\nPayload:', payload, '\nState:', state)
  );
}

resources.loaded$.subscribe(() => {
  document.body.className = '';
  render(<App />, document.body);
});
