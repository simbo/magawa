import { Component, h, VNode } from 'preact';
import { useContext } from 'preact/hooks';

import { GameFinalStatus } from '../lib/game-status.enum';
import { IconName } from '../lib/icon-name.enum';
import { GameAction } from '../store/game/game-actions';
import { gameStore, GameStoreContext } from '../store/game/game-store';
import { Icon } from './icon';

export class Restart extends Component {
  public render(): VNode {
    const { finalStatus } = useContext(GameStoreContext);
    const iconName =
      finalStatus === null
        ? IconName.Magawa
        : finalStatus === GameFinalStatus.Won
        ? IconName.Party
        : IconName.Dead;
    return (
      <button class="c-restart" title="Restart Game" onClick={this.onClick}>
        <Icon name={iconName} />
      </button>
    );
  }

  private readonly onClick = (event: Event): void => {
    event.preventDefault();
    gameStore.dispatch(GameAction.Restart);
  };
}
