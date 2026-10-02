import { differenceInMilliseconds } from 'date-fns';
import { Component, h, VNode } from 'preact';
import { useContext } from 'preact/hooks';

import { formatDuration } from '../lib/format-duration.function';
import { IconName } from '../lib/icon-name.enum';
import { GameAction } from '../store/game/game-actions';
import { gameSelectors } from '../store/game/game-selectors';
import { gameStore, gameStoreContext } from '../store/game/game-store';

/**
 * Displays elapsed playing time and provides the pause toggle.
 */
export class Timer extends Component {
  private timeout!: number;

  /**
   * Cancels the pending timer update when the component is removed.
   */
  public componentWillUnmount(): void {
    this.stopTimeout();
  }

  /**
   * Displays elapsed time and schedules updates only while the game is neither paused nor finished.
   */
  public render(): VNode {
    const gameState = useContext(gameStoreContext);
    const isPaused = gameSelectors.isPaused(gameState);
    const isFinished = gameSelectors.isFinished(gameState);
    if (isFinished || isPaused) {
      this.stopTimeout();
    } else {
      this.startTimeout();
    }
    const duration = this.getDuration(gameState.startedAt as Date, gameState.pausedAt);
    const label = isPaused ? 'Continue' : 'Pause';
    const icon = isPaused ? IconName.Zzz : IconName.Stopwatch;
    return (
      <button class="c-timer" title={label} onClick={this.onClick}>
        <div class="c-timer__icon">
          <img class="e-icon" src={`icons/${icon}.png`} />
        </div>
        <div class="c-timer__label">{duration}</div>
      </button>
    );
  }

  /**
   * Dispatches a pause toggle without triggering the button's default action.
   */
  private readonly onClick = (event: Event): void => {
    event.preventDefault();
    gameStore.dispatch(GameAction.TogglePause);
  };

  /**
   * Formats elapsed milliseconds up to the pause timestamp or current time; returns zero before play starts.
   */
  private getDuration(startedAt: Date, pausedAt: Date | null): string {
    const date = pausedAt === null ? new Date() : pausedAt;
    const duration = startedAt ? differenceInMilliseconds(date, startedAt) : 0;
    return formatDuration(duration, false);
  }

  /**
   * Replaces the pending update with a redraw scheduled one second later.
   */
  private startTimeout(): void {
    this.stopTimeout();
    this.timeout = window.setTimeout(() => {
      this.forceUpdate();
    }, 1000);
  }

  /**
   * Cancels the currently scheduled timer redraw, if any.
   */
  private stopTimeout(): void {
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }
  }
}
