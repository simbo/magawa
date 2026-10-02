import { Component, type VNode } from 'preact';
import { useContext } from 'preact/hooks';

import { IconName } from '../lib/icon-name.enum';
import { gameStoreContext } from '../store/game/game-store';

/**
 * Displays the number of placed flags alongside the total mine count.
 */
export class Flags extends Component {
  /**
   * Reads the current flag and mine counts from game context and displays their ratio.
   *
   * @returns The rendered view.
   */
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
