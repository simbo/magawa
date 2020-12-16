import { Effects } from 'small-store';

import { GameAction, GameActionPayloads } from './game-actions';
import { gameSelectors } from './game-selectors';
import { GameState } from './game-state.interface';

export const gameEffects: Effects<GameState, GameAction, GameActionPayloads> = {
  [GameAction.Restart]: (action, state, dispatch) => {
    dispatch(GameAction.Start);
  },

  [GameAction.TogglePause]: (action, state, dispatch) => {
    if (gameSelectors.isPaused(state)) {
      dispatch(GameAction.Unpause);
    } else {
      dispatch(GameAction.Pause);
    }
  }
};
