import { Component, h, VNode } from 'preact';
import { useContext } from 'preact/hooks';

import { GameFinalStatus } from '../lib/game-status';
import { IconName } from '../lib/icon-name.enum';
import { GameAction } from '../store/game/game-actions';
import { gameStore, gameStoreContext } from '../store/game/game-store';

export class Restart extends Component {
  public render(): VNode {
    const { finalStatus } = useContext(gameStoreContext);
    const iconName =
      // eslint-disable-next-line unicorn/no-nested-ternary
      finalStatus === null ? IconName.Magawa : finalStatus === GameFinalStatus.Won ? IconName.Party : IconName.Dead;
    return (
      <button class="c-restart" title="Restart Game" onClick={this.onClick}>
        <img class="e-icon" src={`icons/${iconName}.png`} />
      </button>
    );
  }

  private readonly onClick = (event: Event): void => {
    event.preventDefault();
    gameStore.dispatch(GameAction.Restart);
  };
}
