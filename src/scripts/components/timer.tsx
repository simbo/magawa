import { differenceInMilliseconds } from 'date-fns';
import { Component, type VNode } from 'preact';
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
  private timeout: ReturnType<typeof globalThis.setTimeout> | undefined;

  /**
   * Cancels the pending timer update when the component is removed.
   */
  public override componentWillUnmount(): void {
    this.stopTimeout();
  }

  /**
   * Displays elapsed time and schedules updates only while the game is neither paused nor finished.
   *
   * @returns The rendered view.
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
    const duration = this.getDuration(gameState.startedAt, gameState.finishedAt ?? gameState.pausedAt);
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
   *
   * @param event - Browser event initiating this operation.
   */
  private readonly onClick = (event: Event): void => {
    event.preventDefault();
    gameStore.dispatch(GameAction.TogglePause);
  };

  /**
   * Formats elapsed milliseconds up to the pause timestamp or current time; returns zero before play starts.
   *
   * @param startedAt - Playing-time start adjusted to exclude pauses.
   * @param pausedAt - Pause timestamp, or null while running.
   * @returns Elapsed playing time formatted for display.
   */
  private getDuration(startedAt: Date | null, pausedAt: Date | null): string {
    const date = pausedAt ?? new Date();
    const duration = startedAt ? differenceInMilliseconds(date, startedAt) : 0;
    return formatDuration(duration, false);
  }

  /**
   * Replaces the pending update with a redraw scheduled one second later.
   */
  private startTimeout(): void {
    this.stopTimeout();
    this.timeout = globalThis.setTimeout(() => {
      this.forceUpdate();
    }, 1000);
  }

  /**
   * Cancels the currently scheduled timer redraw, if any.
   */
  private stopTimeout(): void {
    if (this.timeout) {
      globalThis.clearTimeout(this.timeout);
    }
  }
}
