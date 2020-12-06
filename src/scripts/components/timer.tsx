import { differenceInMilliseconds } from 'date-fns';
import { Component, h, VNode } from 'preact';

import { formatDuration } from '../lib/format-duration.function';
import { IconName } from '../lib/icon-name.enum';
import { GameActions } from '../store/game/game-actions';
import { Icon } from './icon';

interface TimerProps {
  startedAt: Date;
  isPaused: boolean;
  isFinished: boolean;
}

interface TimerState {
  duration: number;
}

export class Timer extends Component<TimerProps, TimerState> {
  private interval!: number;

  constructor(props: TimerProps) {
    super(props);
    this.setDuration(props.startedAt);
  }

  public componentDidMount(): void {
    this.startInterval();
  }

  public shouldComponentUpdate({
    startedAt,
    isFinished,
    isPaused
  }: TimerProps): boolean {
    if (this.props.isFinished !== isFinished) {
      if (!isFinished) {
        this.clearInterval();
        return false;
      } else {
        this.setDuration(startedAt);
        this.startInterval();
        return true;
      }
    }
    if (this.props.isPaused !== isPaused) {
      return true;
    }
    if (isPaused) {
      return false;
    }
    return true;
  }

  public componentWillUnmount(): void {
    this.clearInterval();
  }

  public render({ isPaused }: TimerProps, { duration }: TimerState): VNode {
    const durationText = formatDuration(duration);
    return (
      <button
        class="c-timer"
        title={isPaused ? 'Continue' : 'Pause'}
        onClick={this.onClick}
      >
        <div className="c-timer__icon">
          <Icon name={isPaused ? IconName.Zzz : IconName.Stopwatch}></Icon>
        </div>
        <div className="c-timer__label">{durationText}</div>
      </button>
    );
  }

  private readonly onClick = (event: Event): void => {
    event.preventDefault();
    GameActions.togglePause();
  };

  private setDuration(startedAt: Date): void {
    const duration = differenceInMilliseconds(new Date(), startedAt);
    this.setState({ duration });
  }

  private startInterval(): void {
    this.interval = window.setInterval(() => {
      if (!this.props.isPaused && !this.props.isFinished) {
        this.setDuration(this.props.startedAt);
      }
    }, 1000);
  }

  private clearInterval(): void {
    if (this.interval) {
      window.clearInterval(this.interval);
    }
  }
}
