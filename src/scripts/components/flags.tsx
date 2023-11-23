import { Component, h, VNode } from 'preact';
import { useContext } from 'preact/hooks';

import { IconName } from '../lib/icon-name.enum';
import { gameStoreContext } from '../store/game/game-store';

export class Flags extends Component {
  public render(): VNode {
    const { flagsCount, minesCount } = useContext(gameStoreContext);
    return (
      <div class="c-flags" title="Flags / Mines">
        <div class="c-flags__label">
          {flagsCount}/{minesCount}
        </div>
        <div class="c-flags__icon">
          <img class="e-icon" src={`icons/${IconName.FlagOnGreen}.png`} />
        </div>
      </div>
    );
  }
}
