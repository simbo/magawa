import { differenceInMilliseconds } from 'date-fns';
import { Component, h, VNode } from 'preact';
import { useContext } from 'preact/hooks';

import { formatDuration } from '../lib/format-duration.function';
import { IconName } from '../lib/icon-name.enum';
import { GameAction } from '../store/game/game-actions';
import { gameSelectors } from '../store/game/game-selectors';
import { gameStore, GameStoreContext } from '../store/game/game-store';
import { Icon } from './icon';

export class Timer extends Component {
  private timeout!: number;

  public componentWillUnmount(): void {
    this.stopTimeout();
  }

  public render(): VNode {
    const gameState = useContext(GameStoreContext);
    const isPaused = gameSelectors.isPaused(gameState);
    const isFinished = gameSelectors.isFinished(gameState);
    if (isFinished || isPaused) {
      this.stopTimeout();
    } else {
      this.startTimeout(gameState.startedAt as Date);
    }
    const duration = this.getDuration(
      gameState.startedAt as Date,
      gameState.pausedAt
    );
    const label = isPaused ? 'Continue' : 'Pause';
    const icon = isPaused ? IconName.Zzz : IconName.Stopwatch;
    return (
      <button class="c-timer" title={label} onClick={this.onClick}>
        <div class="c-timer__icon">
          <Icon name={icon} />
        </div>
        <div class="c-timer__label">{duration}</div>
      </button>
    );
  }

  private readonly onClick = (event: Event): void => {
    event.preventDefault();
    gameStore.dispatch(GameAction.TogglePause);
  };

  private getDuration(startedAt: Date, pausedAt: Date | null): string {
    const date = pausedAt === null ? new Date() : pausedAt;
    const duration = startedAt ? differenceInMilliseconds(date, startedAt) : 0;
    return formatDuration(duration, false);
  }

  private startTimeout(startedAt: Date): void {
    this.stopTimeout();
    this.timeout = window.setTimeout(() => {
      this.forceUpdate();
    }, 1000);
  }

  private stopTimeout(): void {
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }
  }
}
