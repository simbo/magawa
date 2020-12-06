import { Component, h, VNode } from 'preact';

import { GameFinalStatus } from '../lib/game-status.enum';
import { IconName } from '../lib/icon-name.enum';
import { GameActions } from '../store/game/game-actions';
import { Icon } from './icon';

interface RestartProps {
  finalStatus: GameFinalStatus | null;
}

export class Restart extends Component<RestartProps> {
  public render({ finalStatus }: RestartProps): VNode {
    const iconName =
      finalStatus === null
        ? IconName.Magawa
        : finalStatus === GameFinalStatus.Won
        ? IconName.Party
        : IconName.Dead;
    return (
      <button class="c-restart" title="Restart Game" onClick={this.onClick}>
        <Icon name={iconName}></Icon>
      </button>
    );
  }

  private readonly onClick = (event: Event): void => {
    event.preventDefault();
    GameActions.restart();
  };
}
