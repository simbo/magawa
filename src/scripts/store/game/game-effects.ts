import { Effects } from 'small-store';

import { GameAction, GameActionPayloads } from './game-actions';
import { gameSelectors } from './game-selectors';
import { GameState } from './game-state.interface';

/**
 * Follow-up actions implementing restart and pause-toggle behavior.
 */
export const gameEffects: Effects<GameState, GameAction, GameActionPayloads> = {
  /**
   * Starts a fresh game in response to a restart request.
   */
  [GameAction.Restart]: (_action, _state, dispatch) => {
    dispatch(GameAction.Start);
  },

  /**
   * Dispatches unpause when paused, otherwise dispatches pause.
   */
  [GameAction.TogglePause]: (_action, state, dispatch) => {
    if (gameSelectors.isPaused(state)) {
      dispatch(GameAction.Unpause);
    } else {
      dispatch(GameAction.Pause);
    }
  }
};
