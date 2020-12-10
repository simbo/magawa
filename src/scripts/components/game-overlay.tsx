import { Component, Fragment, h, VNode } from 'preact';
import { useContext } from 'preact/hooks';

import { gameSelectors } from '../store/game/game-selectors';
import { GameStoreContext } from '../store/game/game-store';

export class GameOverlay extends Component {
  public render(): VNode {
    const gameState = useContext(GameStoreContext);
    const isPaused = gameSelectors.isPaused(gameState);
    const isWon = gameSelectors.isWon(gameState);
    return (
      <div className="c-game-overlay">
        {isPaused
          ? this.pausedContent()
          : isWon
          ? this.wonContent()
          : this.lostContent()}
      </div>
    );
  }

  private pausedContent(): VNode {
    return <Fragment>PAUSED</Fragment>;
  }

  private lostContent(): VNode {
    return <Fragment>LOST</Fragment>;
  }

  private wonContent(): VNode {
    return <Fragment>WON</Fragment>;
  }
}
